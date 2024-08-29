/*you provided is a TypeScript code that sets up an Express server and defines several routes
for handling HTTP requests. */
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { GHL } from "./ghl";
import CryptoJS from 'crypto-js'
import { json } from "body-parser";
import * as db from './dbsqlite3';
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import qs from "qs";

const path = __dirname + "/ui/dist/";

dotenv.config();
const app: Express = express();
app.use(json({ type: 'application/json' }))

app.use(express.static(path));

const ghl = new GHL();

const port = process.env.PORT;

app.get("/authorize-handler", async (req: Request, res: Response) => {
  const { code } = req.query;
  await ghl.authorizationHandler(code as string);

  res.redirect("https://app.gohighlevel.com/");
});

app.post("/payu-settings", async (req: Request, res: Response) => {
  var data = req.body;
  console.log(`Acquired client settings: {locationId: ${data.locationId}, client_id: ${data.client_id}, client_secret: ${data.client_secret}}`);

  var refresh_token = db.get_refresh_token(data.locationId).refresh_token;
  console.log(`Got refresh token: ${refresh_token}`);

  try {
    const resp = await axios.post(
      `${process.env.GHL_API_DOMAIN}/oauth/token`,
      qs.stringify({
        client_id: process.env.GHL_APP_CLIENT_ID,
        client_secret: process.env.GHL_APP_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
      { headers: { "content-type": "application/x-www-form-urlencoded" } }
    );

    var refresh_token = resp.data.refresh_token;
    var access_token = resp.data.access_token;

    console.log(`New access token: ${access_token}`);
    console.log(`New refresh token: ${refresh_token}`);

    db.update_refresh_token(data.locationId, refresh_token);
    console.log("Updated refresh token to database!");

    const resp2 = await axios.post(
      `https://services.leadconnectorhq.com/payments/custom-provider/connect?locationId=${data.locationId}`,
      {
        "live": {
        "apiKey": "FXZHvUJZZQxryRFLeX",
        "publishableKey": `${data.client_id}/${data.client_secret}`
      },
        "test": {
          "apiKey": "FXZHvUJZZQxryRFLeX",
          "publishableKey": `${data.client_id}/${data.client_secret}`
        }
      },
      { headers: {
        Authorization: `Bearer ${access_token}`,
        Version: "2021-07-28"
      }}
    );

    console.log("Post Sent!");
  }
  catch (e) {
    console.error(e);
  }
});

app.post("/decrypt-sso",async (req: Request, res: Response) => {
  const {key} = req.body || {}
  if(!key){
    return res.status(400).send("Please send valid key")
  }
  try {
    const data = ghl.decryptSSOData(key)
    res.send(data)
  } catch (error) {
    res.status(400).send("Invalid Key")
    console.log(error)  
  }
})

app.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

app.get("/payment", function (req, res) {
  res.sendFile(path + "payment.html")
});

app.listen(port, () => {
  console.log(`GHL app listening on port ${port}`);
});
