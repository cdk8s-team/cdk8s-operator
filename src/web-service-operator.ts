import { WebService } from './web-service';
import { Operator } from './operator'; // <-- this will be in cdk8s

const cr = new Operator();

cr.addProvider({
  kind: 'WebService',
  apiVersion: 'v1',
  group: 'org.cdk8s.samples',
  // schema: ...
  handler: {
    apply: (scope, name, spec) => new WebService(scope, name, spec),
  },
})

cr.synth();