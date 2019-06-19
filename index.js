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
    "e2d7922836b7076ed614bcc73f0e4e6a7c6c535bb22a9f0623fc68f25f2661a645d26b837ea46eea2c7c27317231c9687c28d6e30fd1f09128420b7423496ddf";
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
    "https://dxdao.daostack.io/vendor.5968290f5867c439500d.chunk.js";
  let vendorTargetHash =
    "6cca7c82db977007c59b8b50b5477b33f5f279b81795eb9390c1d4b414901d6942550d5d0b13160adc715c18c0f198b1aa72f4934a2b6710e63e65a761ab1441";
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
  let appUrl = "https://dxdao.daostack.io/app.1c14a51675b50afeaa64.chunk.js";
  let appTargetHash =
    "f2b22f7a5e89a3203f90f730d6cb19f3eec9b162909f703ff1fa8231f289a501c0094f1b20c10a788de6ab0c243f77c0b0eabed909051dc3bfb0b07d156f68d7";

  let appVerificationPassed = await verifySource(appUrl, appTargetHash);
  if (appVerificationPassed) {
    console.log("App JS verification passed");
  } else {
    reportEmergency("App JS");
  }
}

const TIMER_INTERVAL = 600 * 1000; // 10 Minutes
let timerId = setInterval(main, TIMER_INTERVAL);
