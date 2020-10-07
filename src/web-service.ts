import { Construct } from 'constructs';
import * as awsvpc from './imports/ec2.aws.crossplane.io/vpc';
import * as awssubnet from './imports/ec2.aws.crossplane.io/subnet';
import * as awsrds from './imports/database.aws.crossplane.io/rdsinstance';
import * as awsdbsubnetgroup from './imports/database.aws.crossplane.io/dbsubnetgroup';
import * as awsig from './imports/ec2.aws.crossplane.io/internetgateway';
import * as awsrt from './imports/ec2.aws.crossplane.io/routetable';
import * as awssg from './imports/ec2.aws.crossplane.io/securitygroup';

export interface CompositePostgreSQLInstanceSpec {
  /**
   * The amount of storage in GB.
   */
  readonly storageGB: number;
}

export class DatabaseComposition extends Construct {
  constructor(scope: Construct, id: string, options: CompositePostgreSQLInstanceSpec) {
    super(scope, id);

    let region = "us-west-2" 
    
    const vpc = new awsvpc.Vpc(scope, "my-vpc", {
      spec: {
        forProvider: {
          region: region,
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
          region: region,
          cidrBlock: "192.168.64.0/18",
          availabilityZone: `${region}a`,
          vpcIdRef: {
            name: vpc.name,
          },
        }
      }
    }),
    new awssubnet.Subnet(scope, "subnet-2", {
      spec: {
        forProvider: {
          region: region,
          cidrBlock: "192.168.128.0/18",
          availabilityZone: `${region}b`,
          vpcIdRef: {
            name: vpc.name,
          },
        }
      }
    }),
    new awssubnet.Subnet(scope, "subnet-3", {
      spec: {
        forProvider: {
          region: region,
          cidrBlock: "192.168.192.0/18",
          availabilityZone: `${region}c`,
          vpcIdRef: {
            name: vpc.name,
          },
        }
      }
    })]

    const dbsubnetgroup = new awsdbsubnetgroup.DbSubnetGroup(scope, "my-dbsubnetgroup", {
      spec: {
        forProvider: {
          region: region,
          description: "the db subnet group for my cdk8s example",
        }
      }
    })

    const ig = new awsig.InternetGateway(scope, "my-ig", {
      spec: {
        forProvider: {
          region: region,
          vpcIdRef: {
            name: vpc.name,
          }
        }
      }
    })

    const rt = new awsrt.RouteTable(scope, "my-rt", {
      spec: {
        forProvider: {
          region: region,
          routes: [
            {
              destinationCidrBlock: "0.0.0.0/0",
              gatewayIdRef: {
                name: ig.name,
              }
            }
          ],
          associations: [
            {
              subnetIdRef: { name: subnets[0].name }
            },
            {
              subnetIdRef: {name: subnets[1].name }
            },
            {
              subnetIdRef: { name: subnets[2].name }
            },
          ],
        }
      }
    })

    const sg = new awssg.SecurityGroup(scope, "my-sg", {
      spec: {
        forProvider: {
          region: region,
          vpcIdRef: { name: vpc.name },
          description: "my security group for cdk8s example",
          groupName: "muvaf-prototype-cdk8s",
          ingress: [
            {
              fromPort: 5432,
              toPort: 5432,
              ipProtocol: "tcp",
              ipRanges: [ { cidrIp: "0.0.0.0/0", description: "Everywhere" } ]
            }
          ]
        }
      }
    })

    // subnets.forEach(element => {
    //   // Add each subnet to RouteTable as an association.
    //   // Cannot access spec of RouteTable object for some reason.
    // });

    const rds = new awsrds.RdsInstance(scope, "my-rds", {
      spec: {
        forProvider: {
          allocatedStorage: options.storageGB,
          region: region,
          dbSubnetGroupNameRef: {
            name: dbsubnetgroup.name,
          },
          vpcSecurityGroupIDRefs: [ { name: sg.name } ],
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

    // All variables have to be used, otherwise it doesn't compile.
    console.log(`RDS name: ${rds.name}`)
    console.log(`RouteTable name: ${rt.name}`)
  }
}