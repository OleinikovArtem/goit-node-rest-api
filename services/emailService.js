import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationURL = `${process.env.BASE_URL || "http://localhost:3000"}/api/auth/verify/${verificationToken}`;

  const mailOptions = {
    from: SMTP_USER,
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Please verify your email</h2>
      <p>Click the following link to verify your email address:</p>
      <a href="${verificationURL}">${verificationURL}</a>
      <p>If you did not create an account, please ignore this email.</p>
    `,
    text: `Please verify your email by clicking the following link: ${verificationURL}`,
  };

  await transporter.sendMail(mailOptions);
};

export default {
  sendVerificationEmail,
};
