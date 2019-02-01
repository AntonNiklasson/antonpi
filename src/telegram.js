const crypto = require("crypto")
const axios = require("axios")
const _ = require("lodash/fp")
const firebase = require("./firebase")

const prefixUrl = method =>
  `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/${method}`

const executeCommand = (command, payload = {}) => {
  log("executeCommand", command)
  return axios(prefixUrl(command), { params: payload })
    .then(res => res.data)
    .catch(error => {
      logger.error(error)
    })
}

const onUpdate = async payload => {
  const message = payload.message
  const update_id = payload.update_id

  if (!message || !message.text) {
    log("Invalid update", payload)
    return
  }

  log(`Received update #${update_id} from chat #${message.chat.id}`)

  const updateExists = await firebase.telegramUpdateExists(update_id)

  // Don't act on updates already stored.
  if (updateExists) {
    log(`Update #${update_id} has already been handled`)
    return
  }

  // Grab the previous update, and store the current one.
  const previousUpdate = await firebase.getPreviousUpdateFromTelegramChat(
    message.chat.id
  )
  await firebase.storeTelegramUpdate(update_id, message)

  switch (true) {
    /*
    case message.text.startsWith("/help"): {
      return sendMessage({
        chat_id: message.chat.id,
        text: `I will help you avoid some distractions, while still staying on top of the things your are interested in.\n\nCheckout https://digest.antonniklasson.se`
      })
    }
    case message.text.startsWith("/subscribe"): {
      const digestId = message.text.split("/subscribe")[1].trim()

      if (!digestId.length) {
        return sendMessage({
          chat_id: message.chat.id,
          text:
            'Subscribe with "/subscribe abc-123"\n\nGo here to create a digest: https://digest.antonniklasson.se'
        })
      }

      const digest = await firebase.getDigest(digestId)

      if (!digest) {
        sendMessage({
          chat_id: message.chat.id,
          text: `I could not find a digest with that id ${emoji.get("pensive")}`
        })
        return
      }

      await firebase.subscribeChatToDigest(message.chat.id, digestId)

      sendMessage({
        chat_id: message.chat.id,
        text: `You are now subscribed to "${digest.title}" ${emoji.get(
          "ok_hand"
        )}`
      })
      break
    }
    case message.text.startsWith("/unsubscribe"): {
      const subscriptions = await firebase.getSubscriptionsByChat(
        message.chat.id
      )

      if (subscriptions.length === 0) {
        await sendMessage({
          chat_id: message.chat.id,
          text: `You are not subscribed to any digests ${emoji.get(
            "unamused"
          )} Go here to create one: https://digest.antonniklasson.se ${emoji.get(
            "v"
          )}`
        })
      } else {
        await sendMessage({
          chat_id: message.chat.id,
          text: "Which digest would you like to unsubscribe from?",
          reply_markup: {
            one_time_keyboard: true,
            keyboard: [subscriptions.map(s => s.title)]
          }
        })
      }
      break
    }
    */
    default: {
      if (
        previousUpdate &&
        previousUpdate.message.text.startsWith("/unsubscribe")
      ) {
        await firebase.unsubscribeChatFromDigest(message.chat.id, message.text)
        return await sendMessage({
          chat_id: message.chat.id,
          text: `Done ${emoji.get("white_check_mark")}`
        })
      }

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

const sendMessage = payload => executeCommand("sendMessage", payload)

module.exports = {
  checkPayloadIntegrity,
  executeCommand,
  sendMessage,
  onUpdate
}