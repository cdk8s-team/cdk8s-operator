# cdk8s-operator

> Create Kubernetes CRD Operators using CDK8s Constructs

This is a multi-language (jsii) library and a command-line tool that allows you
to create Kubernetes operators for CRDs (Custom Resource Definitions) using
CDK8s.

## Getting Started

Let's create our first CRD served by a CDK8s construct using TypeScript.

### Install CDK8s

Make sure your system has the required CDK8s [prerequisites](https://cdk8s.io/docs/latest/getting-started/#prerequisites).

Install the CDK8s CLI globally through npm:

```shell
$ npm i -g cdk8s-cli
Installing...

# Verify installation
$ cdk8s --version
1.0.0-beta.3
```

### Create a new CDK8s app

Now, let's create a new CDK8s typescript app:

```shell
mkdir hello-operator && cd hello-operator
git init
cdk8s init typescript-app
```

### Install cdk8s-operator

Next, let's install this module as a dependency of our TypeScript project:

```shell
npm install cdk8s-operator
```

### Construct

We will start by creating the construct that implements the abstraction. This is
is just a normal CDK8s custom construct:

Let's create a construct called `PodCollection` which represents a collection of
pods:

`pod-collection.ts`:

```ts
import { Pod } from 'cdk8s-plus-17';
import { Construct } from 'constructs';

export interface PodCollectionProps {
  /** Number of pods */
  readonly count: number;
  /** The docker image to deploy */
  readonly image: string;
}

export class PodCollection extends Construct {
  constructor(scope: Construct, id: string, props: PodCollectionProps) {
    super(scope, id);

    for (let i = 0; i < props.count; ++i) {
      new Pod(this, `pod-${i}`, {
        containers: [ { image: props.image } ]
      });
    }
  }
}
```

### Operator App

Now, we will need to replace out `main.ts` file with an "operator app", which is
a special kind of CDK8s app designed to be executed by the `cdk8s-server` CLI
which is included in this module.

The `Operator` app construct can be used to create "CDK8s Operators" which are
CDK8s apps that accept input from a file (or STDIN) with a Kubernetes manifest,
instantiates a construct with the `spec` as its input and emits the resulting
manifest to STDOUT.

Replace the contents of `main.ts` with the following. We initialize an
`Operator` app and then register a provider which handles resources of API
version `samples.cdk8s.org/v1alpha1` and kind `PodCollection`.

`main.ts`:

```ts
import { Operator } from 'cdk8s-operator';
import { PodCollection } from './pod-collection';

const app = new Operator();

app.addProvider({
  apiVersion: 'samples.cdk8s.org/v1alpha1',
  kind: 'PodCollection',
  handler: {
    apply: (scope, id, props) => new PodCollection(scope, id, props)
  }
})

app.synth();
```

> A single operator can handle any number of resource kinds. Simply call
> `addProvider()` for each apiVersion/kind.

## Using Operators

To use this operator, create an `input.json` file, e.g:

`input.json`:

```json
{
  "apiVersion": "samples.cdk8s.org/v1alpha1",
  "kind": "PodCollection",
  "metadata": {
    "name": "my-collection"
  },
  "spec": {
    "image": "paulbouwer/hello-kubernetes",
    "count": 5
  }
}
```

Compile your code:

```shell
# delete `main.test.ts` since it has some code that won't compile
$ rm -f main.test.*

# compile
$ npm run compile
```

And run:

```shell
$ node main.js input.json
```

<details>
  <summary>STDOUT</summary>

```yaml
apiVersion: "v1"
kind: "Pod"
metadata:
  name: "my-collection-pod-0-c8735c52"
spec:
  containers:
    - env: []
      image: "paulbouwer/hello-kubernetes"
      imagePullPolicy: "Always"
      name: "main"
      ports: []
      volumeMounts: []
  volumes: []
---
apiVersion: "v1"
kind: "Pod"
metadata:
  name: "my-collection-pod-1-c89f58d7"
spec:
  containers:
    - env: []
      image: "paulbouwer/hello-kubernetes"
      imagePullPolicy: "Always"
      name: "main"
      ports: []
      volumeMounts: []
  volumes: []
---
apiVersion: "v1"
kind: "Pod"
metadata:
  name: "my-collection-pod-2-c88d4268"
spec:
  containers:
    - env: []
      image: "paulbouwer/hello-kubernetes"
      imagePullPolicy: "Always"
      name: "main"
      ports: []
      volumeMounts: []
  volumes: []
---
apiVersion: "v1"
kind: "Pod"
metadata:
  name: "my-collection-pod-3-c86866b1"
spec:
  containers:
    - env: []
      image: "paulbouwer/hello-kubernetes"
      imagePullPolicy: "Always"
      name: "main"
      ports: []
      volumeMounts: []
  volumes: []
---
apiVersion: "v1"
kind: "Pod"
metadata:
  name: "my-collection-pod-4-c8b74b1d"
spec:
  containers:
    - env: []
      image: "paulbouwer/hello-kubernetes"
      imagePullPolicy: "Always"
      name: "main"
      ports: []
      volumeMounts: []
  volumes: []
```

</details>

## `cdk8s-server`

This library is shipped with a program called `cdk8s-server` which can be used
to host your operator inside an HTTP server. This server can be used as a
sidecar container with a generic CRD operator (TBD).

```shell
PORT=8080 npx cdk8s-server
Listening on 8080
- App command: node main.js
- Request body should include a single k8s resource in JSON format
- Request will be piped through STDIN to "node main.js"
- Response is the STDOUT and expected to be a multi-resource yaml manifest
```

Now, you can send `input.json` over HTTP:

```shell
curl -d @input.json http://localhost:8080
MANIFEST...
```

## License

Apache 2.0
