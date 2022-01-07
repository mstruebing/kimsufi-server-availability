#!/usr/bin/env node

import fetch from "node-fetch";
import nodemailer from "nodemailer";

const WANTED_SERVERS = [
  "2201sk010", // KS1
  "2201sk011", // KS2
];

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const RECEIVER = process.env.RECEIVER;

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const mailOptions = {
  from: SMTP_USER,
  to: RECEIVER,
  subject: "KIMSUFI SERVER AVAILABLE",
  text: "GO BUY",
};

(async () => {
  const response = await fetch(
    "https://www.ovh.com/engine/api/dedicated/server/availabilities?country=de"
  );

  const allProducts = await response.json();
  const targetProducts = allProducts.filter((product) =>
    WANTED_SERVERS.includes(product.hardware)
  );

  const available = targetProducts.some(
    (server) =>
      server.datacenters.filter(
        (datacenter) => datacenter.availability !== "unavailable"
      ).length > 0
  );

  if (available) {
    smtpTransport.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("sending mail");
        smtpTransport.sendMail(mailOptions);
      }
    });
  }
})();
