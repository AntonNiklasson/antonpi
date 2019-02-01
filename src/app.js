const process = require("process")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const moment = require("moment")
const { passwordProtection } = require("./middlewares")

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.use("/", (req, res) => {
  return res.send("hello world")
})

app.listen(process.env.PORT, () => {
  console.log(`AntonPI is running on port ${process.env.PORT}`)
})
