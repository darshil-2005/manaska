"use client";

import React, { useState } from "react";
import AuthLeftPanel from "../../components/AuthLeftPanel";
import AuthStepForm from "../../components/AuthStepForm";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setMessage("OTP sent successfully! Please check your email.");
      setStep(2);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      setMessage("OTP verified! Please enter your new password.");
      setStep(3);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: passwords.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setMessage("Password reset successfully!");
      setStep(1);
      setEmail("");
      setOtp("");
      setPasswords({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Panel */}
        <AuthLeftPanel />

        {/* Right Panel */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-2 text-gray-900 tracking-tight">
            Forgot Password
          </h2>
          <p className="text-gray-500 mb-8 text-base">
            Reset your password securely
          </p>

          <AuthStepForm
            step={step}
            email={email}
            otp={otp}
            passwords={passwords}
            setEmail={setEmail}
            setOtp={setOtp}
            setPasswords={setPasswords}
            handleSendEmail={handleSendEmail}
            handleVerifyOtp={handleVerifyOtp}
            handleResetPassword={handleResetPassword}
          />

          {message && (
            <p
              className={`mt-5 text-sm ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
