import { Construct } from 'constructs';
import * as awsvpc from './imports/ec2.aws.crossplane.io/vpc';
import * as awssubnet from './imports/ec2.aws.crossplane.io/subnet';
import * as awsrds from './imports/database.aws.crossplane.io/rdsinstance';

export interface CompositePostgreSQLInstanceSpec {
  /**
   * The amount of storage in GB.
   */
  readonly storageGB: number;
}

export class DatabaseComposition extends Construct {
  constructor(scope: Construct, id: string, options: CompositePostgreSQLInstanceSpec) {
    super(scope, id);
    
    const vpc = new awsvpc.Vpc(scope, "my-vpc", {
      spec: {
        forProvider: {
          region: "us-west-2",
          cidrBlock: "192.168.0.0/16",
          enableDnsHostNames: true,
          enableDnsSupport: true,
        }
      }
    });

    const subnets: awssubnet.Subnet[] = [
    new awssubnet.Subnet(scope, "subnet-1", {
      spec: {
        forProvider: {
          region: "us-west-2",
          cidrBlock: "192.168.64.0/18",
          availabilityZone: "us-west-2a",
          vpcIdRef: {
            name: vpc.name,
          },
        }
      }
    }),
    new awssubnet.Subnet(scope, "subnet-2", {
      spec: {
        forProvider: {
          region: "us-west-2",
          cidrBlock: "192.168.128.0/18",
          availabilityZone: "us-west-2b",
          vpcIdRef: {
            name: vpc.name,
          },
        }
      }
    }),
    new awssubnet.Subnet(scope, "subnet-3", {
      spec: {
        forProvider: {
          region: "us-west-2",
          cidrBlock: "192.168.192.0/18",
          availabilityZone: "us-west-2c",
          vpcIdRef: {
            name: vpc.name,
          },
        }
      }
    })]

    const rds = new awsrds.RdsInstance(scope, "my-rds", {
      spec: {
        forProvider: {
          allocatedStorage: options.storageGB,
          region: "us-west-2",
          dbInstanceClass: "db.t2.small",
          engine: "postgres",
          engineVersion: "9.6",
          publiclyAccessible: true,
          skipFinalSnapshotBeforeDeletion: true,
          masterUsername: "admin",
        },
        writeConnectionSecretToRef: {
          name: "my-rds-connection",
          namespace: "crossplane-system",
        }
      }
    })
  }
}