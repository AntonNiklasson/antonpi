import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import config from "config"
import { requestLogger } from "./logger"
import telegram from "./integrations/telegram"
import { getAllFiles, getFile } from "./integrations/dropbox"
const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(requestLogger)

const stringify = data =>
  typeof data === "string" ? data : JSON.stringify(data, null, 2)

app.get("/", (req, res) => {
  return res.sendStatus(200)
})

app.post("/notify/telegram", (req, res) => {
  const payload = req.body

  telegram.sendMessage(stringify(payload))

  return res.sendStatus(200)
})

app.get("/photos", async (req, res) => {
  const files = await getAllFiles()

  return res.send(files)
})

app.get("/photos/:id/thumbnail", async (req, res) => {
  const { id } = req.params
  const file = await getFile(id)

  if (!file) {
    return res.sendStatus(404)
  }

  return res.set("Content-Type", "image/jpeg").send(file)
})

app.use("*", (req, res) => res.sendStatus(404))

const listener = app.listen(config.get("port"), () => {
  // eslint-disable-next-line no-console
  console.log(
    `> AntonPI running on ${config.get("host")}:${listener.address().port}`
  )
})
