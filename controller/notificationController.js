const admin = require('firebase-admin');
const messages = require('../utils/message');


const serviceAccount = require('../firebase-adminsdk.json'); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const sendNotification = (req, res) => {
  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ message: messages.error.MISSING_REQUIRED_FIELDS });
  }

  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
      res.status(200).json({ message: messages.success.PUSHNOTIFICATION_SEND});
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      res.status(500).json({ message :messages.error.NOTIFICATION_FAILED});
    });
};


module.exports = {
  sendNotification,
};
