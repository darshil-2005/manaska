import SignInGoogle from "@/components/signin-google";
import SignInGitHub from "@/components/signin-github";


export default function Social({
    onSocialClick,
    isGoogleLoading,
    isGithubLoading,
    isAnyLoading 
}) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <SignInGoogle
        onSocialClick={onSocialClick}
        isGoogleLoading={isGoogleLoading}
        isAnyLoading={isAnyLoading} //  for disabling logic
      />
      <SignInGitHub
        onSocialClick={onSocialClick}
        isGithubLoading={isGithubLoading}
        isAnyLoading={isAnyLoading} // for disabling logic
      />
    </div>
  );
}

