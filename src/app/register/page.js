"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import { Check, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- REDIRECT ---
// 1. Import the useRouter hook
import { useRouter } from "next/navigation";
// --- END REDIRECT ---

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// custom components
import LeftPanel from "@/components/LeftPanel";
import Social from "@/components/Social";

// Your email validation function
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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [termsError, setTermsError] = useState(false);

  // --- REDIRECT ---
  // 2. Initialize the router
  const router = useRouter();
  // --- END REDIRECT ---

  // Memoized validation for email
  const emailIsValid = useMemo(() => {
    return validateEmail(formData.email);
  }, [formData.email]);

  // Memoized validation for username length
  const usernameIsValid = useMemo(() => {
    return formData.username.length >= 6;
  }, [formData.username]);

  // Memoized validation for password rules
  const passwordValidation = useMemo(() => {
    const password = formData.password;
    return {
      length: password.length >= 8,
      digit: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [formData.password]);

  // Memoized validation for password match
  const passwordsMatch = useMemo(() => {
    if (formData.password.length === 0 || formData.confirmPassword.length === 0) {
      return false;
    }
    return formData.password === formData.confirmPassword;
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTermsError(false);
    const allRulesValid = Object.values(passwordValidation).every(Boolean);

    // Frontend validation check
    if (
      !allRulesValid ||
      !passwordsMatch ||
      !emailIsValid ||
      !usernameIsValid ||
      !formData.agree
    ) {
      toast.error("Please correct the errors in the form.");
      console.error("Please ensure all fields are valid and terms are accepted.");
      if (!formData.agree) {
        setTermsError(true);
      }
      return; // Stop the submission
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          email: formData.email,
          username: formData.username,
          name: formData.name,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          acceptTerms: formData.agree,
        }
      );
      
      console.log("Registration successful:", response.data);

      // --- REDIRECT ---
      // 3. Show toast and redirect after a short delay
      toast.success("Account created! Redirecting to login...");
      setTimeout(() => {
        router.push('/login');
      }, 2000); // 2-second delay to let user see the toast
      // --- END REDIRECT ---

    } catch (error) {
      console.error("Registration error:", error);
      
      // This code is ALREADY correct. It will show your backend's
      // specific error message (e.g., "User already exists") if you send it.
      const message = error.response?.data?.error || "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 font-inter px-4 sm:px-6 py-6">
      
      <ToastContainer
        position="top-center"     // <-- MOVED to top-center
        autoClose={5000}           // <-- INCREASED time to 5 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="w-full max-w-5xl bg-background shadow-lg rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-border">
        {/* LEFT PANEL */}
        <LeftPanel />

        {/* RIGHT PANEL */}
        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-semibold mb-2 text-foreground text-center md:text-left">
              Create your account
            </h2>
            <p className="text-muted-foreground mb-8 text-sm text-center md:text-left">
              Join Manaska to start mapping your ideas
            </p>
          </div>

          {/* REGISTER FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Dhruv patel;"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="e.g., Dhruv99"
                value={formData.username}
                onChange={handleChange}
                required
              />
              
              {/* Username Validation Rule */}
              {formData.username.length > 0 && (
                <div className="mt-2 pl-1">
                  <PasswordRuleCheck
                    text="Must be at least 6 characters"
                    isValid={usernameIsValid}
                  />
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g., Dhruv@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              {/* Email Validation Rule */}
              {formData.email.length > 0 && (
                <div className="mt-2 pl-1">
                  <PasswordRuleCheck
                    text="Must be a valid email address"
                    isValid={emailIsValid}
                  />
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              
              {/* Password Validation Rules */}
              {formData.password.length > 0 && (
                <div className="space-y-1 mt-2 pl-1">
                  <PasswordRuleCheck
                    text="At least 8 characters"
                    isValid={passwordValidation.length}
                  />
                  <PasswordRuleCheck
                    text="At least one digit (0-9)"
                    isValid={passwordValidation.digit}
                  />
                  <PasswordRuleCheck
                    text="At least one special character (!@#...)"
                    isValid={passwordValidation.special}
                  />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              {/* Password Match Check */}
              {formData.confirmPassword.length > 0 && (
                <div className="mt-2 pl-1">
                  <PasswordRuleCheck
                    text="Passwords match"
                    isValid={passwordsMatch}
                  />
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agree"
                  name="agree"
                  checked={formData.agree}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({ ...prev, agree: checked }));
                    if (checked) {
                      setTermsError(false);
                    }
                  }}
                />
                <Label
                  htmlFor="agree"
                  className="text-muted-foreground text-xs sm:text-sm leading-snug"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-foreground font-medium hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-foreground font-medium hover:underline"
                  >
                    Privacy Policy
                  </a>
                </Label>
              </div>
              
              {/* Terms Error Message */}
              {termsError && (
                <p className="text-sm text-destructive pl-7">
                  You must agree to the terms to create an account.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-11 text-base pt-2">
              Create account
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              Or sign up with
            </span>
          </div>

          {/* Social Login Buttons */}
          <Social />

          {/* Login Redirect */}
          <div className="text-center text-muted-foreground text-sm mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}