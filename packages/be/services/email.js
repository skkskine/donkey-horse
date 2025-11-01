const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.VITE_API_BASE_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "password update - donkey horse",
    html: `
      <h3>password update request</h3>
      <p>you requested a password update. click the link below to update your password:</p>
      <a href="${resetUrl}">update password</a>
      <p>if you didn't request this, please ignore this email.</p>
      <p>donkey horse :)</p>
      
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("Mail sent!");
}
module.exports = { sendPasswordResetEmail };
