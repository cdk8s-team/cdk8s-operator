import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { Yaml } from 'cdk8s';
import { PodCollection } from './fixtures/pod-collection';
import { Operator } from '../src';

// disable logs
jest.spyOn(console, 'error').mockReturnValue();

test('operator with a single provider', () => {
  const workdir = mktmpdir();
  const inputFile = join(workdir, 'input.json');
  const outputFile = join(workdir, 'output.json');

  const operator = new Operator({
    inputFile,
    outputFile,
  });

  operator.addProvider({
    apiVersion: 'foo.bar/v1beta1',
    kind: 'PodCollection',
    handler: {
      apply: (scope, id, spec) => new PodCollection(scope, id, spec),
    },
  });

  // ----------------------------------------------------------------

  writeFileSync(inputFile, JSON.stringify({
    apiVersion: 'foo.bar/v1beta1',
    kind: 'PodCollection',
    metadata: {
      name: 'my-pods',
    },
    spec: {
      image: 'paulbouwer/hello-kubernetes',
      count: 5,
    },
  }));

  operator.synth();

  expect(Yaml.load(outputFile)).toMatchSnapshot();
});

function mktmpdir() {
  return mkdtempSync(join(tmpdir(), 'operator.test.'));
}