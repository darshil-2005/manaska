import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import SignInGoogle from "@/components/signin-google";
import SignInGitHub from "@/components/signin-github";

export default function Social() {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
        <SignInGoogle/>
        <SignInGitHub/>
    </div>
  );
}
