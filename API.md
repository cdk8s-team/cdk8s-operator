# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Operator <a name="Operator" id="cdk8s-operator.Operator"></a>

A CDK8s app which allows implementing Kubernetes operators using CDK8s constructs.

#### Initializers <a name="Initializers" id="cdk8s-operator.Operator.Initializer"></a>

```typescript
import { Operator } from 'cdk8s-operator'

new Operator(props?: OperatorProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-operator.Operator.Initializer.parameter.props">props</a></code> | <code><a href="#cdk8s-operator.OperatorProps">OperatorProps</a></code> | *No description.* |

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk8s-operator.Operator.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk8s-operator.OperatorProps">OperatorProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-operator.Operator.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk8s-operator.Operator.with">with</a></code> | Applies one or more mixins to this construct. |
| <code><a href="#cdk8s-operator.Operator.synth">synth</a></code> | Reads a Kubernetes manifest in JSON format from STDIN or the file specified as the first positional command-line argument. |
| <code><a href="#cdk8s-operator.Operator.synthYaml">synthYaml</a></code> | Synthesizes the app into a YAML string. |
| <code><a href="#cdk8s-operator.Operator.addProvider">addProvider</a></code> | Adds a custom resource provider to this operator. |

---

##### `toString` <a name="toString" id="cdk8s-operator.Operator.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `with` <a name="with" id="cdk8s-operator.Operator.with"></a>

```typescript
public with(mixins: ...IMixin[]): IConstruct
```

Applies one or more mixins to this construct.

Mixins are applied in order. The list of constructs is captured at the
start of the call, so constructs added by a mixin will not be visited.
Use multiple `with()` calls if subsequent mixins should apply to added
constructs.

###### `mixins`<sup>Required</sup> <a name="mixins" id="cdk8s-operator.Operator.with.parameter.mixins"></a>

- *Type:* ...constructs.IMixin[]

The mixins to apply.

---

##### `synth` <a name="synth" id="cdk8s-operator.Operator.synth"></a>

```typescript
public synth(): void
```

Reads a Kubernetes manifest in JSON format from STDIN or the file specified as the first positional command-line argument.

This manifest is expected to
include a single Kubernetes resource. Then, we match `apiVersion` and
`kind` to one of the registered providers and if we do, we invoke
`apply()`, passing it the `spec` of the input manifest and a chart as a
scope. The chart is then synthesized and the output manifest is written to
STDOUT.

##### `synthYaml` <a name="synthYaml" id="cdk8s-operator.Operator.synthYaml"></a>

```typescript
public synthYaml(): string
```

Synthesizes the app into a YAML string.

##### `addProvider` <a name="addProvider" id="cdk8s-operator.Operator.addProvider"></a>

```typescript
public addProvider(provider: CustomResourceProvider): void
```

Adds a custom resource provider to this operator.

###### `provider`<sup>Required</sup> <a name="provider" id="cdk8s-operator.Operator.addProvider.parameter.provider"></a>

- *Type:* <a href="#cdk8s-operator.CustomResourceProvider">CustomResourceProvider</a>

The provider to add.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-operator.Operator.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk8s-operator.Operator.of">of</a></code> | *No description.* |

---

##### `isConstruct` <a name="isConstruct" id="cdk8s-operator.Operator.isConstruct"></a>

```typescript
import { Operator } from 'cdk8s-operator'

Operator.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="cdk8s-operator.Operator.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `of` <a name="of" id="cdk8s-operator.Operator.of"></a>

```typescript
import { Operator } from 'cdk8s-operator'

Operator.of(c: IConstruct)
```

