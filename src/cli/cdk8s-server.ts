// cdk8s-server: http server which synthesizes cdk operators
// ------------------------------------------------------------------------------------
// request body should include an input manifest for a single resource
// response will include the synthesized output manifest

import * as fs from 'fs';
import * as yaml from 'yaml';
import { Server } from '../server';

async function main() {
  const config = yaml.parse(fs.readFileSync('cdk8s.yaml', 'utf-8'));

  const command = config.operator;
  if (!command) {
    throw new Error('cdk8s.yaml is missing an "operator" attribute');
  }

  // needed in docker
  process.on('SIGINT', function() {
    process.exit();
  });

  const server = new Server({ appCommand: command });
  const port = await server.listen();

  console.error(`Listening on ${port}`);
  console.error(`- App command: ${command}`);
  console.error('- Request body should include a single k8s resource in JSON format');
  console.error(`- Request will be piped through STDIN to "${command}"`);
  console.error('- Response is the STDOUT and expected to be a multi-resource yaml manifest');
}

main().catch((e: Error) => {
  console.error(e.stack);
  process.exit(1);
});

