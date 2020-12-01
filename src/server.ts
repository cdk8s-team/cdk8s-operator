import { spawn } from 'child_process';
import { createWriteStream, mkdtempSync, readFileSync } from 'fs';
import { createServer, IncomingMessage, Server as HttpServer, ServerResponse } from 'http';
import { tmpdir } from 'os';
import { join } from 'path';

export interface ServerProps {
  /**
   * The command to execute in order to synthesize the CDK app.
   */
  readonly appCommand: string;
}

export class Server {
  private readonly server: HttpServer;
  private readonly appCommand: string;
  private readonly tmpdir: string;

  constructor(props: ServerProps) {
    this.appCommand = props.appCommand;

    this.server = createServer((req, res) => this.handleRequest(req, res).catch(e => {
      console.error('server error: ', e);
      res.statusCode = 500;
      res.write(e.message);
      res.end();
    }));

    this.tmpdir = mkdtempSync(join(tmpdir(), 'cdk8s-operator-'));
  }

  /**
   * Starts HTTP server.
   * @param port The port to listen to. If not specified, the `PORT` environment
   * variable will be used. If that's not specified an available port will be
   * auto-selected.
   */
  public async listen(port?: number): Promise<number> {
    const lport = port ?? process.env.PORT ?? 0;
    return new Promise((ok, ko) => {
      this.server.listen(lport, () => {
        const addr = this.server.address();
        if (typeof(addr) === 'string') {
          throw new Error(`cannot determine port from server address ${addr}`);
        }

        return ok(addr.port);
      });

      this.server.on('error', err => ko(err));
    });
  }

  /**
   * Stop server.
   */
  public close() {
    this.server.close();
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
    const inputfile = await this.writeInputFile(req);

    const child = spawn(this.appCommand, [inputfile], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    const stderr = new Array<Buffer>();

    res.setHeader('Content-Type', 'application/json');

    // stdout should go directly to the response
    child.stdout.on('data', chunk => {
      process.stderr.write('output: ' + chunk);
      res.write(chunk);
    });

    // for stderr: write to server terminal and only send back if we exited with a non-zero
    child.stderr.on('data', chunk => {
      process.stderr.write(chunk);
      stderr.push(chunk);
    });

    // will be caused by the async handler and 500 will be returned.
    child.on('error', err => {
      throw err;
    });

    child.on('exit', code => {
      if (code !== 0) {
        res.statusCode = 500;
        for (const c of stderr) {
          res.write(c);
        }
        res.end();
      }

      // success
      return res.end();
    });
  }

  private async writeInputFile(req: IncomingMessage): Promise<string> {
    return new Promise((ok, ko) => {
      const inputfile = join(this.tmpdir, `input-${Math.round(Math.random() * 999999)}.json`);
      const input = createWriteStream(inputfile);
      req.pipe(input);

      input.on('close', () => {
        try {
          const inputJson = JSON.parse(readFileSync(inputfile, 'utf-8'));
          console.error(`input: ${JSON.stringify(inputJson)}`);
          return ok(inputfile);
        } catch (e) {
          return ko(new Error(`unable to parse request body as JSON: ${e}`));
        }
      });

      req.on('error', err => ko(err.message));
    });
  }
}
