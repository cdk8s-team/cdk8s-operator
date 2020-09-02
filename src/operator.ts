import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';


import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';

export interface ICustomResourceProviderHandler {
  // readonly schema: any;

  apply(scope: Construct, name: string, spec: any): Construct;
}

export interface CustomResourceProvider {
  readonly group: string;
  readonly kind: string;

  /**
   * @default "v1"
   */
  readonly apiVersion: string;
  readonly handler: ICustomResourceProviderHandler;
}

export class Operator extends App {
  private readonly providers: CustomResourceProvider[];

  constructor() {
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk8s'));
    super({ outdir });

    this.providers = new Array();
  }

  public addProvider(provider: CustomResourceProvider) {
    this.providers.push(provider);
  }

  public synth() {
    const inputFile = process.argv[2] ?? '/dev/stdin';
    const input = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

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

    console.error(`Synthesizing ${input.group}.${input.kind}/${input.apiVersion}`);
    provider.handler.apply(chart, name, spec);

    super.synth();

    for (const file of fs.readdirSync(this.outdir)) {
      const filepath = path.join(this.outdir, file);
      process.stdout.write(fs.readFileSync(filepath));
    }
  }

  private findProvider(input: { group: string, kind: string, apiVersion: string }) {
    const { apiVersion, kind, group } = input;

    if (!apiVersion) {
      throw new Error('"apiVersion" is required');
    }

    if (!kind) {
      throw new Error('"kind" is required');
    }

    if (!group) {
      throw new Error('"group" is required');
    }

    for (const p of this.providers) {
      if (p.apiVersion === apiVersion && p.kind === kind && p.group === group) {
        return p;
      }
    }

    throw new Error(`No custom resource provider found for ${group}.${kind}/${apiVersion}`);
  }
}

