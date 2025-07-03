// routes/results.js
const express = require('express');
const router = express.Router();
const { sendSMS } = require('../utils/sms');  // Import sendSMS function

// Example POST route to create results and send SMS if registered
router.post('/Create_results', async (req, res) => {
  const { Trnt_ID, bgmi_wnr, csgo_wnr, bgmi_phone, csgo_phone } = req.body;

  try {
    // TODO: Add your MongoDB logic here to check if phone is registered for this tournament
    const isRegistered = true; // Replace with real registration check

    if (!isRegistered) {
      return res.status(400).json({ message: 'User is not registered for this tournament.' });
    }

    // Save the results to your DB here (pseudo code)
    // await ResultModel.create({ Trnt_ID, bgmi_wnr, csgo_wnr, bgmi_phone, csgo_phone });

    // Send SMS
    const message = `Congrats! You won the tournament ${Trnt_ID}`;
    await sendSMS(bgmi_phone, message);

    res.status(200).json({ message: 'Result saved and SMS sent successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
