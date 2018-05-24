const process = require("process");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const moment = require("moment");
const firebase = require("firebase-admin");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const {
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  ANTONPI_PASSWORD,
  PORT
} = process.env;

firebase.initializeApp({
  credential: firebase.credential.cert({
    project_id: "antonpi-6a7f5",
    private_key:
      (FIREBASE_PRIVATE_KEY && FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")) ||
      require("./serviceAccountKey.json").private_key,
    client_email:
      FIREBASE_CLIENT_EMAIL || require("./serviceAccountKey.json").client_email
  }),
  databaseURL: "https://antonpi-6a7f5.firebaseio.com"
});
const database = firebase.firestore();
const events = database.collection("events");

const passwordProtection = (req, res, next) => {
  if (ANTONPI_PASSWORD) {
    if (
      req.body.password !== ANTONPI_PASSWORD &&
      req.query.password !== ANTONPI_PASSWORD
    ) {
      return res.sendStatus(401);
    }
  }

  next();
};

app.post("/:eventName", passwordProtection, (req, res) => {
  const { eventName } = req.params;
  const eventInstance = { event: eventName, when: moment().valueOf() };

  events
    .add(eventInstance)
    .then(() => {
      return res.send(eventInstance);
    })
    .catch(err => {
      return res.sendStatus(500);
    });
});

app.get("/:eventName", async (req, res) => {
  const { eventName } = req.params;

  events
    .where("event", "==", eventName)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        return res.send(snapshot.docs.map(doc => doc.data()));
      }

      return res.send([]);
    });
});

const port = () => PORT || 8181;

app.listen(port(), () => {
  console.log(`AntonPI is listening on port ${port()}`);
});
