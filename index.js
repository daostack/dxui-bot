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
      clearInterval(timerId);
      throw Error();
    }
  });
}

async function main() {
  // Main HTML
  let mainUrl = "https://dxdao.daostack.io/";
  let mainTargetHash =
    "3c0f63b6f26f6d91a6a85d536b7abb49f523c55664f4a0ab09bfcad038f3d17c75e48509c28d4a40997750b1458eda67ceec98b14190855b20ba19c734d429e7";
  let mainVerificationPassed = await verifySource(mainUrl, mainTargetHash);
  if (mainVerificationPassed) {
    console.log("Main JS verification passed");
  } else {
    reportEmergency("Main JS");
  }

  // Runtime JS
  let runtimeUrl =
    "https://dxdao.daostack.io/runtime.5e3871f3cb851dfe3160.bundle.js";
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
  }

  // Vendor JS
  let vendorUrl =
    "https://dxdao.daostack.io/vendor.1bfe584971e7aef2e95b.chunk.js";
  let vendorTargetHash =
    "cba5defc539969bd73b75fd0ab6fb2de5c8aff0a8833c6e534ff87cad7799791258750debedaeef1f0ede2a0c6fdfb4342a2f52a7de2e04ca0bc329bd191fd12";
  let vendorVerificationPassed = await verifySource(
    vendorUrl,
    vendorTargetHash
  );
  if (vendorVerificationPassed) {
    console.log("Vendor JS verification passed");
  } else {
    reportEmergency("Vendor JS");
  }

  // App JS
  let appUrl = "https://dxdao.daostack.io/app.1cd8580f28a8554fa91a.chunk.js";
  let appTargetHash =
    "b5d158770924aa505ebaffdf0955ede69f35837b8b272d871f0d1cb4ab30c8315f944de8584e4ea98ea187d4a30ab1089aa2a04e8b1f58872cf7f6b14d36f6bc";

  let appVerificationPassed = await verifySource(appUrl, appTargetHash);
  if (appVerificationPassed) {
    console.log("App JS verification passed");
  } else {
    reportEmergency("App JS");
  }
}

const TIMER_INTERVAL = 600 * 1000; // 10 Minutes
let timerId = setInterval(main, TIMER_INTERVAL);
