const { JsiiProject } = require('projen');

const project = new JsiiProject({
  name: 'cdk8s-operator',
  authorName: 'Elad Ben-Israel',
  authorAddress: 'benisrae@amazon.com',
  repository: 'https://github.com/eladb/cdk8s-pack-prototype.git',
  defaultReleaseBranch: 'master',
  bundledDeps: [
    'yaml',
  ],
  peerDeps: [
    'cdk8s@1.0.0-beta.3',
    'constructs@^3.2.42',
  ],
  bin: {
    'cdk8s-server': 'lib/cli/cdk8s-server.js',
  },

  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

  publishToMaven: {
    javaPackage: 'com.github.eladb.cdk8soperator',
    mavenGroupId: 'com.github.eladb',
    mavenArtifactId: 'cdk8s-operator',
  },

  publishToPypi: {
    distName: 'cdk8s-operator',
    module: 'cdk8s_operator',
  },
});

project.synth();
