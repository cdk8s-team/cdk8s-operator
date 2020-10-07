import { Construct } from 'constructs';
import * as awsvpc from './imports/ec2.aws.crossplane.io/vpc';
import * as awssubnet from './imports/ec2.aws.crossplane.io/subnet';
import * as awsrds from './imports/database.aws.crossplane.io/rdsinstance';
import * as awsdbsubnetgroup from './imports/database.aws.crossplane.io/dbsubnetgroup';
import * as awsig from './imports/ec2.aws.crossplane.io/internetgateway';
import * as awsrt from './imports/ec2.aws.crossplane.io/routetable';
import * as awssg from './imports/ec2.aws.crossplane.io/securitygroup';

// NOTE(muvaf): This can be imported via cdk8s import

export interface CompositePostgreSQLInstanceSpec {
  /**
   * The amount of storage in GB.
   */
  readonly storageGB: number;

  /**
   * Reference to the ProviderConfig object.
   */
  readonly providerConfigRef: ProviderConfigReference;
}

export interface ProviderConfigReference {
  /**
   * Name of the ProviderConfig object.
   */
  readonly name: string;
}

export class DatabaseComposition extends Construct {
  constructor(scope: Construct, id: string, options: CompositePostgreSQLInstanceSpec) {
    super(scope, id);

    let region = "us-west-2"
    
    const vpc = new awsvpc.Vpc(scope, `vpc`, {
      spec: {
        forProvider: {
          region: region,
          cidrBlock: "192.168.0.0/16",
          enableDnsHostNames: true,
          enableDnsSupport: true,
        },
        providerConfigRef: { name: options.providerConfigRef.name },
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
        },
        providerConfigRef: { name: options.providerConfigRef.name },
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
        },
        providerConfigRef: { name: options.providerConfigRef.name },
      }
    })]

    const dbsubnetgroup = new awsdbsubnetgroup.DbSubnetGroup(scope, "dbsubnetgroup", {
      spec: {
        forProvider: {
          region: region,
          description: "the db subnet group for my cdk8s example",
        },
        providerConfigRef: { name: options.providerConfigRef.name },
      }
    })

    const ig = new awsig.InternetGateway(scope, "ig", {
      spec: {
        forProvider: {
          region: region,
          vpcIdRef: {
            name: vpc.name,
          }
        },
        providerConfigRef: { name: options.providerConfigRef.name },
      }
    })

    const {} = new awsrt.RouteTable(scope, "routetable", {
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
        },
        providerConfigRef: { name: options.providerConfigRef.name },
      }
    })

    const sg = new awssg.SecurityGroup(scope, "sg", {
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
        },
        providerConfigRef: { name: options.providerConfigRef.name },
      }
    })
    // NOTE(muvaf): Add each subnet to RouteTable as an association.
    // Cannot access spec of RouteTable object for some reason.
    // subnets.forEach(element => {
    //
    // });

    // NOTE: I would like to loop over all objects and add the same
    // providerConfigRef but I cannot access the properties other than name.

    // NOTE: I want to use the final name of the RDSInstance in
    // `writeConnectionSecretToRef.name`. Is there a way to access like
    // this.name?

    // TODO: This app needs to manage the credentials in a way that they
    // will be present in
    // CompositePostgreSQLInstance.spec.writeConnectionSecretRef
    // so that it can be propagated to the namespace of the Claim by Crossplane.
    const {} = new awsrds.RdsInstance(scope, "rds", {
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
        },
        providerConfigRef: { name: options.providerConfigRef.name },
      }
    })
  }
}