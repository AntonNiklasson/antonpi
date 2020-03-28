const crypto = require("crypto")
const axios = require("axios")
const _ = require("lodash/fp")

const prefixUrl = method =>
  `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/${method}`

const executeCommand = (command, payload = {}) => {
  return axios(prefixUrl(command), { params: payload })
    .then(res => res.data)
    .catch(error => {
      console.error(error)
    })
}

const sendMessage = text =>
  executeCommand("sendMessage", {
    chat_id: 276025001,
    text
  })

const onUpdate = async payload => {
  const message = payload.message
  const update_id = payload.update_id

  if (!message || !message.text) {
    console.log("Invalid update", payload)
    return
  }

  console.log(`Received update #${update_id} from chat #${message.chat.id}`)

  switch (true) {
    default: {
      return await sendMessage({
        chat_id: message.chat.id,
        text: `What?`
      })
    }
  }
}

const checkPayloadIntegrity = async (payload, hash) => {
  const secret = sha256(process.env.TELEGRAM_TOKEN)
  const checkString = constructCheckString(payload)
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(checkString)
    .digest("hex")

  return hmac === hash
}

const sha256 = (input, mode) => {
  return crypto
    .createHash("sha256")
    .update(input)
    .digest(mode)
}

const constructCheckString = payload => {
  return _.pipe(
    _.toPairs,
    _.map(([key, value]) => `${key}=${value}`),
    _.sortBy(_.identity),
    _.join("\n")
  )(payload)
}

export default {
  checkPayloadIntegrity,
  executeCommand,
  sendMessage,
  onUpdate
}
