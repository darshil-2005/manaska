import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";

import { db } from "../../../../../../db/db";
import { users, verificationTokens } from "../../../../../../db/schema";
import { validateEmail } from "../../../../../utils/validators";

const OTP_EXPIRY_MINUTES = 10;

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

function generateOtp() {
  const min = 100_000;
  const max = 999_999;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

function validateMailerConfig() {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    return "Missing SMTP configuration. Please define SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM environment variables.";
  }
  return null;
}

let transporter;
function getTransporter() {
  if (!transporter) {
    const parsedPort = parseInt(SMTP_PORT ?? "", 10);
    const port = Number.isNaN(parsedPort) ? 587 : parsedPort;

    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return transporter;
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail || !validateEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "No account found for the provided email." },
        { status: 404 },
      );
    }

    const mailerIssue = validateMailerConfig();
    if (mailerIssue) {
      return NextResponse.json({ error: mailerIssue }, { status: 500 });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, normalizedEmail),
          eq(verificationTokens.typeOfToken, "FORGOT_PASSWORD"),
        ),
      );

    await db.insert(verificationTokens).values({
      identifier: normalizedEmail,
      token: hashedOtp,
      expires: expiresAt,
      typeOfToken: "FORGOT_PASSWORD",
    });

    const transporterInstance = getTransporter();

    await transporterInstance.sendMail({
      from: SMTP_FROM,
      to: normalizedEmail,
      subject: "Your password reset OTP",
      text: `Your One Time Password (OTP) for resetting your password is ${otp}. It is valid for ${OTP_EXPIRY_MINUTES} minutes.`,
      html: `<p>Hi${user.name ? ` ${user.name}` : ""},</p>
<p>Your One Time Password (OTP) for resetting your password is <strong>${otp}</strong>.</p>
<p>This OTP will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
<p>If you did not request this, please ignore this email.</p>`,
    });

    return NextResponse.json({ ok: true, message: "OTP sent to email." });
  } catch (error) {
    console.error("POST /api/auth/forgot-password/request error:", error);
    return NextResponse.json(
      { error: "Failed to send password reset OTP." },
      { status: 500 },
    );
  }
}