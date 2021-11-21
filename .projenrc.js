const { JsiiProject } = require('projen');

const project = new JsiiProject({
  name: 'cdk8s-operator',
  description: 'Create Kubernetes CRD Operators using CDK8s Constructs',
  authorName: 'Amazon Web Services',
  authorUrl: 'https://aws.amazon.com',
  repository: 'https://github.com/eladb/cdk8s-pack-prototype.git',
  defaultReleaseBranch: 'master',
  bundledDeps: [
    'yaml',
  ],
  peerDeps: [
    'cdk8s',
    'constructs',
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
