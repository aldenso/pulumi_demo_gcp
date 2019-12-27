import pulumi
from pulumi_gcp import compute

project="gdcdevops"
region="us-central1"

addr = compute.address.Address('pyvmaddr', project=project, region=region)

network = compute.network.Network('pyvmnet', project=project)

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
            "accessConfigs": [{
                "natIp": addr.address
            }]
        }
    ]
)

# Export the DNS name of the bucket
pulumi.export('PUBLIC_IP', addr.address)
pulumi.export('NETWORK', network.self_link)
pulumi.export('VM', instance.name)
