const nodemailer = require('nodemailer');


const sendEmail = async (options)=>{
    const email = process.env.EMAIL;
    const email_password = process.env.EMAIL_PASSWORD;

    //CREATING EMAIL TRANSPORT
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
           user: email,
           password: email_password, 
        }
    });


    //configure options

    const mailOptions = {
        from: "officialrentdirect@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    //send email

    await transporter.sendEmail(mailOptions);
}

module.exports = sendEmail;