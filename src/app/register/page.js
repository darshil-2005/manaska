"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import { Check, X, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import LeftPanel from "@/components/LeftPanel";
import Social from "@/components/Social"; 
import { validateEmail } from "@/utils/validators"; 
import { useTheme } from "next-themes";
import {useSession} from "next-auth/react";



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
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });


  const [termsError, setTermsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const {data} = useSession();

  const isAnyLoading = isLoading || isGoogleLoading || isGithubLoading;

  const router = useRouter();

  useEffect(() => {
     
      async function fetchUser() {
        try {
  
          const response = await axios.get("/api/auth/me");
  
          if (response.status === 200 && response.data.ok === true) {
            router.push("/dashboard");
          }
  
          
  
        } catch(error) {
          console.log("User not found.");
        }
      }
  
      async function loadUser() {
        await fetchUser();
      }
      loadUser();
  
    }, [router]);

  const emailIsValid = useMemo(() => {
    return validateEmail(formData.email);
  }, [formData.email]);

  const usernameIsValid = useMemo(() => {
    return formData.username.length >= 6;
  }, [formData.username]);

  const passwordValidation = useMemo(() => {
    const password = formData.password;
    return {
      length: password.length >= 8,
      digit: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [formData.password]);

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

  const handleSocialSignUp = (provider) => {
    if (provider === 'google') {
      setIsGoogleLoading(true);
      setIsGithubLoading(false);
    } else if (provider === 'github') {
      setIsGithubLoading(true);
      setIsGoogleLoading(false);
    }
    console.log(`Starting sign up with ${provider}...`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTermsError(false);

    const allRulesValid = Object.values(passwordValidation).every(Boolean);

    console.log("VALIDATION DEBUG:", {
      allRulesValid,
      passwordsMatch,
      emailIsValid,
      usernameIsValid,
      agree: formData.agree,
      formData
    });

    if (
      !allRulesValid ||
      !passwordsMatch ||
      !emailIsValid ||
      !usernameIsValid ||
      !formData.agree
    ) {
      toast.error("Please correct the errors in the form.");
      if (!formData.agree) setTermsError(true);
      return;
    }


    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
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
      toast.success("Account created! Redirecting to login...");

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      console.error("Registration error:", error);
      const message = error.response?.data?.error || "Registration failed. Please try again.";
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 font-inter px-4 sm:px-6 py-6">

      <ToastContainer
        position="top-center"
        autoClose={8000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />

      <div className="w-full max-w-5xl bg-background shadow-lg rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-border">
        {/* LEFT PANEL */}
        <LeftPanel />

        {/* RIGHT PANEL */}
        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <div>
            <h2 className="text-3xl font-semibold mb-2 text-foreground text-center md:text-left">
              Create your account
            </h2>
            <p className="text-muted-foreground mb-8 text-sm text-center md:text-left">
              Join ManaskaAI to start mapping your ideas
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
                placeholder="Dhruv patel"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isAnyLoading}
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Dhruv99"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isAnyLoading}
              />
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
                placeholder="dhruv@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isAnyLoading}
              />
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
                disabled={isAnyLoading}
              />

              {/* Password Checklist */}
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
                disabled={isAnyLoading}
              />
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
                  data-testid="agree-checkbox"
                  checked={formData.agree}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({ ...prev, agree: checked }));
                    if (checked) {
                      setTermsError(false);
                    }
                  }}
                  disabled={isAnyLoading}
                />
                <Label
                  htmlFor="agree"
                  className="text-muted-foreground text-xs sm:text-sm leading-snug"
                >
                  I agree to the{" "}
                  <a href="#" className="text-foreground font-medium hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-foreground font-medium hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {termsError && (
                <p className="text-sm text-destructive pl-7">
                  You must agree to the terms to create an account.
                </p>
              )}
            </div>

            <Button
              id="register-submit-button"
              type="submit"
              className="w-full h-11 text-base pt-2"
              disabled={isAnyLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? "Creating account..." : "Create account"}
            </Button>

          </form>

          <div className="my-6 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              Or sign up with
            </span>
          </div>

          <Social
            onSocialClick={handleSocialSignUp}
            isGoogleLoading={isGoogleLoading}
            isGithubLoading={isGithubLoading}
            isAnyLoading={isAnyLoading}
          />

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