###### `c`<sup>Required</sup> <a name="c" id="cdk8s-operator.Operator.of.parameter.c"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-operator.Operator.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk8s-operator.Operator.property.charts">charts</a></code> | <code>cdk8s.Chart[]</code> | Returns all the charts in this app, sorted topologically. |
| <code><a href="#cdk8s-operator.Operator.property.outdir">outdir</a></code> | <code>string</code> | The output directory into which manifests will be synthesized. |
| <code><a href="#cdk8s-operator.Operator.property.outputFileExtension">outputFileExtension</a></code> | <code>string</code> | The file extension to use for rendered YAML files. |
| <code><a href="#cdk8s-operator.Operator.property.resolvers">resolvers</a></code> | <code>cdk8s.IResolver[]</code> | Resolvers used by this app. |
| <code><a href="#cdk8s-operator.Operator.property.yamlOutputType">yamlOutputType</a></code> | <code>cdk8s.YamlOutputType</code> | How to divide the YAML output into files. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk8s-operator.Operator.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `charts`<sup>Required</sup> <a name="charts" id="cdk8s-operator.Operator.property.charts"></a>

```typescript
public readonly charts: Chart[];
```

- *Type:* cdk8s.Chart[]

Returns all the charts in this app, sorted topologically.

---

##### `outdir`<sup>Required</sup> <a name="outdir" id="cdk8s-operator.Operator.property.outdir"></a>

```typescript
public readonly outdir: string;
```

- *Type:* string

The output directory into which manifests will be synthesized.

---

##### `outputFileExtension`<sup>Required</sup> <a name="outputFileExtension" id="cdk8s-operator.Operator.property.outputFileExtension"></a>

```typescript
public readonly outputFileExtension: string;
```

- *Type:* string
- *Default:* .k8s.yaml

The file extension to use for rendered YAML files.

---

##### `resolvers`<sup>Required</sup> <a name="resolvers" id="cdk8s-operator.Operator.property.resolvers"></a>

```typescript
public readonly resolvers: IResolver[];
```

- *Type:* cdk8s.IResolver[]

Resolvers used by this app.

This includes both custom resolvers
passed by the `resolvers` property, as well as built-in resolvers.

---

##### `yamlOutputType`<sup>Required</sup> <a name="yamlOutputType" id="cdk8s-operator.Operator.property.yamlOutputType"></a>

```typescript
public readonly yamlOutputType: YamlOutputType;
```

- *Type:* cdk8s.YamlOutputType
- *Default:* YamlOutputType.FILE_PER_CHART

How to divide the YAML output into files.

---


## Structs <a name="Structs" id="Structs"></a>

### CustomResourceProvider <a name="CustomResourceProvider" id="cdk8s-operator.CustomResourceProvider"></a>

#### Initializer <a name="Initializer" id="cdk8s-operator.CustomResourceProvider.Initializer"></a>

```typescript
import { CustomResourceProvider } from 'cdk8s-operator'

const customResourceProvider: CustomResourceProvider = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-operator.CustomResourceProvider.property.apiVersion">apiVersion</a></code> | <code>string</code> | API version of the custom resource. |
| <code><a href="#cdk8s-operator.CustomResourceProvider.property.handler">handler</a></code> | <code><a href="#cdk8s-operator.ICustomResourceProviderHandler">ICustomResourceProviderHandler</a></code> | The construct handler. |
| <code><a href="#cdk8s-operator.CustomResourceProvider.property.kind">kind</a></code> | <code>string</code> | Kind of this custom resource. |

---

##### `apiVersion`<sup>Required</sup> <a name="apiVersion" id="cdk8s-operator.CustomResourceProvider.property.apiVersion"></a>

```typescript
public readonly apiVersion: string;
```

- *Type:* string
- *Default:* "v1"

API version of the custom resource.

---

##### `handler`<sup>Required</sup> <a name="handler" id="cdk8s-operator.CustomResourceProvider.property.handler"></a>

```typescript
public readonly handler: ICustomResourceProviderHandler;
```

- *Type:* <a href="#cdk8s-operator.ICustomResourceProviderHandler">ICustomResourceProviderHandler</a>

The construct handler.

---

##### `kind`<sup>Required</sup> <a name="kind" id="cdk8s-operator.CustomResourceProvider.property.kind"></a>

```typescript
public readonly kind: string;
```

- *Type:* string

Kind of this custom resource.

---

### OperatorProps <a name="OperatorProps" id="cdk8s-operator.OperatorProps"></a>

#### Initializer <a name="Initializer" id="cdk8s-operator.OperatorProps.Initializer"></a>

```typescript
import { OperatorProps } from 'cdk8s-operator'

