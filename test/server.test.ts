import * as http from 'http';
import { join } from 'path';
import { Server } from '../src';

const ECHO_APP = `${process.execPath} ${join(__dirname, 'fixtures', 'echo-app.js') }`;

jest.spyOn(console, 'error').mockReturnValue();

let server: Server | undefined;

afterEach(() => server?.close());

test('happy flow', async () => {
  server = new Server({ appCommand: ECHO_APP });
  const port = await server.listen();
  const response = await httpPost(port, JSON.stringify({ hello: 'world' }));
  expect(response).toStrictEqual({ apiVersion: 'v1', input: { hello: 'world' }, kind: 'Echo' });
});

test('invalid app command', async () => {
  server = new Server({
    appCommand: 'boom boom boom',
  });

  const port = await server.listen();
  await expectError(httpPost(port, JSON.stringify({ hello: 'world' })), 'boom');
});

test('invalid input', async () => {
  server = new Server({ appCommand: ECHO_APP });
  const port = await server.listen();
  await expectError(httpPost(port, 'INVALID JSON'), 'Internal Server Error: unable to parse request body as JSON: SyntaxError: Unexpected token \'I\', \"INVALID JSON\" is not valid JSON');
});

async function expectError<T>(promise: Promise<T>, expected: string) {
  let error;
  try {
    await promise;
  } catch (e) {
    error = e;
  }
  expect(error).toBeTruthy();
  expect(error?.message.trim()).toContain(expected.trim());
}

async function httpPost(port: number, body: string) {
  return new Promise((ok, ko) => {
    const data = new Array();
    const req = http.request({ port, method: 'POST' }, res => {
      res.on('error', err => ko(err));
      res.on('data', chunk => data.push(chunk));
      res.on('close', () => {
        const response = Buffer.concat(data).toString('utf-8');
        if (res.statusCode !== 200) {
          return ko(new Error(`${res.statusMessage}: ${response}`));
        }

        return ok(JSON.parse(response));
      });
    });

    req.write(body);
    req.end();
  });
}