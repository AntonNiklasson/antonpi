const process = require("process")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const telegram = require("./telegram")

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

  telegram.sendMessage(stringify(payload))

  return res.sendStatus(200)
})

app.get("*", (req, res) => {
  return res.sendStatus(404)
})

app.listen(process.env.PORT, () => {
  console.log(`AntonPI is running on port ${process.env.PORT}`)
})