const operatorProps: OperatorProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-operator.OperatorProps.property.inputFile">inputFile</a></code> | <code>string</code> | A Kubernetes JSON manifest with a single resource that is matched against one of the providers within this operator. |
| <code><a href="#cdk8s-operator.OperatorProps.property.outputFile">outputFile</a></code> | <code>string</code> | Where to write the synthesized output. |

---

##### `inputFile`<sup>Optional</sup> <a name="inputFile" id="cdk8s-operator.OperatorProps.property.inputFile"></a>

```typescript
public readonly inputFile: string;
```

- *Type:* string
- *Default:* first position command-line argument or "/dev/stdin"

A Kubernetes JSON manifest with a single resource that is matched against one of the providers within this operator.

---

##### `outputFile`<sup>Optional</sup> <a name="outputFile" id="cdk8s-operator.OperatorProps.property.outputFile"></a>

```typescript
public readonly outputFile: string;
```

- *Type:* string
- *Default:* "/dev/stdout"

Where to write the synthesized output.

---

### ServerProps <a name="ServerProps" id="cdk8s-operator.ServerProps"></a>

#### Initializer <a name="Initializer" id="cdk8s-operator.ServerProps.Initializer"></a>

```typescript
import { ServerProps } from 'cdk8s-operator'

const serverProps: ServerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-operator.ServerProps.property.appCommand">appCommand</a></code> | <code>string</code> | The command to execute in order to synthesize the CDK app. |

---

##### `appCommand`<sup>Required</sup> <a name="appCommand" id="cdk8s-operator.ServerProps.property.appCommand"></a>

```typescript
public readonly appCommand: string;
```

- *Type:* string

The command to execute in order to synthesize the CDK app.

---

## Classes <a name="Classes" id="Classes"></a>

### Server <a name="Server" id="cdk8s-operator.Server"></a>

#### Initializers <a name="Initializers" id="cdk8s-operator.Server.Initializer"></a>

```typescript
import { Server } from 'cdk8s-operator'

new Server(props: ServerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-operator.Server.Initializer.parameter.props">props</a></code> | <code><a href="#cdk8s-operator.ServerProps">ServerProps</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="cdk8s-operator.Server.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk8s-operator.ServerProps">ServerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-operator.Server.close">close</a></code> | Stop server. |
| <code><a href="#cdk8s-operator.Server.listen">listen</a></code> | Starts HTTP server. |

---

##### `close` <a name="close" id="cdk8s-operator.Server.close"></a>

```typescript
public close(): void
```

Stop server.

##### `listen` <a name="listen" id="cdk8s-operator.Server.listen"></a>

```typescript
public listen(port?: number): number
```

Starts HTTP server.

###### `port`<sup>Optional</sup> <a name="port" id="cdk8s-operator.Server.listen.parameter.port"></a>

- *Type:* number

The port to listen to.

If not specified, the `PORT` environment
variable will be used. If that's not specified an available port will be
auto-selected.

---




## Protocols <a name="Protocols" id="Protocols"></a>

### ICustomResourceProviderHandler <a name="ICustomResourceProviderHandler" id="cdk8s-operator.ICustomResourceProviderHandler"></a>

- *Implemented By:* <a href="#cdk8s-operator.ICustomResourceProviderHandler">ICustomResourceProviderHandler</a>

The handler for this custom resource provider.

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-operator.ICustomResourceProviderHandler.apply">apply</a></code> | *No description.* |

---

##### `apply` <a name="apply" id="cdk8s-operator.ICustomResourceProviderHandler.apply"></a>

```typescript
public apply(scope: Construct, id: string, spec: any): Construct
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk8s-operator.ICustomResourceProviderHandler.apply.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="cdk8s-operator.ICustomResourceProviderHandler.apply.parameter.id"></a>

- *Type:* string

---

###### `spec`<sup>Required</sup> <a name="spec" id="cdk8s-operator.ICustomResourceProviderHandler.apply.parameter.spec"></a>

- *Type:* any

---


