var admin = require("firebase-admin");

var serviceAccount = require("./sdbilms-1db30-firebase-adminsdk-5om5z-1a0cb2aa50.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://prismappfcm.firebaseio.com",
});

const sendNotification = (title, body, userId) => {
  var message = {
    notification: {
      title: title,
      body: body,
    },
    topic: userId,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

module.exports = sendNotification;
