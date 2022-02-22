const nodeMailer = require("nodemailer");

const sendMessage = async (options) => {
    try {
        var transporter = nodeMailer.createTransport({
            service: process.env.SMPT_SERVICE,
            host: process.env.HOST,
            port: process.env.SERVICE_PORT,
            auth: {
                user: process.env.SMPT_EMAIL,
                pass: process.env.SMPT_PASSWORD,
            },
        });
    } catch (err) {
        console.log("transporter err", err);
    }

    const mailOptions = {
        from: process.env.SMPT_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("sendMailERR", error);
    }
};

module.exports = sendMessage;
