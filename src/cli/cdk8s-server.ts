#!/usr/bin/env node

// cdk8s-server: http server which synthesizes cdk operators
// ------------------------------------------------------------------------------------
// request body should include an input manifest for a single resource
// response will include the synthesized output manifest

import * as fs from 'fs';
import * as yaml from 'yaml';
import { Server } from '../server';

async function main() {
  const command = resolveAppFromCommandLine() ?? resolveAppFromConfig();
  if (!command) {
    throw new Error('unable to determine how to execute your CDK8s app. You can either pass a command line as arguments (cdk8s-server COMMAND) or specify the "app" attribute in cdk8s.yaml');
  }

  // needed in docker
  process.on('SIGINT', () => process.exit());;

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

function resolveAppFromConfig() {
  if (!fs.existsSync('cdk8s.yaml')) {
    return undefined;
  }

  const config = yaml.parse(fs.readFileSync('cdk8s.yaml', 'utf-8'));
  return config.app;
}

function resolveAppFromCommandLine() {
  if (process.argv.length < 3) {
    return undefined;
  }

  return process.argv.slice(2).join(' ');
}