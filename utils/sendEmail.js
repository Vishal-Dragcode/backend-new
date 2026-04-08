const nodemailer = require("nodemailer");

// Create transporter once — reuse for all emails (faster)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,              // Switch to 587
  secure: false,          // MUST be false for 587 (it uses STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 3,
  family: 4,              // CRITICAL: Forces IPv4 to avoid the log error you saw
  socketTimeout: 30000,
  logger: true,
  debug: true,
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
