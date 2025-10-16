"use client";
import React, { useState } from "react";

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
        {/* Left Section */}
        <div className="flex flex-col items-center justify-center bg-gray-50 p-10">
          <div className="bg-white shadow-md rounded-2xl p-5 mb-6">
            <img
              src="https://via.placeholder.com/64"
              alt="ManaskaAI Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
            ManaskaAI
          </h1>
          <p className="text-gray-500 mt-2 text-center max-w-xs leading-relaxed">
            AI-Powered Platform <br />
            Transform ideas into intelligent visual maps
          </p>
          <div className="flex space-x-4 mt-6 text-gray-500 text-sm font-medium">
            <span>● Intelligent</span>
            <span>● Adaptive</span>
            <span>● Secure</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-2 text-gray-900 tracking-tight">
            Forgot Password
          </h2>
          <p className="text-gray-500 mb-8 text-base">
            Reset your password securely
          </p>

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendEmail} className="space-y-5">
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm text-gray-600 font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="h-12 border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition"
              >
                Send Email
              </button>
            </form>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex flex-col">
                <label
                  htmlFor="otp"
                  className="text-sm text-gray-600 font-medium mb-1"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the 6-digit OTP"
                  className="h-12 border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition"
              >
                Confirm OTP
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="flex flex-col">
                <label
                  htmlFor="newPassword"
                  className="text-sm text-gray-600 font-medium mb-1"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  placeholder="Enter new password"
                  className="h-12 border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm text-gray-600 font-medium mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Re-enter new password"
                  className="h-12 border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition"
              >
                Reset Password
              </button>
            </form>
          )}

          {/* Message Display */}
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
