const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const qrcode = require("qrcode-terminal");

const { Client, MessageMedia } = require("whatsapp-web.js");
var bodyParser = require("body-parser");

app.use(bodyParser.json());

const client = new Client({
  puppeteer: {
    headless: false,
  },
  clientId: "clients",
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
  app.get("/getqr", (req, res, next) => {
    res.send({ qr });
  });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});

app.post("/send/message", async (req, res, next) => {
  try {
    const { number, message } = req.body;
    await client.sendMessage(`${number}@c.us`, message);
    res.send("true");
  } catch (error) {
    next(error);
  }
});


app.listen(8080, () => {
  console.log("Listening to port 8080");
});
client.initialize();
