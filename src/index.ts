/*you provided is a TypeScript code that sets up an Express server and defines several routes
for handling HTTP requests. */
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { GHL } from "./ghl";
import * as CryptoJS from 'crypto-js'
import { json } from "body-parser";
import axios from "axios";

const path = __dirname + "/ui/dist/";

dotenv.config();
const app: Express = express();
app.use(json({ type: 'application/json' }))

/*`app.use(express.static(path));` is setting up a middleware in the Express server. The
`express.static` middleware is used to serve static files such as HTML, CSS, JavaScript, and images. */
app.use(express.static(path));

/* The line `const ghl = new GHL();` is creating a new instance of the `GHL` class. It is assigning
this instance to the variable `ghl`. This allows you to use the methods and properties defined in
the `GHL` class to interact with the GoHighLevel API. */
const ghl = new GHL();

const port = process.env.PORT;

/*`app.get("/authorize-handler", async (req: Request, res: Response) => { ... })` sets up an example how you can authorization requests */
app.get("/authorize-handler", async (req: Request, res: Response) => {
  const { code } = req.query;

  try {
    const resp = await axios.post(
      `${process.env.GHL_API_DOMAIN}/oauth/token`,
      {
        client_id: process.env.GHL_APP_CLIENT_ID,
        client_secret: process.env.GHL_APP_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
      },
      { headers: { "content-type": "application/x-www-form-urlencoded" } }
    );

    const locationId = resp.data.locationId;

    console.log(`Location ID: ${resp.data.locationId}`);
    console.log(`Access Token: ${resp.data.access_token}`);

    const resp2 = await axios.post(
      `https://services.leadconnectorhq.com/payments/custom-provider/provider?locationId=${locationId}`,
      {
        "name": "PayU",
        "description": "Operator płatności internetowych, działający jako system, który daje możliwość dokonywania oraz otrzymywania wpłat przez Internet",
        "paymentsUrl": "https://payu-9gvx.onrender.com/payment",
        "queryUrl": "https://payu-9gvx.onrender.com/query",
        "imageUrl": "https://msgsndr-private.storage.googleapis.com/marketplace/apps/66cb484efa377f800409bd8e/3425444f-a209-4fb3-a198-e4d975525d76.png"
      },
      { headers: {
        Authorization: `Bearer ${resp.data.access_token}`,
        Version: "2021-07-28"
      }}
    );

  } catch (error: any) {
    console.error(error?.response?.data);
  }

  res.redirect("https://app.gohighlevel.com/");
});

/*`app.get("/example-api-call", async (req: Request, res: Response) => { ... })` shows you how you can use ghl object to make get requests
 ghl object in abstract would handle all of the authorization part over here. */
app.get("/example-api-call", async (req: Request, res: Response) => {
  if (ghl.checkInstallationExists(req.query.companyId as string)) {
    try {
      const request = await ghl
        .requests(req.query.companyId as string)
        .get(`/users/search?companyId=${req.query.companyId}`, {
          headers: {
            Version: "2021-07-28",
          },
        });
      return res.send(request.data);
    } catch (error) {
      console.log(error);
    }
  }
  return res.send("Installation for this company does not exists");
});

/*`app.get("/example-api-call-location", async (req: Request, res: Response) => { ... })` shows you how you can use ghl object to make get requests
 ghl object in abstract would handle all of the authorization part over here. */
app.get("/example-api-call-location", async (req: Request, res: Response) => {
  /* The line `if(ghl.checkInstallationExists(req.params.locationId)){` is checking if an
    installation already exists for a specific location. It calls the `checkInstallationExists`
    method of the `GHL` class and passes the `locationId` as a parameter. This method checks if
    there is an existing installation for the provided locationId and returns a boolean value
    indicating whether the installation exists or not. */
  try {
    /*if (ghl.checkInstallationExists(req.params.locationId)) {
      const request = await ghl
        .requests(req.query.locationId as string)
        .get(`/contacts/?locationId=${req.query.locationId}`, {
          headers: {
            Version: "2021-07-28",
          },
        });
      return res.send(request.data);
    } else {
      await ghl.getLocationTokenFromCompanyToken(
        req.query.companyId as string,
        req.query.locationId as string
      );
      const request = await ghl
        .requests(req.query.locationId as string)
        .get(`/contacts/?locationId=${req.query.locationId}`, {
          headers: {
            Version: "2021-07-28",
          },
        });
      return res.send(request.data);*/

      console.log(req.params.locationId);

      const request = await ghl
        .requests(req.params.locationId as string)
        .post(`/payments/custom-provider/provider?locationId=${req.params.locationId}`, JSON.stringify({
          name: "PayU",
          description: "Operator płatności internetowych, działający jako system, który daje możliwość dokonywania oraz otrzymywania wpłat przez Internet",
          paymentsUrl: "https://payu-9gvx.onrender.com/payment",
          queryUrl: "https://payu-9gvx.onrender.com/query",
          imageUrl: "https://msgsndr-private.storage.googleapis.com/marketplace/apps/66cb484efa377f800409bd8e/3425444f-a209-4fb3-a198-e4d975525d76.png"
        }), {
          headers: {
            Version: "2021-07-28",
          }
        });
  } catch (error) {
    console.log(error);
    res.send(error).status(400)
  }
});

/*`app.post("example-webhook-handler",async (req: Request, res: Response) => {
    console.log(req.body)
})` sets up a route for handling HTTP POST requests to the "/example-webhook-handler" endpoint. The below POST
api can be used to subscribe to various webhook events configured for the app. */
app.post("/example-webhook-handler",async (req: Request, res: Response) => {
    console.log(req.body)
})


/* The `app.post("/decrypt-sso",async (req: Request, res: Response) => { ... })` route is used to
decrypt session details using ssoKey. */
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

/*`app.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});` sets up a route for the root URL ("/") of the server.  This is
 used to serve the main HTML file of a web application. */
app.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

/*`app.listen(port, () => {
  console.log(`GHL app listening on port `);
});` is starting the Express server and making it listen on the specified port. */
app.listen(port, () => {
  console.log(`GHL app listening on port ${port}`);
});
