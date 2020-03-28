import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

import { runTests } from "./tests";

const name = "gdcdevops";
const regionName = 'us-central1';
const domain = 'aldenso.com';
const initialNodes = 3;

const computeNetwork = new gcp.compute.Network('tsk8snet', {
    project: name,
    autoCreateSubnetworks: false
});

export const customNet = computeNetwork;

const computeSubNetwork = new gcp.compute.Subnetwork('tsk8ssubnet', {
    ipCidrRange: '10.2.1.0/24',
    network: computeNetwork.selfLink,
    region: regionName,
    project: name
});

// Create a GKE cluster
const engineVersion = gcp.container.getEngineVersions().latestMasterVersion;
const cluster = new gcp.container.Cluster(name, {
    initialNodeCount: initialNodes,
    minMasterVersion: engineVersion,
    nodeVersion: engineVersion,
    location: regionName+"-a",
    network: computeNetwork.selfLink,
    subnetwork: computeSubNetwork.selfLink,
    nodeConfig: {
        machineType: "n1-standard-1",
        oauthScopes: [
            "https://www.googleapis.com/auth/compute",
            "https://www.googleapis.com/auth/devstorage.read_only",
            "https://www.googleapis.com/auth/logging.write",
            "https://www.googleapis.com/auth/monitoring"
        ],
    },
});

// Export Cluster
export const ClusterK8s = cluster

// Export the Cluster name
export const clusterName = cluster.name;

// // Manufacture a GKE-style kubeconfig. Note that this is slightly "different"
// // because of the way GKE requires gcloud to be in the picture for cluster
// // authentication (rather than using the client cert/key directly).
const kubeconfig = pulumi.
    all([ cluster.name, cluster.endpoint, cluster.masterAuth ]).
    apply(([ name, endpoint, masterAuth ]) => {
        const context = `${gcp.config.project}_${gcp.config.zone}_${name}`;
        return `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${masterAuth.clusterCaCertificate}
    server: https://${endpoint}
  name: ${context}
contexts:
- context:
    cluster: ${context}
    user: ${context}
  name: ${context}
current-context: ${context}
kind: Config
preferences: {}
users:
- name: ${context}
  user:
    auth-provider:
      config:
        cmd-args: config config-helper --format=json
        cmd-path: gcloud
        expiry-key: '{.credential.token_expiry}'
        token-key: '{.credential.access_token}'
      name: gcp
`;
    });

export const KUBECONFIG = pulumi.secret(kubeconfig)

// Create a Kubernetes provider instance that uses our cluster from above.
const clusterProvider = new k8s.Provider(name, {
    kubeconfig: kubeconfig,
});

// Deploy the NGINX ingress controller using the Helm chart.
export const nginx = new k8s.helm.v2.Chart("nginx",
    {
        namespace: "default",
        chart: "nginx-ingress",
        version: "1.24.4",
        fetchOpts: {repo: "https://kubernetes-charts.storage.googleapis.com/"},
        values: {controller: {publishService: {enabled: false}}},
        transformations: [
            (obj: any) => {
                // Do transformations on the YAML to set the namespace
                if (obj.metadata) {
                    obj.metadata.namespace = "default";
                }
            },
        ],
    },
    {providers: {kubernetes: clusterProvider}, dependsOn: cluster},
);

export const ingressIp = nginx.getResourceProperty('v1/Service',
                                              'default/nginx-nginx-ingress-controller',
                                              'status')
                                              .apply(status => status.loadBalancer.ingress[0].ip)

export const dnsZone = new gcp.dns.ManagedZone('mydns-zone', {
  description: "My dns Zone",
  dnsName: domain+".",
  name: "mydns-zone",
  project: name,
}, {dependsOn: nginx});

export const dnsRecords = new gcp.dns.RecordSet('mydns-records', {
  name: 'myk8s.'+domain+'.',
  managedZone: dnsZone.name,
  project: name,
  ttl: 300,
  rrdatas: [ingressIp],
  type: 'A',
}, {dependsOn: dnsZone});

runTests();
