#!/usr/bin/env node

import fetch from "node-fetch";

const KS1 = "2201sk010";
const KS2 = "2201sk011";

(async () => {
  const response = await fetch(
    "https://www.ovh.com/engine/api/dedicated/server/availabilities?country=de"
  );

  const products = await response.json();

  const ks1 = products.filter((product) => product.hardware === KS1);
  const ks2 = products.filter((product) => product.hardware === KS2);

  const ks1Available = ks1.some(
    (server) =>
      server.datacenters.filter(
        (datacenter) => datacenter.availability !== "unavailable"
      ).length > 0
  );

  const ks2Available = ks2.some(
    (server) =>
      server.datacenters.filter(
        (datacenter) => datacenter.availability !== "unavailable"
      ).length > 0
  );

  console.log("ks1Available:", ks1Available);
  console.log("ks2Available:", ks2Available);
})();
