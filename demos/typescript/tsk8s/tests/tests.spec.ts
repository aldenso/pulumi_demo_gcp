// import * as k8s from "@pulumi/kubernetes";
// import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { describe, it } from "mocha";
import { expect } from 'chai';

import { promise } from "./";
import * as infra from "../index";

describe("Infrastructure", () => {
    const cluster: gcp.container.Cluster = infra.ClusterK8s;

    describe("#Cluster K8s", () => {
        it("must have at least 3 nodes", async () => {
            const nodes = await promise(cluster.initialNodeCount);
            expect(nodes).to.gte(3);
        });
    });

    const customNetwork: gcp.compute.Network = infra.customNet;
    describe("#Custom Net", function () {
        it("must set a custom net, not default", async () => {
            const network = await promise(customNetwork.autoCreateSubnetworks);
            expect(network).is.not.true;
        });
    });
});
