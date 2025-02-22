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
  console.log("Sending verification email to:", to, "with code:", code); // Added for debugging
  const mailOptions = {
    from: `"Snap-Thrift" <${EMAIL_USER}>`,
    to: to,
    subject: "Verification Code",
    text: `Your verification code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send verification email:", error.message);
    return res
      .status(400)
      .json({ message: "Failed to send verification otp to email" });
  }
};

// Thank You Email
const sendThankYouEmail = async (to, firstName) => {
  const mailOptions = {
    from: `"Snap-Thrift" <${EMAIL_USER}>`,
    to: to,
    subject: "Thank You for Registering!",
    html: `
      <h1>Welcome, ${firstName}!</h1>
      <p>Thank you for joining our treasure-hunting family at Snap Thrift! </p>
     <p>We're thrilled to have you on board to explore unique finds, sustainable fashion, and one-of-a-kind deals.</p>
      <p>Happy thrifting!<br>Snap Thrift</p>\
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send thank you email:", error.message);
  }
};

export { sendThankYouEmail, sendVerificationEmail };
