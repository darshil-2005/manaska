import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load .env file
dotenv.config(); 


export async function sendEmail({ to, subject, html }) {
  try {
    // Safety check before trying to send
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
      throw new Error("Env variables are missing! Check the logs above.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PASS, 
      },
    });

    const mailOptions = {
      from: `"Manaska" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error };
  }
}

