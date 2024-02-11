const express = require('express');
const User = require('../../models/User');
const router = express.Router();

const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
router.post('/send-otp', async (req, res) => {
    const { phoneNumber, email } = req.body;
    const otp = generateOTP();
    const user = await User.findOneAndUpdate(
        { phoneNumber },
        { otp, email },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    try {
        const sent = await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: process.env.TWILIO_PHONE,
            to: phoneNumber,
        });

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.log('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP', errorLog: error });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { phoneNumber, code } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });
        console.log(typeof user.otp, 42);
        if (user && user.otp === code) {
            user.otp = ''; // Clear OTP after successful verification
            await user.save();
            res.json({ message: 'OTP verified successfully', authenticated: true });
        } else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify OTP', authenticated: false });
    }
});

module.exports = router;