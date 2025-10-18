
"use client"

import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
 
export default function SignInGoogle() {
  return (
    <button 
      onClick={() => signIn("google")}
      className="text-black w-full flex items-center justify-center h-11 sm:h-12 border border-gray-300 rounded-lg hover:bg-gray-100 text-xs sm:text-sm font-medium transition"
    >
      <FcGoogle size={18} className="mr-2" />
      Continue with Google
    </button>
  )
}
