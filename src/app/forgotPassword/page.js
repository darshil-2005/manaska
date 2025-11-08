"use client"

import React, { useState } from "react"
import AuthLeftPanel from "@/components/LeftPanel"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState("")

  const handleSendEmail = async (e) => {
    e.preventDefault()
    setMessage("")
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send OTP")
      setMessage("OTP sent successfully! Please check your email.")
      setStep(2)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setMessage("")
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid OTP")
      setMessage("OTP verified! Please enter your new password.")
      setStep(3)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setMessage("")

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage("Passwords do not match.")
      return
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: passwords.newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to reset password")

      setMessage("Password reset successfully!")
      setStep(1)
      setEmail("")
      setOtp("")
      setPasswords({ newPassword: "", confirmPassword: "" })
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 font-inter">
      <div className="w-full max-w-5xl bg-background shadow-lg rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Panel */}
        <AuthLeftPanel />

        {/* Right Panel */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center md:text-left p-0 mb-6">
              <CardTitle className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Forgot Password
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Reset your password securely
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {/* Step 1: Send OTP */}
              {step === 1 && (
                <form onSubmit={handleSendEmail} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send OTP
                  </Button>
                </form>
              )}

              {/* Step 2: Verify OTP */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <Input
                      id="otp"
                      name="otp"
                      placeholder="Enter OTP sent to your email"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Verify OTP
                  </Button>
                </form>
              )}

              {/* Step 3: Reset Password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Reset Password
                  </Button>
                </form>
              )}

              {/* Message */}
              {message && (
                <p
                  className={`mt-5 text-sm ${
                    message.toLowerCase().includes("success")
                      ? "text-green-600"
                      : "text-destructive"
                  }`}
                >
                  {message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
