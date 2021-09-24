const { JsiiProject } = require('projen');

const project = new JsiiProject({
  name: 'cdk8s-operator',
  authorName: 'Amazon Web Services',
  authorUrl: 'https://aws.amazon.com',
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
  minNodeVersion: '12.13.0',

  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

  publishToMaven: {
    javaPackage: 'org.cdk8s.cdk8soperator',
    mavenGroupId: 'org.cdk8s',
    mavenArtifactId: 'cdk8s-operator',
  },

  publishToPypi: {
    distName: 'cdk8s-operator',
    module: 'cdk8s_operator',
  },
  autoApproveOptions: {
    allowedUsernames: ['cdk8s-automation'],
    secret: 'GITHUB_TOKEN',
  },
  autoApproveUpgrades: true,
});

project.synth();
