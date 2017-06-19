# AWS Cloud formation template.

#### This template is intended to provide a functional, baseline for npmE install on AWS with the following software:

* Ubuntu 16.04 LTS
* linux kernel 4.4.0-1016-aws
* node 6.10.2
* npm 3.10.10
* npme 4.3.10
* replicated 2.9.0
* docker 17.03.1-ce, build c6d412e

While setting up the instance, choose `Production` or `Testing` for the Environment settings.
This will select `r3.large` or `r3.xlarge` respectively.

| Size |  vCPU/ECU |  GB RAM | GB SSD |
| ---- | --------- | ------- | ------ |
| r3.large | 2,6.5 | 15 | 32 |
| r3.xlarge |4,13 | 30.5 | 80 |


#### Key points to note down while setup process.

**Admin Console Password**

The template will require you to set a password for the admin console. Don't lose this. Once you've set it, you'll have to have it to access the admin console and complete the setup.

**Network Security**

This template will allow you to limit incoming connections to SSH, the npmE Admin Panel and the two registry ports (8080, 8081). Each of these defaults to allowing connections from anywhere.

You will have to have at least one EC2 key pair created before using this template to select so that you can SSH into the instance when it's complete.

**Initial Start Time**

Even after the instance starts, it will still take a few minutes for all of the steps to complete. Please be patient as this can take between 5 to 10 minutes. Once the process has completed, navigate your browser to http://<instances public ip>:8800 and follow the setup instructions.

**Changing the Linux Distribution**

A considerable amount of the approach would need to be changed in order for this template to work for any other distribution. The AWSRegionToAMI property under Mappings would be the first thing to change as this provides a look up of the AMI Id for the distro image for each given region.

After that, you'd need to revisit each of the shell scripts and change out distribution specifics such as the package manager and how to install and initialize Amazon's Cloud Formation initialiser.


**Below is the cloud formation template for npmE setup that you can use.**

#### npme-cloudformation.yaml

