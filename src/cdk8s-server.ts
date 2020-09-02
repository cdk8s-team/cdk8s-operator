// cdk8s-server: http server which synthesizes cdk operators
// ------------------------------------------------------------------------------------
// request body should include an input manifest for a single resource
// response will include the synthesized output manifest

import * as http from 'http';
import { spawn } from 'child_process';
import * as yaml from 'yaml';
import * as fs from 'fs';
import * as stream from 'stream';

const config = yaml.parse(fs.readFileSync('cdk8s.yaml', 'utf-8'));

const command = config.app;
if (!command) {
  throw new Error('cdk8s.yaml is missing an "app" attribute');
}

// needed in docker
process.on('SIGINT', function() {
  process.exit();
});

const server = http.createServer((req, res) => {

  const input = fs.createWriteStream('/tmp/input.json');
  req.pipe(input);
  input.on('close', () => {
    const child = spawn(`${command} /tmp/input.json`, {
      stdio: [ 'pipe', 'pipe', 'pipe' ],
      shell: true,
    });

    const stderr = new Array<Buffer>();

    child.stdout.on('data', chunk => res.write(chunk));
    child.stderr.on('data', chunk => stderr.push(chunk));

    const flusherr = (out: stream.Writable) => {
      for (const c of stderr) {
        out.write(c);
      }
    };

    child.on('exit', code => {
      if (code === 0) {
        flusherr(process.stderr); // flush stderr to server terminal
        return res.end();
      }

      res.statusCode = 400; // bad request

      flusherr(res);

      res.end();
    });

  });

});

server.listen(8080);

console.error('cdk8s-server listening on 8080');
console.error('- Request body should include a single k8s resource in json');
console.error(`- Request will be piped through STDIN to ${command}`)
console.error('- Response is the STDOUT and expected to be a multi-resource yaml manifest');

