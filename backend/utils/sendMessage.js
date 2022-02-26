const nodeMailer = require("nodemailer");

const sendMessage = async (options) => {
    var transporter = nodeMailer.createTransport({
        service: process.env.SMPT_SERVICE,
        host: process.env.HOST,
        port: process.env.PORT,
        auth: {
            user: process.env.SMPT_EMAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMPT_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendMessage;
