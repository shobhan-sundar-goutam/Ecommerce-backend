import nodemailer from 'nodemailer';
import config from '../config/index.js';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: config.SMTP_MAIL_HOST,
    port: config.SMTP_MAIL_PORT,
    service: config.SMTP_MAIL_SERVICE,
    auth: {
      user: config.SMTP_MAIL_USERNAME,
      pass: config.SMTP_MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: config.SMTP_MAIL_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
