"use client";
import React from "react";
import SignInGoogle from "./signin-google";
import SignInGitHub from "./signin-github";

export default function AuthSocial() {
  return (
    <>
      <div className="my-5 sm:my-6 flex items-center justify-center">
        <span className="text-gray-400 text-xs sm:text-sm">
          Or continue with
        </span>
      </div>
      <div className="space-y-2 sm:space-y-3">
        <SignInGoogle />
        <SignInGitHub />
      </div>
    </>
  );
}
