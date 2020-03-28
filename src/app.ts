import * as express from "express"
import * as bodyParser from "body-parser"
import * as cors from "cors"
import * as config from "config"
import { requestLogger } from "./logger"
import telegram from "./integrations/telegram"

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(requestLogger)

app.get("/", (req, res) => {
  return res.sendStatus(200)
})

app.use("*", (req, res) => res.sendStatus(404))

const listener = app.listen(config.get("port"), () => {
  // eslint-disable-next-line no-console
  console.log(
    `> AntonPI running on ${config.get("host")}:${listener.address().port}`
  )
})
