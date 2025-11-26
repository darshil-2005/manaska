import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsAndConditions() {
  return (
    <div className="w-full h-full p-4 sm:p-6">
      <ScrollArea className="h-full w-full">
        <Card className="border bg-background text-foreground max-w-full">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Terms and Conditions
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 px-4 sm:px-6 text-base leading-relaxed max-w-full">
            
            {/* Intro */}
            <p className="text-muted-foreground">
              These Terms & Conditions govern your access to and use of our platform,
              tools, documentation, mind-map editor, AI features, and all associated services.
              By accessing or using our platform, you agree to be bound by these terms.
              If you do not agree, you must stop using the service immediately.
            </p>

            <Separator />

            {/* Eligibility */}
            <h2 className="text-xl sm:text-2xl font-semibold">1. Eligibility</h2>
            <p>
              You must be at least 13 years old to use this platform.
              In some jurisdictions, additional age restrictions may apply.
              By using the service, you confirm that you meet the legal requirements.
            </p>

            <Separator />

            {/* Account */}
            <h2 className="text-xl sm:text-2xl font-semibold">2. User Accounts</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Maintaining the confidentiality of your login credentials.</li>
              <li>Ensuring all information you provide is accurate and up to date.</li>
              <li>All activity that occurs under your account.</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate our policies,
              engage in misuse, or pose a security risk.
            </p>

            <Separator />

            {/* User Content */}
            <h2 className="text-xl sm:text-2xl font-semibold">3. User-Generated Content</h2>
            <p>
              You retain ownership of all mind maps, nodes, diagrams, scripts, and
              content you create on the platform.
            </p>
            <p>
              By using the service, you grant us a limited, non-exclusive license to:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Process your content for rendering and exporting.</li>
              <li>Store it securely in your account.</li>
              <li>Provide AI enhancements or transformations when requested.</li>
            </ul>
            <p>
              We never sell, publish, or reuse your content without explicit permission.
            </p>

            <Separator />

            {/* Acceptable Use */}
            <h2 className="text-xl sm:text-2xl font-semibold">4. Acceptable Use Policy</h2>
            <p>You agree NOT to use the service for:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Illegal activity or promoting harmful behavior.</li>
              <li>Uploading malicious code or disrupting platform operations.</li>
              <li>Attempting unauthorized access to systems or accounts.</li>
              <li>Data harvesting, scraping, or automated extraction.</li>
              <li>Impersonation or misleading activities.</li>
            </ul>

            <Separator />

            {/* AI Tools */}
            <h2 className="text-xl sm:text-2xl font-semibold">5. AI Tools & Automation</h2>
            <p>
              Our AI-powered features (chat assistance, node generation, suggestions, etc.)
              operate on your prompts and mind-map content.
            </p>
            <p>You agree that:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>AI outputs may contain errors and should be verified.</li>
              <li>We are not liable for decisions made based on AI-generated output.</li>
              <li>Your input may be temporarily processed to generate the output.</li>
            </ul>

            <Separator />

            {/* Prohibited Content */}
            <h2 className="text-xl sm:text-2xl font-semibold">6. Prohibited Content</h2>
            <p>The following content is strictly prohibited:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Violent, hateful, or abusive material.</li>
              <li>Harassment, stalking, or threats.</li>
              <li>Pornographic or sexually explicit content involving minors.</li>
              <li>Content violating intellectual property rights.</li>
            </ul>

            <Separator />

            {/* Intellectual Property */}
            <h2 className="text-xl sm:text-2xl font-semibold">7. Intellectual Property</h2>
            <p>
              All platform intellectual property—including UI components, editor functionality,
              branding, APIs, documentation, and AI models—is owned by us.
            </p>
            <p>
              You may not copy, clone, reverse-engineer, resell, or redistribute
              any part of the platform.
            </p>

            <Separator />

            {/* Termination */}
            <h2 className="text-xl sm:text-2xl font-semibold">8. Termination</h2>
            <p>We may suspend or terminate your access if you:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Violate these terms.</li>
              <li>Pose security risks or misuse the service.</li>
              <li>Engage in fraud or illegal activity.</li>
            </ul>

            <Separator />

            {/* Liability */}
            <h2 className="text-xl sm:text-2xl font-semibold">9. Limitation of Liability</h2>
            <p>
              We provide this platform on an <strong>"as-is" and "as-available"</strong> basis.
            </p>
            <p>We are NOT liable for:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Data loss due to user error.</li>
              <li>Unavailability caused by maintenance or updates.</li>
              <li>Errors in AI-generated responses or exports.</li>
              <li>Damage resulting from third-party integrations.</li>
            </ul>

            <Separator />

            {/* Modifications */}
            <h2 className="text-xl sm:text-2xl font-semibold">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify or update these Terms at any time.
              Continued use of the platform after changes means you accept the updated terms.
            </p>

            <Separator />

            {/* Governing Law */}
            <h2 className="text-xl sm:text-2xl font-semibold">11. Governing Law</h2>
            <p>
              These terms are governed by applicable international laws and the local laws
              of your jurisdiction. Any disputes will be handled by appropriate courts
              in accordance with local regulations.
            </p>

            <Separator />

            {/* Contact */}
            <h2 className="text-xl sm:text-2xl font-semibold">12. Contact Information</h2>
            <p>
              If you have questions about these Terms & Conditions, you may contact us
              through our support form or help section.
            </p>

            <Separator />

            <p className="text-sm text-muted-foreground">Last Updated: January 2025</p>

          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
