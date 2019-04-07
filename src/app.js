const process = require("process")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const _ = require("lodash/fp")
const telegram = require("./integrations/telegram")
const dropbox = require("./integrations/dropbox")

const winston = require("winston")
const expressWinston = require("express-winston")

const app = express()
app.use(bodyParser.json())
app.use(cors())

const stringify = data =>
  typeof data === "string" ? data : JSON.stringify(data, null, 2)

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple()
    ),
    meta: false,
    colorize: false
  })
)

app.post("/notify/telegram", (req, res) => {
  const payload = req.body

  telegram.sendMessage(stringify(payload.message))

  return res.sendStatus(200)
})

app.get("/photos", async (req, res) => {
  const files = await dropbox.getAllFiles()

  const mappedFiles = _.map(
    _.pipe(
      _.pick(["id", "rev", "path_lower", "name", "size"]),
      photo =>
        _.pipe(
          _.set("url", `http://localhost:8888/photos/${photo.id}/thumbnail`),
          _.set("size", { width: 960, height: 640 })
        )(photo)
    )
  )(files)

  return res.send(mappedFiles)
})

app.get("/photos/:id/thumbnail", async (req, res) => {
  const { id } = req.params
  const file = await dropbox.getFile(id)

  if (!file) {
    return res.sendStatus(404)
  }

  return res.set("Content-Type", "image/jpeg").send(file)
})

app.use("*", (req, res) => res.sendStatus(404))

app.listen(process.env.PORT, () => {
  console.log(`AntonPI is running on port ${process.env.PORT}`)
})
