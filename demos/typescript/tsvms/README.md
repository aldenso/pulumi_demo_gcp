# VM demo using typescript

Create a new project called tsvms.

```sh
pulumi new -d "Vms using typescript" --dir tsvms gcp-typescript  -y -s tsvmstack
```

```console
Created project 'tsvms'

Created stack 'tsvmstack'

Saved config

Installing dependencies...


> deasync@0.1.19 install /Users/everis/github/pulumi_demo_gcp/demos/typescript/tsvms/node_modules/deasync
> node ./build.js

`darwin-x64-node-12` exists; testing
Binary is fine; exiting

> grpc@1.24.2 install /Users/everis/github/pulumi_demo_gcp/demos/typescript/tsvms/node_modules/grpc
> node-pre-gyp install --fallback-to-build --library=static_library

[grpc] Success: "/Users/everis/github/pulumi_demo_gcp/demos/typescript/tsvms/node_modules/grpc/src/node/extension_binary/node-v72-darwin-x64-unknown/grpc_node.node" is installed via remote

> @pulumi/gcp@1.9.0 install /Users/everis/github/pulumi_demo_gcp/demos/typescript/tsvms/node_modules/@pulumi/gcp
> node scripts/install-pulumi-plugin.js resource gcp v1.9.0

[resource plugin gcp-1.9.0] installing
Downloading plugin: 28.82 MiB / 28.82 MiB [========================] 100.00% 45s
Moving plugin... done.

> protobufjs@6.8.8 postinstall /Users/everis/github/pulumi_demo_gcp/demos/typescript/tsvms/node_modules/protobufjs
> node scripts/postinstall

added 189 packages from 229 contributors and audited 609 packages in 81.407s
found 0 vulnerabilities



   ╭────────────────────────────────────────────────────────────────╮
   │                                                                │
   │      New minor version of npm available! 6.12.0 → 6.13.2       │
   │   Changelog: https://github.com/npm/cli/releases/tag/v6.13.2   │
   │               Run npm install -g npm to update!                │
   │                                                                │
   ╰────────────────────────────────────────────────────────────────╯

Finished installing dependencies

Your new project is ready to go! ✨

To perform an initial deployment, run 'cd tsvms', then, run 'pulumi up'
```

Enter the directory and change the configuration files.

```sh
cd tsvms
```

Create the stack

```sh
pulumi up -y
```

```console
Previewing update (tsvmstack):

     Type                       Name             Plan
 +   pulumi:pulumi:Stack        tsvms-tsvmstack  create
 +   ├─ gcp:compute:Network     tsvmnet          create
 +   ├─ gcp:compute:Address     tsvmaddress      create
 +   ├─ gcp:compute:Subnetwork  tssubnet         create
 +   ├─ gcp:compute:Firewall    tsvmfirewall     create
 +   └─ gcp:compute:Instance    tsvmhost         create

Resources:
    + 6 to create
```