const { assert } = require("console");
const { readFileSync } = require("fs");

assert(process.argv[2]);

const input = JSON.parse(readFileSync(process.argv[2], 'utf-8'));

console.log(JSON.stringify({
  apiVersion: 'v1',
  kind: 'Echo',
  input: input
}));