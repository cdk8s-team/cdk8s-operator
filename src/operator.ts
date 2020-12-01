import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { App, Chart } from 'cdk8s';
import { Construct } from 'constructs';

/**
 * The handler for this custom resource provider.
 */
export interface ICustomResourceProviderHandler {
  // readonly schema: any;

  apply(scope: Construct, id: string, spec: any): Construct;
}

export interface CustomResourceProvider {
  /**
   * Kind of this custom resource.
   */
  readonly kind: string;

  /**
   * API version of the custom resource.
   *
   * @default "v1"
   */
  readonly apiVersion: string;

  /**
   * The construct handler.
   */
  readonly handler: ICustomResourceProviderHandler;
}

export interface OperatorProps {
  /**
   * A Kubernetes JSON manifest with a single resource that is matched against
   * one of the providers within this operator.
   *
   * @default - first position command-line argument or "/dev/stdin"
   */
  readonly inputFile?: string;

  /**
   * Where to write the synthesized output.
   *
   * @default "/dev/stdout"
   */
  readonly outputFile?: string;
}

/**
 * A CDK8s app which allows implementing Kubernetes operators using CDK8s constructs.
 */
export class Operator extends App {

  private readonly inputFile: string;
  private readonly outputFile?: string;

  private readonly providers: CustomResourceProvider[];

  constructor(props: OperatorProps = {}) {
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk8s'));
    super({ outdir });

    this.providers = [];

    this.inputFile = props.inputFile ?? process.argv[2] ?? '/dev/stdin';
    this.outputFile = props.outputFile;
  }

  /**
   * Adds a custom resource provider to this operator.
   * @param provider The provider to add
   */
  public addProvider(provider: CustomResourceProvider) {
    this.providers.push(provider);
  }

  /**
   * Reads a Kubernetes manifest in JSON format from STDIN or the file specified
   * as the first positional command-line argument. This manifest is expected to
   * include a single Kubernetes resource. Then, we match `apiVersion` and
   * `kind` to one of the registered providers and if we do, we invoke
   * `apply()`, passing it the `spec` of the input manifest and a chart as a
   * scope. The chart is then synthesized and the output manifest is written to
   * STDOUT.
   */
  public synth() {
    const input = JSON.parse(fs.readFileSync(this.inputFile, 'utf-8'));

    let write;
    if (this.outputFile) {
      const outfile = this.outputFile;
      write = (data: Buffer) => fs.writeFileSync(outfile, data);
    } else {
      write = (data: Buffer) => process.stdout.write(data);
    }

    if (typeof(input) !== 'object') {
      throw new Error('input must be a single kubernetes resource');
    }

    const provider = this.findProvider(input);

    const name = input.metadata?.name;
    if (!name) {
      throw new Error('"metadata.name" must be defined');
    }

    const namespace = input.metadata?.namespace;

    // TODO: namespace
    const spec = input.spec ?? {};

    const chart = new Chart(this, name, { namespace });

    console.error(`Synthesizing ${input.kind}.${input.apiVersion}`);
    provider.handler.apply(chart, name, spec);

    super.synth();

    for (const file of fs.readdirSync(this.outdir)) {
      const filepath = path.join(this.outdir, file);
      const manifest = fs.readFileSync(filepath);
      write(manifest);
    }
  }

  private findProvider(input: { kind: string; apiVersion: string }) {
    const { apiVersion, kind } = input;

    if (!apiVersion) {
      throw new Error('"apiVersion" is required');
    }

    if (!kind) {
      throw new Error('"kind" is required');
    }

    for (const p of this.providers) {
      if (p.apiVersion === apiVersion && p.kind === kind) {
        return p;
      }
    }

    throw new Error(`No custom resource provider found for ${kind}.${apiVersion}`);
  }
}

