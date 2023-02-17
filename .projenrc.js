const { Cdk8sTeamJsiiProject } = require('@cdk8s/projen-common');

const project = new Cdk8sTeamJsiiProject({
  name: 'cdk8s-operator',
  description: 'Create Kubernetes CRD Operators using CDK8s Constructs',
  defaultReleaseBranch: 'master',
  bundledDeps: [
    'yaml',
  ],
  peerDeps: [
    'cdk8s',
    'constructs',
  ],
  devDeps: [
    '@cdk8s/projen-common',
  ],
  keywords: [
    'cdk8s',
    'kubernetes',
    'crd',
    'operator',
  ],
  bin: {
    'cdk8s-server': 'lib/cli/cdk8s-server.js',
  },

  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

});

project.synth();
