# cdk8s-operator

> Create Kubernetes CRD Operators using CDK8s Constructs

This is a multi-language (jsii) library and a command-line tool that allows you
to create Kubernetes operators for CRDs (Custom Resource Definitions) using
CDK8s.

## Getting Started

Let's create our first CRD served by a CDK8s construct using TypeScript.

The `Operator` construct can be used to create "CDK8s Operators" which are CDK8s
apps which accept an input from a file (or STDIN) with a Kubernetes manifest,
instantiates a custom construct with the `spec` of this input and emits the
resulting manifest to a file (or STDOUT).

In the following example, an operator is created to handle resource of
`org.cdk8s.samples.WebService` kind. As you can see, a single operator can
handle multiple resource kinds.

`my-operator.js`:

```ts
import { WebService } from './web-service';
import { Operator } from './operator'; // <-- this will be in cdk8s

const operator = new Operator();

operator.addProvider({
  kind: 'WebService',
  apiVersion: 'samples.cdk8s.org/v1alpha1',
  // schema: ...
  handler: {
    apply: (scope, name, spec) => new WebService(scope, name, spec),
  },
})

operator.synth();
```

To use this operator, create an `input.json` file, e.g:

```json
{
  "apiVersion": "samples.cdk8s.org/v1alpha1",
  "kind": "WebService",
  "metadata": {
    "name": "my-web-service"
  },
  "spec": {
    "image": "paulbouwer/hello-kubernetes",
    "containerPort": 8080,
    "servicePort": 80
  }
}
```

And run:

```shell
$ node my-operator.js < input.json
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-web-service-deployment-pod-b9bf8233
spec:
  replicas: 1
  selector:
    matchLabels:
      cdk8s.deployment: mywebservicedeployment25C8720D
  template:
    metadata:
      labels:
        cdk8s.deployment: mywebservicedeployment25C8720D
    spec:
      containers:
        - env: []
          image: paulbouwer/hello-kubernetes
          name: main
          ports:
            - containerPort: 8080
          volumeMounts: []
      volumes: []
---
apiVersion: v1
kind: Service
metadata:
  name: my-web-service-deployment-service-pod-e97cbd24
spec:
  externalIPs: []
  ports:
    - port: 80
      targetPort: 8080
  selector:
    cdk8s.deployment: mywebservicedeployment25C8720D
  type: ClusterIP
```

## `cdk8s-server`

This is a CLI command that starts an HTTP server on port 8080. It uses the
`operator` attribute from `cdk8s.yaml`.

Let's use `cdk8s-server` with the operator we defined in the previous example:

```yaml
language: typescript
operator: node my-operator.js
```

Now, if you run:

```shell
$ cdk8s-server
cdk8s-server listening on 8080
- Request body should include a single k8s resource in json
- Request will be piped through STDIN to "node my-operator.js"
- Response is the STDOUT and expected to be a multi-resource yaml manifest
```

Now you can synthesize with cURL:

```shell
$ curl -d @test/input.json http://localhost:8080
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-web-service-deployment-pod-b9bf8233
spec:
  replicas: 1
  selector:
    matchLabels:
      cdk8s.deployment: mywebservicedeployment25C8720D
...
```

## `cdk8s-pack`

This CLI commands creates a Docker image which bundles the operator into a docker image:

```shell
$ cdk8s-pack eladb/cdk8s-pack-prototype
....
```

Now,

```shell
$ docker run -p 8080:8080 eladb/cdk8s-pack-prototype
cdk8s-server listening on 8080
- Request body should include a single k8s resource in json
- Request will be piped through STDIN to "node my-operator.js"
- Response is the STDOUT and expected to be a multi-resource yaml manifest
```

## License

Apache 2.0
