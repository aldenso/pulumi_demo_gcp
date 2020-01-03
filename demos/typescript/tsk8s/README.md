
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
npm install --save @pulumi/pulumi @pulumi/gcp @pulumi/kubernetes
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

     Type                      Name             Plan       
 +   pulumi:pulumi:Stack       tsk8s-tsk8stack  create     
 +   └─ gcp:container:Cluster  gdcdevops        create     
 
Resources:
    + 2 to create

Updating (tsk8stack):

     Type                      Name             Status      
 +   pulumi:pulumi:Stack       tsk8s-tsk8stack  created     
 +   └─ gcp:container:Cluster  gdcdevops        created     
 
Outputs:
    clusterName: "gdcdevops-d3b3628"

Resources:
    + 2 created

Duration: 3m22s

Permalink: file:///Users/everis/.pulumi/stacks/tsk8stack.json
```

Destroy the stack.

```sh
pulumi destroy -y
```

```console
Previewing destroy (tsk8stack):

     Type                      Name             Plan       
 -   pulumi:pulumi:Stack       tsk8s-tsk8stack  delete     
 -   └─ gcp:container:Cluster  gdcdevops        delete     
 
Outputs:
  - clusterName: "gdcdevops-d3b3628"

Resources:
    - 2 to delete

Destroying (tsk8stack):

     Type                      Name             Status      
 -   pulumi:pulumi:Stack       tsk8s-tsk8stack  deleted     
 -   └─ gcp:container:Cluster  gdcdevops        deleted     
 
Outputs:
  - clusterName: "gdcdevops-d3b3628"

Resources:
    - 2 deleted

Duration: 3m7s

Permalink: file:///Users/everis/.pulumi/stacks/tsk8stack.json
The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained. 
If you want to remove the stack completely, run 'pulumi stack rm tsk8stack'.
```
