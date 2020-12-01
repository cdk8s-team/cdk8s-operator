# API Reference

**Classes**

Name|Description
----|-----------
[Operator](#cdk8s-operator-operator)|A CDK8s app which allows implementing Kubernetes operators using CDK8s constructs.
[Server](#cdk8s-operator-server)|*No description*


**Structs**

Name|Description
----|-----------
[CustomResourceProvider](#cdk8s-operator-customresourceprovider)|*No description*
[OperatorProps](#cdk8s-operator-operatorprops)|*No description*
[ServerProps](#cdk8s-operator-serverprops)|*No description*


**Interfaces**

Name|Description
----|-----------
[ICustomResourceProviderHandler](#cdk8s-operator-icustomresourceproviderhandler)|The handler for this custom resource provider.



## class Operator  <a id="cdk8s-operator-operator"></a>

A CDK8s app which allows implementing Kubernetes operators using CDK8s constructs.

__Implements__: [IConstruct](#constructs-iconstruct)
__Extends__: [App](#cdk8s-app)

### Initializer




```ts
new Operator(props?: OperatorProps)
```

* **props** (<code>[OperatorProps](#cdk8s-operator-operatorprops)</code>)  *No description*
  * **inputFile** (<code>string</code>)  A Kubernetes JSON manifest with a single resource that is matched against one of the providers within this operator. __*Default*__: first position command-line argument or "/dev/stdin"
  * **outputFile** (<code>string</code>)  Where to write the synthesized output. __*Default*__: "/dev/stdout"


### Methods


#### addProvider(provider) <a id="cdk8s-operator-operator-addprovider"></a>

Adds a custom resource provider to this operator.

```ts
addProvider(provider: CustomResourceProvider): void
```

* **provider** (<code>[CustomResourceProvider](#cdk8s-operator-customresourceprovider)</code>)  The provider to add.
  * **apiVersion** (<code>string</code>)  API version of the custom resource. 
  * **handler** (<code>[ICustomResourceProviderHandler](#cdk8s-operator-icustomresourceproviderhandler)</code>)  The construct handler. 
  * **kind** (<code>string</code>)  Kind of this custom resource. 




#### synth() <a id="cdk8s-operator-operator-synth"></a>

Reads a Kubernetes manifest in JSON format from STDIN or the file specified as the first positional command-line argument.

This manifest is expected to
include a single Kubernetes resource. Then, we match `apiVersion` and
`kind` to one of the registered providers and if we do, we invoke
`apply()`, passing it the `spec` of the input manifest and a chart as a
scope. The chart is then synthesized and the output manifest is written to
STDOUT.

```ts
synth(): void
```







## class Server  <a id="cdk8s-operator-server"></a>




### Initializer




```ts
new Server(props: ServerProps)
```

* **props** (<code>[ServerProps](#cdk8s-operator-serverprops)</code>)  *No description*
  * **appCommand** (<code>string</code>)  The command to execute in order to synthesize the CDK app. 


### Methods


#### close() <a id="cdk8s-operator-server-close"></a>

Stop server.

```ts
close(): void
```





#### listen(port?) <a id="cdk8s-operator-server-listen"></a>

Starts HTTP server.

```ts
listen(port?: number): number
```

* **port** (<code>number</code>)  The port to listen to.

__Returns__:
* <code>number</code>



## struct CustomResourceProvider  <a id="cdk8s-operator-customresourceprovider"></a>






Name | Type | Description 
-----|------|-------------
**apiVersion** | <code>string</code> | API version of the custom resource.
**handler** | <code>[ICustomResourceProviderHandler](#cdk8s-operator-icustomresourceproviderhandler)</code> | The construct handler.
**kind** | <code>string</code> | Kind of this custom resource.



## interface ICustomResourceProviderHandler  <a id="cdk8s-operator-icustomresourceproviderhandler"></a>


The handler for this custom resource provider.
### Methods


#### apply(scope, id, spec) <a id="cdk8s-operator-icustomresourceproviderhandler-apply"></a>



```ts
apply(scope: Construct, id: string, spec: any): Construct
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **spec** (<code>any</code>)  *No description*

__Returns__:
* <code>[Construct](#constructs-construct)</code>



## struct OperatorProps  <a id="cdk8s-operator-operatorprops"></a>






Name | Type | Description 
-----|------|-------------
**inputFile**? | <code>string</code> | A Kubernetes JSON manifest with a single resource that is matched against one of the providers within this operator.<br/>__*Default*__: first position command-line argument or "/dev/stdin"
**outputFile**? | <code>string</code> | Where to write the synthesized output.<br/>__*Default*__: "/dev/stdout"



## struct ServerProps  <a id="cdk8s-operator-serverprops"></a>






Name | Type | Description 
-----|------|-------------
**appCommand** | <code>string</code> | The command to execute in order to synthesize the CDK app.



