import { DatabaseComposition } from './web-service';
import { Operator } from './operator'; // <-- this will be in cdk8s

const cr = new Operator();

cr.addProvider({
  kind: 'WebService',
  apiVersion: 'samples.cdk8s.org/v1alpha1',
  // schema: ...
  handler: {
    apply: (scope, name, spec) => new DatabaseComposition(scope, name, spec),
  },
})

cr.synth();