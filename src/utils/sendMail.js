require('dotenv').config({path:'../.env'})
const nodemalier = require('nodemailer')
const transporter = nodemalier.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.AUTH_EMAIL,
        pass:process.env.EMAIL_PASS,
    }
})

const sendMail = async(recipient, subject, message)=>{
  console.log("Send AMil",recipient, subject, message)
    try {
        const info = await transporter.sendMail({
          from: `"Event Reminder" <${process.env.EMAIL_USER}>`, // sender address
          to: recipient, // list of receivers
          subject: subject, // Subject line
          text: message, // plain text body
        });
    
        console.log('Email sent: %s', info.messageId);
      } catch (error) {
        console.error('Error sending email:', error);
      }
}

module.exports = sendMail