```
AWSTemplateFormatVersion: 2010-09-09
Description: AWS CloudFormation Template for npm enterprise instance.
Parameters:
  SSHKeyName:
    Description: Name of existing EC2 KeyPair to enable SSH access.
    Type: 'AWS::EC2::KeyPair::KeyName'
    ConstraintDescription: must be the name of an existing EC2 KeyPair.
  SSHLocation:
    Description: The IP address range that can be used to SSH to the EC2 instances
    Type: String
    MinLength: '9'
    MaxLength: '18'
    Default: 0.0.0.0/0
    AllowedPattern: '(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/(\d{1,2})'
    ConstraintDescription: must be a valid IP CIDR range of the form x.x.x.x/x.
  AdminLocation:
    Description: The IP address range that can be used to access the npme admin console
    Type: String
    MinLength: '9'
    MaxLength: '18'
    Default: 0.0.0.0/0
    AllowedPattern: '(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/(\d{1,2})'
    ConstraintDescription: must be a valid IP CIDR range of the form x.x.x.x/x.
  RegistryLocation:
    Description: The IP address range that can be used to access the npme admin console
    Type: String
    MinLength: '9'
    MaxLength: '18'
    Default: 0.0.0.0/0
    AllowedPattern: '(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/(\d{1,2})'
    ConstraintDescription: must be a valid IP CIDR range of the form x.x.x.x/x.
  AdminPassword:
    Description: npm enterprise admin console password.
    Type: String
    NoEcho: true
  Branding:
    Description: npm enterprise brand
    Type: String
    Default: ""
  Environment:
    Description: Environment settings to use for instance.
    Type: String
    Default: Production
    AllowedValues:
      - Production
      - Testing
  Monitoring:
    Description: Turn detailed monitoring on?
    Type: String
    Default: false
    AllowedValues:
      - true
      - false
  VolumeDeleteOnTermination:
    Description: Delete volume on instance termination?
    Type: String
    Default: false
    AllowedValues:
      - true
      - false
  DisableApiTermination:
    Description: Allow API to delete instance on termination?
    Type: String
    Default: false
    AllowedValues:
      - true
      - false
Mappings:
  EnvironmentSettings:
    Production:
      InstanceType: r3.xlarge
      EbsOptimized: true
      UpstreamUrl: https://replicate.npmjs.com
      UpstreamPolicy: white-list
    Testing:
      InstanceType: r3.large
      EbsOptimized: true
      UpstreamUrl: https://replicate.npmjs.com
      UpstreamPolicy: white-list
  AWSRegionToAMI:
    ap-south-1:
      id: ami-4fa4d920
    ap-southeast-1:
      id: ami-93ef68f0
    ap-southeast-2:
      id: ami-1e01147d
    ap-northeast-1:
      id: ami-1de1df7a
    ap-northeast-2:
      id: ami-6722ff09
    ca-central-1:
      id: ami-e273cf86
    cn-north-1:
      id: ami-a163b4cc
    eu-central-1:
      id: ami-a74c95c8
    eu-west-1:
      id: ami-6c101b0a
    eu-west-2:
      id: ami-056d7a61
    sa-east-1:
      id: ami-4bd8b727
    us-east-1:
      id: ami-20631a36
    us-east-2:
      id: ami-a5b196c0
    us-gov-west-1:
      id: ami-ff22a79e
    us-west-1:
      id: ami-9fe6c7ff
    us-west-2:
      id: ami-45224425
Resources:
  EC2Instance:
    Type: 'AWS::EC2::Instance'
    Properties:
      EbsOptimized: !FindInMap
        - EnvironmentSettings
        - !Ref Environment
        - EbsOptimized
      InstanceType: !FindInMap
        - EnvironmentSettings
        - !Ref Environment
        - InstanceType
      ImageId: !FindInMap
        - AWSRegionToAMI
        - !Ref AWS::Region
        - id
      KeyName: !Ref SSHKeyName
      SecurityGroups:
        - !Ref InstanceSecurityGroup
      UserData:
        Fn::Base64: !Sub |
          #!/bin/bash -x
          parted /dev/xvdb mklabel msdos
          parted -a opt /dev/xvdb mkpart primary ext4 0% 100%
          mkfs.ext4 -L datapartition /dev/xvdb1
          mount -o defaults /dev/xvdb1 /mnt
          mkdir -p /mnt/docker
          apt-get update
          apt-get install -y python-pip
          pip install https://s3.amazonaws.com/cloudformation-examples/aws-cfn-bootstrap-latest.tar.gz
          cfn-init -v --resource EC2Instance --stack "${AWS::StackName}" --region "${AWS::Region}"
          cfn-signal -e $? --resource EC2Instance --stack "${AWS::StackName}" --region "${AWS::Region}"
    Metadata:
      'AWS::CloudFormation::Init':
        config:
          files:
            /home/ubuntu/npme-setup/npme-settings.json:
              content: !Join
                - ''
                - - '{'
                  - '  "allowpublishes": { "value": "allowpublishes_all" },'
                  - '  "auth_source": { "value": "auth_type_open" },'
                  - '  "authfetch": { "value": "authfetch_no" },'
                  - '  "authglobal": { "value": "authglobal_no" },'
                  - '  "authwww": { "value": "authwww_no" },'
                  - '  "authz_cache_enabled": { "value": "authz_cache_enabled_yes" },'
                  - '  "branding": { "value": "'
                  - !Ref Branding
                  - '" },'
                  - '  "couch_url_remote": { "value": "'
                  - !FindInMap
                    - EnvironmentSettings
                    - !Ref Environment
                    - UpstreamUrl
                  - '" },'
                  - '  "couchdb_host_path": { "value": "/mnt/couch" },'
                  - '  "data_host_path": { "value": "/mnt/data" },'
                  - '  "es_host_path": { "value": "/mnt/es" },'
                  - '  "packages_host_path": { "value": "/mnt/packages" },'
                  - '  "postgres_host_path": { "value": "/mnt/pg" },'
                  - '  "read_through_cache": { "value": "read_through_cache_yes" },'
                  - '  "redis_host_path": { "value": "mnt/redis" },'
                  - '  "reject_unauthorized": { "value": "reject_unauthorized_no" },'
                  - '  "remote_policy": { "value": "'
                  - !FindInMap
                    - EnvironmentSettings
                    - !Ref Environment
                    - UpstreamPolicy
                  - '" },'
                  -   '"scoped_search": { "value": "scoped_search_yes" }'
                  - '}'
            /home/ubuntu/npme-setup/replicated.conf:
              content: !Sub |
                {
                  "DaemonAuthenticationType": "password",
                  "DaemonAuthenticationPassword": "${AdminPassword}",
                  "Channel": "stable",
                  "LicenseFileLocation": "/etc/replicated/license.rli",
                  "ImportSettingsFrom": "/home/ubuntu/npme-setup/npme-settings.json",
                  "LogLevel": "error"
                }
            /home/ubuntu/npme-setup/npme-install.sh:
              content: |
                #!/bin/bash -xe
                # install node & npm
                echo "installing node & npm"
                cd ~ && curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
                bash nodesource_setup.sh
                apt-get install -y build-essential nodejs
                # install npme
                npm i npme -g --ignore-scripts
                cp /home/ubuntu/npme-setup/replicated.conf /etc/replicated.conf
                npme install -s -u
                service docker stop
                service docker start
                docker start replicated replicated-operator replicated-ui
              mode: "000755"
              owner: root
              group: root
            /etc/fstab:
              content: |
                \LABEL=cloudimg-rootfs  /  ext4 defaults,discard  0 0
                /dev/xvdb1  /mnt  ext4  defaults,nofail   0 2
              owner: root
              group: root
            /etc/docker/daemon.json:
              content: |
                {
                  "graph": "/mnt/docker"
                }
          commands:
            install:
              command: "./npme-install.sh"
              cwd: "/home/ubuntu/npme-setup/"
  InstanceSecurityGroup:
    Type: 'AWS::EC2::SecurityGroup'
    Properties:
      GroupDescription: Enable SSH access
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: '22'
          ToPort: '22'
          CidrIp: !Ref SSHLocation
        - IpProtocol: tcp
          FromPort: '8800'
          ToPort: '8800'
          CidrIp: !Ref AdminLocation
        - IpProtocol: tcp
          FromPort: '8080'
          ToPort: '8080'
          CidrIp: !Ref RegistryLocation
        - IpProtocol: tcp
          FromPort: '8081'
          ToPort: '8081'
          CidrIp: !Ref RegistryLocation
  IPAddress:
    Type: 'AWS::EC2::EIP'
  IPAssoc:
    Type: 'AWS::EC2::EIPAssociation'
    Properties:
      InstanceId: !Ref EC2Instance
      EIP: !Ref IPAddress
  WaitHandle:
    Type: AWS::CloudFormation::WaitConditionHandle
Outputs:
  InstanceId:
    Description: Instance Id of the newly created EC2 instance.
    Value: !Ref EC2Instance
  PublicIP:
    Description: Public IP address of the newly created EC2 instance.
    Value: !GetAtt EC2Instance.PublicIp
  PublicDNS:
    Description: Public DNS Name of the newly created EC2 instance.
    Value: !GetAtt EC2Instance.PublicDnsName
  PrivateIP:
    Description: Private IP address of the newly created EC2 instance.
    Value: !GetAtt EC2Instance.PrivateIp
  PrivateDNS:
    Description: Private DNS Name of the newly created EC2 instance.
    Value: !GetAtt EC2Instance.PrivateDnsName

```