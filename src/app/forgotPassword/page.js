"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
//  shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

//  custom components
import LeftPanel from "@/components/LeftPanel";
import StepForm from "@/components/StepForm";

export default function ForgotPasswordPage() {
    useEffect(() => {
      document.title = "Forgot Password";
    }, []);
  const router = useRouter();
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
      const res = await fetch("/api/auth/forgot-password/request", {
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setMessage("Password reset successfully!");
      setStep(1);
      setEmail("");
      setOtp("");
      setPasswords({ newPassword: "", confirmPassword: "" });

      router.push("/login");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (


    <div className="min-h-screen flex items-center justify-center bg-muted/20 font-inter">
      <div className="w-full max-w-5xl bg-background shadow-lg rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-border">
        {/* LEFT PANEL */}
        <LeftPanel />

        {/* RIGHT PANEL */}
        <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-2 text-foreground tracking-tight">
            Forgot Password
          </h2>
          <p className="text-muted-foreground mb-8 text-base">
            Reset your password securely
          </p>

          {/* Dynamic Step Form (Email → OTP → Reset Password) */}
          <StepForm
            step={step}
            email={email}
            otp={otp}
            passwords={passwords}
            setEmail={setEmail}
            setOtp={setOtp}
            setPasswords={setPasswords}
            handleSendEmail={handleSendEmail}
            handleResetPassword={handleResetPassword}
          />

          {/* Message display */}
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
