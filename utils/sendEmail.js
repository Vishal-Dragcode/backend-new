const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  await resend.emails.send({
    from: "Trader Nation Academy <onboarding@resend.dev>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  });
};

module.exports = sendEmail;