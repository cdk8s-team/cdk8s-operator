const { TypeScriptProject } = require('projen');

const name = 'webservice-operator';
const project = new TypeScriptProject({
  name: name,
  releaseEveryCommit: false,
  deps: [
    'cdk8s',
    'cdk8s-plus',
    'constructs@^2',
    'yaml' // needed for cdk8s-server
  ],
});

project.addScript('cdk8s-pack', 'yarn -s compile', `docker build -t eladb/cdk8s-pack-prototype .`);
project.addScript('cdk8s-server', 'node lib/cdk8s-server.js');

project.synth();
