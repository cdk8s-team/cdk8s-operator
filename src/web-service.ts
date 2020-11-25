import * as plus from 'cdk8s-plus';
import { Construct } from 'constructs';

export interface WebServiceOptions {
  /**
   * The container image
   */
  readonly image: string;

  /**
   * Number of replicas
   * @default 1
   */
  readonly replicas?: number;

  /**
   * Container port
   * @default - no ports are exposed
   */
  readonly containerPort?: number;

  /**
   * Service port (required `containerPort` to be defined)
   * @default - deployment is not exposed via a service
   */
  readonly servicePort?: number;

  /**
   * The type of service to expose (`servicePort` must be defined).
   * @default ServiceType.CLUSTER_IP
   */
  readonly serviceType?: plus.ServiceType;
}

export class WebService extends Construct {
  constructor(scope: Construct, id: string, options: WebServiceOptions) {
    super(scope, id);

    const dep = new plus.Deployment(this, 'deployment', {
      spec: {
        replicas: options.replicas,
      },
    });

    const container = new plus.Container({
      image: options.image,
      port: options.containerPort,
    });

    dep.spec.podSpecTemplate.addContainer(container);

    if (options.serviceType && !options.servicePort) {
      throw new Error('"servicePort" must be defined is "serviceType" is defined');
    }

    if (options.servicePort) {
      if (!options.containerPort) {
        throw new Error('"containerPort" is required if "servicePort" is defined');
      }

      dep.expose({
        port: options.servicePort,
        serviceType: options.serviceType,
      });
    }
  }
}