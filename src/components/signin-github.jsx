"use client"

import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"
 
export default function SignInGitHub() {
  return <button onClick={() => signIn("github")} className="text-black w-full flex items-center justify-center h-11 sm:h-12 border border-gray-300 rounded-lg hover:bg-gray-100 text-xs sm:text-sm font-medium transition">
    <FaGithub size={18} className="mr-2" />
    Continue with GitHub
  </button>
}
