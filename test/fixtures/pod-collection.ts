import { ApiObject } from 'cdk8s';
import { Construct } from 'constructs';

/**
 * @xrd org.foo/v1.PodCollection
 */
export interface PodCollectionProps {
  /**
   * Number of pods.
   * @default 10
   */
  readonly count?: number;

  /**
   * The image to use for the containers.
   */
  readonly image: string;
}

export class PodCollection extends Construct {
  constructor(scope: Construct, id: string, props: PodCollectionProps) {
    super(scope, id);

    for (let i = 0; i < (props.count ?? 10); ++i) {
      new ApiObject(this, `pod-${i}`, {
        apiVersion: 'v1',
        kind: 'Pod',
        spec: {
          containers: [
            { image: props.image },
          ],
        },
      });
    }
  }
}
