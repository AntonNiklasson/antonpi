const process = require("process")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
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

app.get('/dropbox/folders', async (req,res) => {
	const folders = await dropbox.getFolders()

	return res.send(folders)
})

app.get('/dropbox/thumbnails', async (req,res) => {
	const files = await dropbox.getThumbnails()

	console.log(files)

	return res.set('Content-Type', 'image/jpeg').send(files)
})

app.use('*', (req, res) => res.sendStatus(404))

app.listen(process.env.PORT, () => {
  console.log(`AntonPI is running on port ${process.env.PORT}`)
})
