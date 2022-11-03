require('dotenv').config({ path: './config.env', override: true });
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create transporter

    /* 
  //for using GMAIL - not recommended
  // const transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     password: process.env.EMAIL_PASSWORD,
  //   },
  // });*/
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT * 1,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    // console.log(transporter);
    //Define the email options
    const mailOptions = {
      from: 'Dor Bezalel <dor.netcraft@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
    // console.log(mailOptions);
    //Actually send email
    await transporter.sendMail(mailOptions);
  } catch (error) {}
};

module.exports = sendEmail;
