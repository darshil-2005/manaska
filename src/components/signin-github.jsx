"use client"
import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"
import { Loader2 } from "lucide-react"
import { Button } from "../components/ui/button.tsx"


export default function SignInGitHub({ onSocialClick, isGithubLoading, isAnyLoading }) {
 
  const handleGitHubClick = () => {
    onSocialClick('github');
    signIn("github");
  };


  return (
    <Button
      onClick={handleGitHubClick}
      className="w-full"
      disabled={isAnyLoading}
    >
      {/* isGithubLoading for the spinner/text */}
      {isGithubLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting...
        </>
      ) : (
        <>
          <FaGithub size={18} className="mr-2" />
          Continue with GitHub
        </>
      )}
    </Button>
  )
}
