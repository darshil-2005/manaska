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
            
            <h2 className="text-xl sm:text-2xl font-semibold mt-8">11. User Responsibilities</h2>
            <p>
            By accessing and using this platform, you agree to follow all applicable laws and
            refrain from engaging in any activities that may harm, disrupt, or misuse the service.
            </p>

            <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>You are responsible for maintaining the confidentiality of your account.</li>
                <li>You must ensure the accuracy of all information provided during registration.</li>
                <li>You agree not to use the service for fraudulent, harmful, or illegal purposes.</li>
                <li>You will not attempt to reverse-engineer, bypass security, or disrupt platform services.</li>
                <li>You must not upload malicious software, viruses, or scripts of any kind.</li>
            </ul>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">12. Prohibited Activities</h2>
            <p>
            Users are strictly prohibited from engaging in the following activities:
            </p>

            <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Uploading content that infringes on intellectual property or violates privacy.</li>
                <li>Conducting unauthorized scraping, data extraction, or automated crawling.</li>
                <li>Harassing other users or engaging in abusive behavior.</li>
                <li>Attempting to exploit or misuse platform vulnerabilities.</li>
                <li>Attempting to access restricted backend systems or APIs without permission.</li>
                <li>Using the platform for extremist, harmful, or hateful content.</li>
            </ul>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">13. Intellectual Property Rights</h2>
            <p>
            All platform content—including design, algorithms, code, branding, UI elements,
            and documentation—is owned by the platform operator unless stated otherwise.
            </p>

            <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>You may not copy, modify, distribute, or reverse-engineer platform assets.</li>
                <li>
                    You retain ownership of all mindmaps and content you create, except when legally required or explicitly permitted by you.
                </li>
                <li>
                    You grant us a limited license to store, render, and process your content solely for platform functionality.
                </li>
            </ul>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">14. User-Generated Content Policy</h2>
            <p>
            You are solely responsible for the content you create using the platform.
            You agree that your content will not:
            </p>

            <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Violate copyright, trademarks, or proprietary rights.</li>
                <li>Contain unlawful, abusive, defamatory, or offensive material.</li>
                <li>Promote harmful or malicious acts.</li>
                <li>Contain personal data of others without explicit permission.</li>
            </ul>

            <p className="mt-2">
            We reserve the right (but are not obligated) to remove content that violates these terms.
            </p>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">15. Service Availability & Downtime</h2>
            <p>
            While we strive to provide continuous access to the platform, we do not guarantee
            uninterrupted service. Planned maintenance, updates, and unavoidable outages may occur.
            </p>

            <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>We may temporarily suspend services for updates, fixes, or maintenance.</li>
                <li>We are not responsible for losses caused by downtime or service interruptions.</li>
                <li>We reserve the right to modify features or restrict access at our discretion.</li>
            </ul>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">16. Termination of Accounts</h2>
            <p>
            We may suspend or terminate accounts under specific conditions, including:
            </p>

            <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Violation of these Terms & Conditions</li>
                <li>Illegal or harmful activities</li>
                <li>Multiple failed payment attempts (if applicable)</li>
                <li>Abuse of platform features, API rates, or automation tools</li>
            </ul>

            <p className="mt-2">
            Users may also request account deletion at any time.
            Deleted accounts cannot be recovered.
            </p>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">17. Disclaimers</h2>
            <p>
            The platform and all its features are provided on an <strong>"as is" and "as available"</strong> basis.
            We make no warranties regarding:
            </p>

            <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Accuracy or reliability of platform outputs or AI-generated suggestions</li>
                <li>Bug-free, error-free, or uninterrupted operation</li>
                <li>Compatibility with all devices, browsers, or configurations</li>
                <li>Completeness or correctness of documentation or tutorials</li>
            </ul>

            <p className="mt-2">
            You use the platform at your own discretion and risk.
            </p>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">18. Limitation of Liability</h2>
            <p>
            To the fullest extent permitted by law, we are not liable for:
            </p>

            <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Loss of data or content</li>
                <li>Loss of revenue, profits, or business opportunities</li>
                <li>Damage arising from unauthorized access to your account</li>
                <li>Indirect, incidental, or consequential damages</li>
                <li>Performance issues caused by third-party service providers</li>
            </ul>

            <p className="mt-2">
            Our maximum liability, under any circumstance, will not exceed the amount paid by
            the user (if any) in the last 12 months.
            </p>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">19. Governing Law</h2>
            <p>
            These Terms & Conditions are governed by the laws of your jurisdiction unless otherwise required by local legislation.
            </p>

            <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Disputes will be handled through arbitration or competent courts.</li>
                <li>Users agree to comply with all applicable national and international laws.</li>
            </ul>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">20. Changes to These Terms</h2>
            <p>
            We may update or modify these Terms & Conditions at any time.
            Changes will take effect once published on this page.
            </p>

            <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>You will be notified of major changes via email or in-app notifications.</li>
                <li>Continued use after updates implies acceptance of revised terms.</li>
            </ul>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">21. Contact Information</h2>
            <p>
            For questions regarding these Terms & Conditions, please contact our support team.
            </p>
            <p>Email: <strong>support@yourdomain.com</strong></p>
            <p className="mt-2">We typically respond within 48 hours.</p>

          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
