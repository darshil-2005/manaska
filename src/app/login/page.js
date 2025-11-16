"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Check, X, Eye, EyeOff } from "lucide-react"; // --- ADDED Eye and EyeOff ---

// --- TOAST ---
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// --- END TOAST ---

//shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// components
import LeftPanel from "@/components/LeftPanel";
import Social from "@/components/Social";

// Helper function for email validation
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper component to display a single validation rule.
function PasswordRuleCheck({ text, isValid }) {
  const Icon = isValid ? Check : X;
  const colorClass = isValid ? "text-green-600" : "text-destructive";

  return (
    <div className={`flex items-center text-sm ${colorClass}`}>
      <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
      <span>{text}</span>
    </div>
  );
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "", // This field holds either email or username
    password: "",
    remember: false,
  });

  // --- ADDED ---
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  // --- END ADDED ---

  const router = useRouter();

  // Smart validation for the "Email or username" field
  const emailCheck = useMemo(() => {
    const input = formData.email;
    if (!input.includes("@")) {
      return { active: false, valid: false };
    }
    return { active: true, valid: validateEmail(input) };
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --- ADDED ---
  // Toggle function for password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  // --- END ADDED ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter both email/username and password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );
      console.log("Login successful:", response.data);

      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 font-inter px-4 sm:px-6">
      {/* --- TOAST CONTAINER --- */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        theme="dark"
      />
      {/* --- END TOAST --- */}

      <div className="w-full max-w-5xl bg-background shadow-lg rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-border">
        {/* LEFT PANEL */}
        <LeftPanel />

        {/* RIGHT PANEL */}
        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-semibold mb-2 text-foreground text-center md:text-left">
              Welcome back
            </h2>
            <p className="text-muted-foreground mb-8 text-sm text-center md:text-left">
              Log in to continue to ManaskaAI
            </p>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email or username */}
            <div className="space-y-2">
              <Label htmlFor="email">Email or username</Label>
              <Input
                id="email"
                name="email"
                placeholder="Enter your email or username"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              {/* Conditional Email Validation */}
              {emailCheck.active && (
                <div className="mt-2 pl-1">
                  <PasswordRuleCheck
                    text="Must be a valid email format"
                    isValid={emailCheck.valid}
                  />
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              
              {/* --- ADDED: Wrapper for icon --- */}
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} // <-- UPDATED
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {/* --- ADDED: Toggle Button --- */}
                <Button
                  type="button" // Important: Prevents form submission
                  variant="ghost" // Use "ghost" for a shadcn-style icon-only button
                  size="icon"
                  className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                {/* --- END ADDED --- */}
              </div>
              {/* --- END ADDED --- */}
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, remember: checked }))
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-muted-foreground cursor-pointer"
                >
                  Remember me
                </Label>
              </div>

              <Link
                href="/forgotPassword"
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-11 text-base">
              Log in
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              Or continue with
            </span>
          </div>

          {/* SOCIAL LOGIN (GOOGLE / GITHUB) */}
          <Social />

          {/* REGISTER LINK */}
          <div className="text-center text-muted-foreground text-sm mt-8">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}