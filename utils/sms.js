// utils/sms.js
const twilio = require('twilio');

const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';  // Replace with your Twilio Account SID
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';    // Replace with your Twilio Auth Token
const twilioClient = twilio(accountSid, authToken);

function sendSMS(phone, message) {
  let formattedPhone = phone.trim();
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+91' + formattedPhone; // Change '+91' to your country code if different
  }

  return twilioClient.messages
    .create({
      body: message,
      from: '+19787562506', // Your Twilio phone number
      to: formattedPhone,
    });
}

module.exports = { sendSMS };
