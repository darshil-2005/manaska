"use client";


import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Check, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import LeftPanel from "@/components/LeftPanel";
import Social from "@/components/Social";
import { useTheme } from "next-themes";


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
    useEffect(() => {
    document.title = "Login";
  }, []);

  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: "", // This field holds either email or username
    password: "",
    remember: false,
  });


  const [showPassword, setShowPassword] = useState(false);


  // --- LOADING STATES ---
  // State for standard form login
  const [isLoading, setIsLoading] = useState(false);
  // States for specific social provider logins
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const router = useRouter();

  // Smart validation for the "Email or username" field
  const emailCheck = useMemo(() => {
    const input = formData.email;
    if (!input.includes("@")) {
      return { active: false, valid: false };
    }
    return { active: true, valid: validateEmail(input) };
  }, [formData.email]);

  const isAnyLoading = isLoading || isGoogleLoading || isGithubLoading;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!formData.email || !formData.password) {
      toast.error("Please enter both email/username and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
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

      setIsLoading(false);
    }
  };


  const handleSocialLogin = (provider) => {
    if (provider === 'google') {
      setIsGoogleLoading(true);
      setIsGithubLoading(false);
    } else if (provider === 'github') {
      setIsGithubLoading(true);
      setIsGoogleLoading(false);
    }
    console.log(`Starting login with ${provider}...`);
  };


  return (
    
    <div className="min-h-screen flex items-center justify-center bg-muted/20 font-inter px-4 sm:px-6">
      <ToastContainer
        position="top-center"
        autoClose={8000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        theme={theme}
      />

      <div className="w-full max-w-5xl bg-background shadow-lg rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-border">
        <LeftPanel />

        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <div>
            <h2 className="text-3xl font-semibold mb-2 text-foreground text-center md:text-left">
              Welcome back
            </h2>
            <p className="text-muted-foreground mb-8 text-sm text-center md:text-left">
              Log in to continue to ManaskaAI
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email or username</Label>
              <Input
                id="email"
                name="email"
                placeholder="Enter your email or username"
                value={formData.email}
                onChange={handleChange}
                disabled={isAnyLoading} // Disable input fields while any login is pending
              />

              {emailCheck.active && !emailCheck.valid && (
                <PasswordRuleCheck
                  text="Must be a valid email format"
                  isValid={emailCheck.valid}
                />
              )}

            </div>


            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}

                  disabled={isAnyLoading} // Disable input fields while any login is pending
                />
                <Button
                  id="toggle-password-visibility"
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={togglePasswordVisibility}
                  disabled={isAnyLoading} // Disable toggle while any login is pending
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>


            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, remember: checked }))
                  }
                  disabled={isAnyLoading} // Disable checkbox while any login is pending
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


            <Button
              id="login-submit-button"
              type="submit"
              className="w-full h-11 text-base"
              disabled={isAnyLoading} // Disable if any login method is active
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>


          <div className="my-6 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              Or continue with
            </span>
          </div>


          <Social
            onSocialClick={handleSocialLogin}
            isGoogleLoading={isGoogleLoading}
            isGithubLoading={isGithubLoading}
            isAnyLoading={isAnyLoading} // Pass to disable the buttons
          />

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
