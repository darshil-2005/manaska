"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

// 🧩 shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// 🧱 custom components
import LeftPanel from "@/components/LeftPanel";
import Social from "@/components/Social";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log("Login successful:", response.data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 font-inter px-4 sm:px-6">
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
            {/* Email */}
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
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
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
