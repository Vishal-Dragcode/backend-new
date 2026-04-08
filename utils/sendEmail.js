const nodemailer = require("nodemailer");

// Create transporter once — reuse for all emails (faster)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Explicit host is better than "service"
  port: 465,              // Secure port
  secure: true,           // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // MUST be a 16-character App Password
  },
  pool: true,
  maxConnections: 3,      // Lowering to 3 is safer for Gmail's limits
  socketTimeout: 30000,   // Wait 30s before giving up
  logger: true,           // Keep this on until you verify it works!
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
