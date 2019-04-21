const crypto = require("crypto")
const axios = require("axios")
const _ = require("lodash/fp")
const firebase = require("./firebase")
const logger = require("./logger")

const prefixUrl = method =>
  `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/${method}`

const executeCommand = (command, payload = {}) => {
  return axios(prefixUrl(command), { params: payload })
    .then(res => res.data)
    .catch(error => {
      logger.error(error)
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
    logger.info("Invalid update", payload)
    return
  }

  logger.info(`Received update #${update_id} from chat #${message.chat.id}`)

  const updateExists = await firebase.telegramUpdateExists(update_id)

  // Don't act on updates already stored.
  if (updateExists) {
    logger.info(`Update #${update_id} has already been handled`)
    return
  }

  // Grab the previous update, and store the current one.
  // const previousUpdate = await firebase.getPreviousUpdateFromTelegramChat(
  // message.chat.id
  // )
  await firebase.storeTelegramUpdate(update_id, message)

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

module.exports = {
  checkPayloadIntegrity,
  executeCommand,
  sendMessage,
  onUpdate
}
