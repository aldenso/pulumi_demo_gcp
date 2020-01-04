# pulumi_demo_gcp

Pulumi demo using Google Cloud Platform

```sh
pulumi login --local
```

```console
Logged into MBP-Aldo as everis (file://~)
```

```sh
export PULUMI_CONFIG_PASSPHRASE='hardcoded'
```

Export your credentials file.

```sh
export GOOGLE_APPLICATION_CREDENTIALS="/Users/everis/gcloud/gcp-service-account.json"
```

## Python Demo

* [Create VMs.](demos/python/pyvms/README.md)

## Typescript Demo

* [Create VMs.](demos/typescript/tsvms/README.md)
* [Create kubernetes Cluster.](demos/typescript/tsk8s/README.md)
