import { Operator } from './operator'; // <-- this will be in cdk8s
import { WebService } from './web-service';

const cr = new Operator();

cr.addProvider({
  kind: 'WebService',
  apiVersion: 'samples.cdk8s.org/v1alpha1',
  // schema: ...
  handler: {
    apply: (scope, name, spec) => new WebService(scope, name, spec),
  },
});

cr.synth();