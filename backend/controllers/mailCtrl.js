const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendMail = (to) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: "testing subject",
        text: "testing text",
        html: "<h1>testing html</h1>"
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        // console.log('Message sent: %s', info.messageId);
    });
};

module.exports = {
    sendMail
};