import pulumi
from pulumi_gcp import compute

project="gdcdevops"
region="us-central1"

addr = compute.address.Address('pyvmaddr',
                               project=project,
                               region=region)

network = compute.network.Network('pyvmnet', project=project, auto_create_subnetworks=False)

subnet = compute.Subnetwork("pysubnet",
                            ip_cidr_range = '10.2.1.0/24',
                            network=network.self_link,
                            project=project,
                            region=region)

firewall = compute.Firewall(
    'pyvmfirewall',
    network=network.self_link,
    project=project,
    allows=[
        {
            "protocol": "tcp",
            "ports": ["22"]
        }
    ]
)

instance = compute.Instance(
    "pyvmhost",
    name="pyvmhost",
    project=project,
    zone=region+"-a",
    machine_type="f1-micro",
    boot_disk={
        "initializeParams": {
            "image": "centos-cloud/centos-7-v20190116"
        }
    },
    network_interfaces=[
        {
            "network": network.id,
            "subnetwork": subnet.id,
            "accessConfigs": [{
                "natIp": addr.address
            }]
        }
    ]
)

# Export the DNS name of the bucket
pulumi.export('PUBLIC_IP', addr.address)
pulumi.export('NETWORK', network.self_link)
pulumi.export('SUBNET', subnet.ip_cidr_range)
pulumi.export('VM', instance.name)
