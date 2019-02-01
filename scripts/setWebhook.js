#! /usr/bin/env node

require('dotenv').config()

const axios = require('axios')
const minimist = require('minimist')

const args = minimist(process.argv.slice(2))
const token = process.env.TELEGRAM_TOKEN
const webhook = args._[0]
const url = `https://api.telegram.org/bot${token}/setWebhook`

axios(url, {
  params: {
    url: `${webhook}/api/telegram`
  }
})
.then(res => console.log(res.data))
.catch(error => console.log(error.response.data))
