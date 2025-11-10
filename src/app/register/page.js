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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
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
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        email: formData.email,
        username: formData.username,
        name: formData.name,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.agree,
      });
      console.log("Registration successful:", response.data);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 font-inter px-4 sm:px-6 py-6">
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
                placeholder="Enter your full name"
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
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
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
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2 mt-2">
              <Checkbox
                id="agree"
                name="agree"
                checked={formData.agree}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, agree: checked }))
                }
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

            {/* Submit Button */}
            <Button type="submit" className="w-full h-11 text-base mt-2">
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
