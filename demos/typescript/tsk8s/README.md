
# K8s demo using typescript

Create a new project called tsk8s.

```sh
pulumi new -d "k8s cluster using typescript" --dir tsk8s typescript -y -s tsk8stack
```

```console
Created project 'tsk8s'

Created stack 'tsk8stack'

Installing dependencies...


> deasync@0.1.19 install /Users/everis/github/pulumi_demo_gcp/demos/typescript/tsk8s/node_modules/deasync
> node ./build.js

`darwin-x64-node-12` exists; testing
Binary is fine; exiting

> grpc@1.24.2 install /Users/everis/github/pulumi_demo_gcp/demos/typescript/tsk8s/node_modules/grpc
> node-pre-gyp install --fallback-to-build --library=static_library

[grpc] Success: "/Users/everis/github/pulumi_demo_gcp/demos/typescript/tsk8s/node_modules/grpc/src/node/extension_binary/node-v72-darwin-x64-unknown/grpc_node.node" is installed via remote

> protobufjs@6.8.8 postinstall /Users/everis/github/pulumi_demo_gcp/demos/typescript/tsk8s/node_modules/protobufjs
> node scripts/postinstall

added 178 packages from 208 contributors and audited 282 packages in 16.673s
found 0 vulnerabilities

Finished installing dependencies

Your new project is ready to go! ✨

To perform an initial deployment, run 'cd tsk8s', then, run 'pulumi up'
```

Move to the directory and install the kubernetes dependencies.

```sh
cd tsk8s
npm install --save @pulumi/pulumi @pulumi/gcp @pulumi/kubernetes @types/chai @types/mocha chai mocha
```

```console

> @pulumi/gcp@2.1.0 install /Users/everis/github/pulumi_demo_gcp/demos/typescript/tsk8s/node_modules/@pulumi/gcp
> node scripts/install-pulumi-plugin.js resource gcp v2.1.0

[resource plugin gcp-2.1.0] installing

> @pulumi/kubernetes@1.4.1 install /Users/everis/github/pulumi_demo_gcp/demos/typescript/tsk8s/node_modules/@pulumi/kubernetes
> node scripts/install-pulumi-plugin.js resource kubernetes v1.4.1

[resource plugin kubernetes-1.4.1] installing
Downloading plugin: 19.64 MiB / 19.64 MiB [========================] 100.00% 23s
Moving plugin... done.
npm WARN typescript@ No repository field.
npm WARN typescript@ No license field.

+ @pulumi/pulumi@1.8.1
+ @pulumi/gcp@2.1.0
+ @pulumi/kubernetes@1.4.1
added 23 packages from 52 contributors, removed 1 package, updated 1 package and audited 921 packages in 39.856s
found 0 vulnerabilities



   ╭────────────────────────────────────────────────────────────────╮
   │                                                                │
   │      New minor version of npm available! 6.12.0 → 6.13.4       │
   │   Changelog: https://github.com/npm/cli/releases/tag/v6.13.4   │
   │               Run npm install -g npm to update!                │
   │                                                                │
   ╰────────────────────────────────────────────────────────────────╯
```

Set config values for pulumi.

```sh
pulumi config set gcp:project gdcdevops
pulumi config set gcp:zone us-central1-a
```

Create the stack

```sh
pulumi up -y
```

```console
Previewing update (tsk8stack):
     Type                                                           Name                                         Plan       Info
 +   pulumi:pulumi:Stack                                            tsk8s-tsk8stack                              create     7 messages
 +   ├─ gcp:dns:ManagedZone                                         mydns-zone                                   create     
 +   ├─ gcp:compute:Network                                         tsk8snet                                     create     
 +   ├─ gcp:compute:Subnetwork                                      tsk8ssubnet                                  create     
 +   ├─ gcp:container:Cluster                                       gdcdevops                                    create     
 +   ├─ kubernetes:helm.sh:Chart                                    nginx                                        create     
 +   │  ├─ kubernetes:core:Service                                  default/nginx-nginx-ingress-default-backend  create     
 +   │  ├─ kubernetes:apps:Deployment                               default/nginx-nginx-ingress-default-backend  create     
 +   │  ├─ kubernetes:core:Service                                  default/nginx-nginx-ingress-controller       create     
 +   │  ├─ kubernetes:rbac.authorization.k8s.io:ClusterRoleBinding  default/nginx-nginx-ingress                  create     
 +   │  ├─ kubernetes:apps:Deployment                               default/nginx-nginx-ingress-controller       create     
 +   │  ├─ kubernetes:rbac.authorization.k8s.io:RoleBinding         default/nginx-nginx-ingress                  create     
 +   │  ├─ kubernetes:rbac.authorization.k8s.io:ClusterRole         default/nginx-nginx-ingress                  create     
 +   │  ├─ kubernetes:rbac.authorization.k8s.io:Role                default/nginx-nginx-ingress                  create     
 +   │  ├─ kubernetes:core:ServiceAccount                           default/nginx-nginx-ingress                  create     
 +   │  └─ kubernetes:core:ServiceAccount                           default/nginx-nginx-ingress-backend          create     
 +   ├─ pulumi:providers:kubernetes                                 gdcdevops                                    create     
 +   └─ gcp:dns:RecordSet                                           mydns-records                                create     
 
Diagnostics:
  pulumi:pulumi:Stack (tsk8s-tsk8stack):
    Running Mocha Tests: /Users/everis/github/pulumi_demo_gcp/demos/typescript/tsk8s/tests/tests.spec.ts
      Infrastructure
        #Cluster K8s
          ✓ must have at least 3 nodes (206ms)
        #Custom Net
          ✓ must set a custom net, not default
      2 passing (257ms)
 

Permalink: file:///Users/everis/.pulumi/stacks/tsk8stack.json
.
.
.
```

Write the kubeconfig to a file.

```sh
pulumi stack output kubeconfig > kubeconfig
```

Test the connection to the cluster.

```sh
kubectl --kubeconfig=kubeconfig get nodes
```

Destroy the stack.

```sh
pulumi destroy -y
```

```console
Previewing destroy (tsk8stack):

     Type                       Name             Plan       
 -   pulumi:pulumi:Stack        tsk8s-tsk8stack  delete     
 -   ├─ gcp:container:Cluster   gdcdevops        delete     
 -   ├─ gcp:compute:Subnetwork  tsk8ssubnet      delete     
 -   └─ gcp:compute:Network     tsk8snet         delete     
 
Outputs:
  - clusterName: "gdcdevops-605ed93"
  - kubeconfig : "apiVersion: v1\nclusters:\n- cluster:\n    certificate-authority-data:
    .
    .
    ."

Resources:
    - 4 to delete

Destroying (tsk8stack):

     Type                       Name             Status      
 -   pulumi:pulumi:Stack        tsk8s-tsk8stack  deleted     
 -   ├─ gcp:container:Cluster   gdcdevops        deleted     
 -   ├─ gcp:compute:Subnetwork  tsk8ssubnet      deleted     
 -   └─ gcp:compute:Network     tsk8snet         deleted     
 
Outputs:
  - clusterName: "gdcdevops-605ed93"
  - kubeconfig : "apiVersion: v1\nclusters:\n- cluster:\n    certificate-authority-data:
    .
    .
    ."

Resources:
    - 4 deleted

Duration: 3m42s

Permalink: file:///Users/everis/.pulumi/stacks/tsk8stack.json
The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained. 
If you want to remove the stack completely, run 'pulumi stack rm tsk8stack'.
```
