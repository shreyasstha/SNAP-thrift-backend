import nodemailer from "nodemailer";
const { EMAIL_USER, EMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Verification Email
const sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: `"No Reply" <${EMAIL_USER}>`,
    to: to,
    subject: "Verification Code",
    text: `Your verification code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(" Failed to send verification email:", error.message);
  }
};

// Thank You Email
const sendThankYouEmail = async (to, firstName) => {
  const mailOptions = {
    from: `"No Reply" <${EMAIL_USER}>`,
    to: to,
    subject: "Thank You for Registering!",
    html: `
      <h1>Welcome, ${firstName}!</h1>
      <p>Thank you for registering with us. We're excited to have you on board!</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>PhytoCheck</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send thank you email:", error.message);
  }
};

export { sendThankYouEmail, sendVerificationEmail };
