import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { readFileSync } from 'fs';

const projectName = 'gdcdevops';
const regionName = 'us-central1';

const bootstrap = readFileSync('init_script.sh', 'utf-8');

const externalIP = new gcp.compute.Address('tsvmaddress', {
    project: projectName,
    region: regionName
});

const computeNetwork = new gcp.compute.Network('tsvmnet', {
    project: projectName,
    autoCreateSubnetworks: false

});

const computeSubNetwork = new gcp.compute.Subnetwork('tssubnet', {
    ipCidrRange: '10.2.1.0/24',
    network: computeNetwork.selfLink,
    region: regionName,
    project: projectName
});

const firewall = new gcp.compute.Firewall('tsvmfirewall', {
    network: computeNetwork.selfLink,
    project: projectName,
    allows: [
        {
            protocol: 'icmp'
        },
        {
            protocol: 'tcp',
            ports: ['22']
        }
    ]
});

const computeInstance = new gcp.compute.Instance('tsvmhost', {
    project: projectName,
    zone: regionName+'-a',
    machineType: 'f1-micro',
    bootDisk: {
        initializeParams: {
            image: 'centos-cloud/centos-7-v20190116',
            size: 200,
            type: 'pd-standard'
        }
    },
    networkInterfaces: [
        {
            network: computeNetwork.selfLink,
            subnetwork: computeSubNetwork.selfLink,
            accessConfigs: [{natIp: externalIP.address}]
        }
    ],
    scheduling: { automaticRestart: false, preemptible: true },
    serviceAccount: {
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    },
    metadataStartupScript: bootstrap
});

exports.EXTERNAL_IP = externalIP.address;
