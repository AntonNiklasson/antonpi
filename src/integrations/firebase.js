var firebase = require("firebase-admin")
var serviceAccount = require("../../firebaseServiceAccountKey.json")

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://antonpi-6a7f5.firebaseio.com"
})

const db = firebase.firestore()

const getUser = async userPayload => {
  const query = await db
    .collection("users")
    .where("telegram_id", "==", userPayload.telegram_id)
    .get()

  if (query.docs.length === 0) return null

  const doc = query.docs[0]

  return { ...doc.data(), id: doc.id }
}

const storeUser = async payload => {
  const ref = await db.collection("users").doc()
  await ref.set(payload)

  const doc = await ref.get()

  return doc.data()
}

const getAllDigests = async user => {
  let snapshot

  if (!user) {
    snapshot = await db.collection("digests").get()
  } else {
    snapshot = await db
      .collection("digests")
      .where("creator", "==", user.telegram_id)
      .get()
  }

  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
}
