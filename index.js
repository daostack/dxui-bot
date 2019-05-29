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
    "26eea394c44a59e1bc5e16886d26370742f63dd701a4636eed0e20754103312ecd28829d625efaca6887b075894ffee2f8f76ca34f1d38148c5f808f8f0a06b6";
  let mainVerificationPassed = await verifySource(mainUrl, mainTargetHash);
  if (mainVerificationPassed) {
    console.log("Main JS verification passed");
  } else {
    reportEmergency("Main JS");
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
  }

  // Vendor JS
  let vendorUrl =
    "https://dxdao.daostack.io/vendor.6f6051b0c678d4df7c48.chunk.js";
  let vendorTargetHash =
    "21eea3281494d2033b4e9df674901cdd0398f8131d7ffd9aa16a6bf48d9591c7be6eaa13c37e1f3a12f26c40793ba09eb5e5cb0e9ac98f6251d280ffc501a0d0";
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
  let appUrl = "https://dxdao.daostack.io/app.ae7e1ab9ec82bb1a1204.chunk.js";
  let appTargetHash =
    "ee57a8b977942e4185b8115418a51bd49354fc8637875ec601c9280dcf468107ece5ba77929b71eee3abf74a3c1732423723749917c5a672f98e76633046f83c";

  let appVerificationPassed = await verifySource(appUrl, appTargetHash);
  if (appVerificationPassed) {
    console.log("App JS verification passed");
  } else {
    reportEmergency("App JS");
  }
}

const TIMER_INTERVAL = 30 * 1000; // 30 Seconds
let timerId = setInterval(main, TIMER_INTERVAL);
