const nodemailer = require("nodemailer");

// Create transporter once — reuse for all emails (faster)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,        // use connection pool
  maxConnections: 5, // max 5 simultaneous connections
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: `"Trader Nation Academy" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
