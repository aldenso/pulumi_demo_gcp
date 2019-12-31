# VM demo using python

Create a new project called pyvms.

```sh
pulumi new -d "Vms using python" --dir pyvms gcp-python -y -s pyvmstack
```

```console
Created project 'pyvms'

Created stack 'pyvmstack'

Saved config

Your new project is ready to go! ✨

To perform an initial deployment, run the following commands:

   1. cd pyvms
   2. virtualenv -p python3 venv
   3. source venv/bin/activate
   4. pip3 install -r requirements.txt

Then, run 'pulumi up'
```

Follow the instructions.

```sh
cd pyvms
virtualenv -p python3 venv
source venv/bin/activate
pip3 install -r requirements.txt
```

Create the stack.

```sh
pulumi up -y
```

```console
Previewing update (pyvmstack):

     Type                     Name             Plan       
 +   pulumi:pulumi:Stack      pyvms-pyvmstack  create     
 +   ├─ gcp:compute:Address   pyvmaddr         create     
 +   ├─ gcp:compute:Network   pyvmnet          create     
 +   ├─ gcp:compute:Firewall  pyvmfirewall     create     
 +   └─ gcp:compute:Instance  pyvmhost         create     
 
Resources:
    + 5 to create

Updating (pyvmstack):

     Type                     Name             Status      
 +   pulumi:pulumi:Stack      pyvms-pyvmstack  created     
 +   ├─ gcp:compute:Address   pyvmaddr         created     
 +   ├─ gcp:compute:Network   pyvmnet          created     
 +   ├─ gcp:compute:Firewall  pyvmfirewall     created     
 +   └─ gcp:compute:Instance  pyvmhost         created     
 
Outputs:
    NETWORK  : "https://www.googleapis.com/compute/v1/projects/gdcdevops/global/networks/pyvmnet-63e6881"
    PUBLIC_IP: "34.68.37.5"
    VM       : "pyvmhost"

Resources:
    + 5 created

Duration: 1m6s

Permalink: file:///Users/everis/.pulumi/stacks/pyvmstack.json
```

Destroy the stack

```sh
pulumi destroy -y
```

```console
Previewing destroy (pyvmstack):

     Type                     Name             Plan       
 -   pulumi:pulumi:Stack      pyvms-pyvmstack  delete     
 -   ├─ gcp:compute:Firewall  pyvmfirewall     delete     
 -   ├─ gcp:compute:Instance  pyvmhost         delete     
 -   ├─ gcp:compute:Address   pyvmaddr         delete     
 -   └─ gcp:compute:Network   pyvmnet          delete     
 
Outputs:
  - NETWORK  : "https://www.googleapis.com/compute/v1/projects/gdcdevops/global/networks/pyvmnet-63e6881"
  - PUBLIC_IP: "34.68.37.5"
  - VM       : "pyvmhost"

Resources:
    - 5 to delete

Destroying (pyvmstack):

     Type                     Name             Status      
 -   pulumi:pulumi:Stack      pyvms-pyvmstack  deleted     
 -   ├─ gcp:compute:Firewall  pyvmfirewall     deleted     
 -   ├─ gcp:compute:Instance  pyvmhost         deleted     
 -   ├─ gcp:compute:Network   pyvmnet          deleted     
 -   └─ gcp:compute:Address   pyvmaddr         deleted     
 
Outputs:
  - NETWORK  : "https://www.googleapis.com/compute/v1/projects/gdcdevops/global/networks/pyvmnet-63e6881"
  - PUBLIC_IP: "34.68.37.5"
  - VM       : "pyvmhost"

Resources:
    - 5 deleted

Duration: 2m2s

Permalink: file:///Users/everis/.pulumi/stacks/pyvmstack.json
The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained. 
If you want to remove the stack completely, run 'pulumi stack rm pyvmstack'.
```

```sh
pulumi stack rm pyvmstack -y
```

```console
Stack 'pyvmstack' has been removed!
```
