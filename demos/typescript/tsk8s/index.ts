import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const name = "gdcdevops";
const regionName = 'us-central1';

const computeNetwork = new gcp.compute.Network('tsk8snet', {
    project: name,
    autoCreateSubnetworks: false
});

const computeSubNetwork = new gcp.compute.Subnetwork('tsk8ssubnet', {
    ipCidrRange: '10.2.1.0/24',
    network: computeNetwork.selfLink,
    region: regionName,
    project: name
});

// Create a GKE cluster
const engineVersion = gcp.container.getEngineVersions().latestMasterVersion;
const cluster = new gcp.container.Cluster(name, {
    initialNodeCount: 2,
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

// Export the Cluster name
export const clusterName = cluster.name;

// // Manufacture a GKE-style kubeconfig. Note that this is slightly "different"
// // because of the way GKE requires gcloud to be in the picture for cluster
// // authentication (rather than using the client cert/key directly).
export const kubeconfig = pulumi.
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

// // Create a Kubernetes provider instance that uses our cluster from above.
// const clusterProvider = new k8s.Provider(name, {
//     kubeconfig: kubeconfig,
// });