async function verifySource(url, targetHash) {
  const axios = require("axios");
  const { SHA3 } = require("sha3");
  let response = await axios.get(url);

  const hash = new SHA3(512);

  hash.update(response.data);
  return hash.digest("hex") === targetHash;
}

function reportEmergency(resource) {
  const dotenv = require("dotenv");
  dotenv.config();

  let sender = process.env.SENDER;
  let receiver = process.env.RECEIVER;
  let password = process.env.PASSWORD;

  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: sender,
      pass: password
    }
  });

  var mailOptions = {
    from: sender,
    to: receiver,
    subject: "Error Verifing " + resource,
    text:
      "Error Verifing " +
      resource +
      " in DutchX UI. Please check the website immidiatly."
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

async function main() {
  // Main HTML
  let mainUrl = "https://dxdao.daostack.io/";
  let mainTargetHash =
    "d085e531b6bf690c0074d9d5661ea93763324e3ef9e16ff9ead7a735c15cabd5cee78a0a417533c5323cfdae50634dec018c8bf539c03cf76ddd4f66b584f009";
  let mainVerificationPassed = await verifySource(mainUrl, mainTargetHash);
  if (mainVerificationPassed) {
    console.log("Main JS verification passed");
  } else {
    reportEmergency("Main JS");
    throw Error();
  }

  // Runtime JS
  let runtimeUrl =
    "https://dxdao.daostack.io/runtime.a40232df10e83de8e3a4.bundle.js";
  let runtimeTargetHash =
    "240a583ee0f3bb5917cf953665d8fb4ca56c78bdcb6496a7dc5acac8ee1fa88be31c421446fc9f36ef881e26d67368eeffb7d95552788e0ff0fa3380c57a57c2";
  let runtimeVerificationPassed = await verifySource(
    runtimeUrl,
    runtimeTargetHash
  );
  if (runtimeVerificationPassed) {
    console.log("Runtime JS verification passed");
  } else {
    reportEmergency("Runtime JS");
    throw Error();
  }

  // Vendor JS
  let vendorUrl =
    "https://dxdao.daostack.io/vendor.ff89d59e8a57108b6d86.chunk.js";
  let vendorTargetHash =
    "34f044129070853ad2f822fa4e03cc7df928dba9d9faab88176eba6335da020c2195b570567bb23f3ec508b457d56bb0a5a3d864b6acff817d5c4599808fb5d7";
  let vendorVerificationPassed = await verifySource(
    vendorUrl,
    vendorTargetHash
  );
  if (vendorVerificationPassed) {
    console.log("Vendor JS verification passed");
  } else {
    reportEmergency("Vendor JS");
    throw Error();
  }

  // App JS
  let appUrl = "https://dxdao.daostack.io/app.d5a1d39dcda23d9710f2.chunk.js";
  let appTargetHash =
    "fb846cea050dddfa3a5734a6be493a29aafbaa2e81f22feff49ed483afd85fe04ec0dde685ab46c1d3b7031fdb1070b3da7ff8952da4d3732fb2232fa43d8161";

  let appVerificationPassed = await verifySource(appUrl, appTargetHash);
  if (appVerificationPassed) {
    console.log("App JS verification passed");
  } else {
    reportEmergency("App JS");
    throw Error();
  }
}

const TIMER_INTERVAL = 30 * 1000; // 30 Seconds
setInterval(main, TIMER_INTERVAL);
