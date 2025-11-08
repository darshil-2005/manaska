"use client";
import React from "react";
import AuthInput from "./Input";
import AuthButton from "./AuthButton";

/**
 * Generic step form component for Forgot Password flow.
 * Props:
 *  - step (number)
 *  - email, otp, passwords (object)
 *  - handlers for each form submit
 */
export default function AuthStepForm({
  step,
  email,
  otp,
  passwords,
  setEmail,
  setOtp,
  setPasswords,
  handleSendEmail,
  handleVerifyOtp,
  handleResetPassword,
}) {
  if (step === 1) {
    return (
      <form onSubmit={handleSendEmail} className="space-y-5">
        <AuthInput
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* ✅ Changed to children */}
        <AuthButton>Send Email</AuthButton>
      </form>
    );
  }

  if (step === 2) {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-5">
        <AuthInput
          id="otp"
          label="Enter OTP"
          placeholder="Enter the 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        {/* ✅ Changed to children */}
        <AuthButton>Confirm OTP</AuthButton>
      </form>
    );
  }

  if (step === 3) {
    return (
      <form onSubmit={handleResetPassword} className="space-y-5">
        <AuthInput
          id="newPassword"
          type="password"
          label="New Password"
          placeholder="Enter new password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
        />
        <AuthInput
          id="confirmPassword"
          type="password"
          label="Confirm New Password"
          placeholder="Re-enter new password"
          value={passwords.confirmPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, confirmPassword: e.target.value })
          }
        />
        <AuthButton>Reset Password</AuthButton>
      </form>
    );
  }

  return null;
}
