import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PrivacyPolicy() {
  return (
    <div className="w-full h-full p-4 sm:p-6">
      <ScrollArea className="h-full w-full">
        <Card className="border bg-background text-foreground max-w-full">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Privacy Policy
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 px-4 sm:px-6 text-base leading-relaxed max-w-full">

            {/* Introduction */}
            <p className="text-muted-foreground">
              This Privacy Policy explains how we collect, use, store, and protect your information 
              when you use our mind-map generation platform. By accessing or using our services, 
              you agree to the terms outlined below.
            </p>

            <Separator />

            {/* Information We Collect */}
            <h2 className="text-xl sm:text-2xl font-semibold">1. Information We Collect</h2>
            <p>
              We collect information to provide, improve, and secure our services. The information may 
              include the following:
            </p>

            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Account Information:</strong> Name, email address, password (encrypted), and other
                details you provide during registration.
              </li>
              <li>
                <strong>Mindmap Content:</strong> Any ideas, text, nodes, or diagrams you generate using our
                platform.
              </li>
              <li>
                <strong>Device & Usage Data:</strong> IP address, browser type, pages visited, session duration,
                and interaction logs.
              </li>
              <li>
                <strong>Cookies & Tracking:</strong> We use cookies to maintain login sessions and improve UX.
              </li>
            </ul>

            <Separator />

            {/* How Information Is Used */}
            <h2 className="text-xl sm:text-2xl font-semibold">2. How We Use Your Information</h2>
            <p>Your information is used for the following purposes:</p>

            <ul className="list-disc ml-6 space-y-2">
              <li>To authenticate and manage user accounts.</li>
              <li>To generate, store, and display mindmaps created by you.</li>
              <li>To improve platform performance, accuracy, and reliability.</li>
              <li>To provide personalized AI-generated suggestions and templates.</li>
              <li>To ensure system security, prevent misuse, and detect anomalies.</li>
              <li>To communicate important updates, alerts, or service announcements.</li>
            </ul>

            <Separator />

            {/* Third Parties */}
            <h2 className="text-xl sm:text-2xl font-semibold">3. Sharing & Disclosure of Information</h2>

            <p className="text-muted-foreground">
              We do <strong>not</strong> sell, rent, or trade your personal data. Information may be shared 
              only in the following cases:
            </p>

            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Service Providers:</strong> Trusted third-party platforms that help us run backend 
                services (e.g., hosting, database, AI processing).
              </li>
              <li>
                <strong>Legal Requirements:</strong> If required by law, regulation, court order, or government 
                authority.
              </li>
              <li>
                <strong>Security Protection:</strong> To investigate violations, fraud, or threats to any 
                user's safety.
              </li>
            </ul>

            <Separator />

            {/* Data Security */}
            <h2 className="text-xl sm:text-2xl font-semibold">4. Data Security & Storage</h2>
            <p>
              We take data security seriously. Your information is protected using:
            </p>

            <ul className="list-disc ml-6 space-y-2">
              <li>Data encryption during transfer (HTTPS / SSL)</li>
              <li>Encrypted password storage (bcrypt or equivalent)</li>
              <li>Secure cloud storage and routine security checks</li>
              <li>Strict access control for internal systems</li>
            </ul>

            <p className="text-muted-foreground">
              Despite best efforts, no online platform can guarantee 100% security, but we continuously 
              update our systems to minimize risks.
            </p>

            <Separator />

            {/* User Rights */}
            <h2 className="text-xl sm:text-2xl font-semibold">5. Your Rights</h2>
            <p>Depending on applicable laws, you may request the following:</p>

            <ul className="list-disc ml-6 space-y-2">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or outdated details</li>
              <li>Deletion of your account and stored data</li>
              <li>Download/export of your created mindmaps</li>
              <li>Disable or manage cookies</li>
            </ul>

            <Separator />

            {/* Children’s Privacy */}
            <h2 className="text-xl sm:text-2xl font-semibold">6. Children’s Privacy</h2>
            <p>
              Our platform is not intended for children under the age of 13. We do not knowingly collect 
              data from children. If we discover such information, it will be deleted immediately.
            </p>

            <Separator />

            {/* Changes to Policy */}
            <h2 className="text-xl sm:text-2xl font-semibold">7. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be reflected on this page 
              with an updated <strong>“Last Updated”</strong> date. Continued use of the platform implies 
              acceptance of the revised policy.
            </p>

            <Separator />

            {/* Contact */}
            <h2 className="text-xl sm:text-2xl font-semibold">8. Contact Us</h2>
            <p>
              For privacy-related concerns, data requests, or account deletion, contact us at:
            </p>

            <p className="font-medium">support@mindmap-ai.com</p>

            <Separator />

            <h2 className="text-xl sm:text-2xl font-semibold">9. Data Retention Policy</h2>
            <p>We retain personal and usage data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy. Retention timelines include:</p>
            <ul className="list-disc ml-6 space-y-2">
                <li>Account Data: Retained as long as your account remains active. Deleted automatically 30 days after account deletion.</li>
                <li>Mindmap Content: Stored until you manually delete it or your account is removed.</li>
                <li>Log & Diagnostic Data: Retained for 6–12 months to monitor performance, fix bugs, and comply with legal/regulatory requirements.</li>
                <li>Cookies: Retention varies by cookie type (session cookies expire automatically; preference cookies persist longer).</li>
            </ul>
            <p>If you request account deletion, all associated files, diagrams, chat messages, and mindmap content will be permanently removed from our servers unless legally required otherwise.</p>

            <h2 className="text-xl sm:text-2xl font-semibold">10. International Data Transfers</h2>
            <p>Depending on your location, personal data may be processed on servers located in:</p>
            <ul className="list-disc ml-6 space-y-2">
                <li>United States</li>
                <li>European Union</li>
                <li>Asia-Pacific Regions</li>
            </ul>
            <p>Where required, we implement:</p>
            <ul className="list-disc ml-6 space-y-2">
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Data Processing Addendums (DPAs)</li>
                <li>Secure transfer protocols (TLS/SSL)</li>
                <li>GDPR-compliant safeguards</li>
            </ul>
            <p>We ensure that all international data transfers are done securely and lawfully.</p>

            <h2 className="text-xl sm:text-2xl font-semibold">11. Cookies & Tracking Technologies</h2>
            <p>
            Our platform uses cookies and tracking technologies to optimize functionality. These include:
            </p>

            <h3 className="text-lg font-medium mt-4">Types of Cookies Used</h3>

            <h4 className="font-semibold mt-2">Essential Cookies</h4>
            <ul className="list-disc ml-6 space-y-1">
            <li>Required for login, authentication, and core site functionality.</li>
            <li>You cannot disable essential cookies.</li>
            </ul>

            <h4 className="font-semibold mt-2">Preference Cookies</h4>
            <ul className="list-disc ml-6 space-y-1">
            <li>Store theme preferences (light/dark mode)</li>
            <li>Remember sidebar layout, editor settings, and UI preferences.</li>
            </ul>

            <h4 className="font-semibold mt-2">Analytics Cookies</h4>
            <ul className="list-disc ml-6 space-y-1">
            <li>Help us understand how users interact with the app.</li>
            <li>Includes session duration, clicked tools, layout usage, export frequency, etc.</li>
            </ul>

            <h4 className="font-semibold mt-2">Performance & Diagnostic Cookies</h4>
            <ul className="list-disc ml-6 space-y-1">
            <li>Monitor service uptime, loading speeds, and error rates.</li>
            <li>Used to identify bugs and improve stability.</li>
            </ul>

            <h4 className="font-semibold mt-2">Optional Cookies</h4>
            <ul className="list-disc ml-6 space-y-1">
            <li>May store AI suggestion preferences</li>
            <li>Chat/assistant interaction logs (if enabled)</li>
            </ul>

            <p className="mt-2">
            You can control non-essential cookies in your browser settings.
            </p>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">12. How AI Handles Your Data</h2>
            <p>
            Our AI features may process parts of your input solely for generating recommendations,
            mindmap expansions, summaries, or related enhancements.
            </p>

            <h3 className="font-semibold mt-4">AI Processing Rules</h3>
            <ul className="list-disc ml-6 space-y-1">
            <li>Your data is not used to train AI models unless explicitly allowed.</li>
            <li>Your content is not shared, published, or used outside your account.</li>
            <li>
                All processing is ephemeral and exists only for the duration of your session unless saved in your mindmap.
            </li>
            <li>
                We maintain strict isolation between user datasets and ensure that AI responses respect
                privacy and confidentiality.
            </li>
            </ul>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">13. Third-Party Integrations</h2>
            <p>Our system may integrate with trusted third-party services:</p>

            <h3 className="font-semibold mt-4">Examples of External Services:</h3>
            <ul className="list-disc ml-6 space-y-1">
            <li>Cloud storage providers (AWS, Vercel, Supabase, Firebase, etc.)</li>
            <li>CDN & edge networks</li>
            <li>AI model providers</li>
            <li>Payment processors (if applicable)</li>
            </ul>

            <p className="mt-2">These providers are contractually obligated to:</p>
            <ul className="list-disc ml-6 space-y-1">
            <li>Follow industry-standard security practices</li>
            <li>Only process data we explicitly allow</li>
            <li>Never use your content for unrelated purposes</li>
            </ul>

            <p className="mt-2">
            We do not grant third parties unrestricted access to your mindmaps or stored content.
            </p>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">14. Data Breach Protocol</h2>
            <p>We take all breaches seriously. In the unlikely event of unauthorized access:</p>

            <h3 className="font-semibold mt-4">Our Response Steps</h3>
            <ul className="list-disc ml-6 space-y-1">
                <li>Immediate containment and system isolation</li>
                <li>Investigation of root cause</li>
                <li>Revocation of compromised tokens or credentials</li>
                <li>User notification within 72 hours (or earlier when legally mandated)</li>
                <li>Restoration of secure system state</li>
                <li>Preventive system patching and audits</li>
            </ul>

            <p className="mt-2">
            You will be notified if your data is involved in any breach affecting confidentiality.
            </p>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">15. Logging & Monitoring</h2>
            <p>
            To ensure service integrity, we maintain controlled logs that may include:
            </p>

            <ul className="list-disc ml-6 space-y-1">
                <li>Authentication attempts</li>
                <li>Editor actions (non-content-based)</li>
                <li>Export requests</li>
                <li>API errors</li>
                <li>Device metadata</li>
                <li>Session timestamps</li>
            </ul>

            <p className="mt-2">Logs are strictly access-controlled and used only for:</p>
            <ul className="list-disc ml-6 space-y-1">
                <li>Debugging</li>
                <li>Fraud detection</li>
                <li>System optimization</li>
                <li>Security monitoring</li>
            </ul>

            <p className="mt-2">
            We do not log your actual mindmap content unless required to process your user request.
            </p>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">16. Ads, Analytics & External Links</h2>
            <p>
            Our platform currently does not display advertisements, but we may use analytics tools such as:
            </p>
            <ul className="list-disc ml-6 space-y-1">
                <li>Google Analytics</li>
                <li>Vercel Analytics</li>
                <li>Proprietary usage analytics</li>
            </ul>

            <h3 className="font-semibold mt-4">External Links</h3>
            <p>
            Our documentation or platform may contain links to external websites.
            We do not control and are not responsible for their privacy practices.
            </p>
            <p>We encourage you to review their policies independently.</p>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">17. User-Generated Content</h2>
            <p>
            By using our platform, you retain full ownership of all content you create.
            However, you grant us a limited license to:
            </p>

            <ul className="list-disc ml-6 space-y-1">
                <li>Process the content to generate diagrams</li>
                <li>Store it securely in your account</li>
                <li>Render/export/modify it according to your actions</li>
            </ul>

            <p className="mt-2">
            This license is revoked immediately upon content deletion or account closure.
            </p>
            <p>We never reuse or publicly display user content without explicit permission.</p>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">18. Definitions</h2>
            <ul className="list-disc ml-6 space-y-1">
                <li><strong>Personal Data</strong> – Any information that identifies a user directly or indirectly.</li>
                <li><strong>Mindmap Content</strong> – Any diagram, node, connection, text, or asset created within the platform.</li>
                <li><strong>Processing</strong> – Any operation performed on data (collection, storage, analysis, deletion).</li>
                <li><strong>Service Providers</strong> – Third-party companies that support platform operations.</li>
                <li><strong>AI Processing</strong> – Automated operations that generate suggestions, outputs, or mindmap elements.</li>
            </ul>

            <hr className="my-6" />

            <h2 className="text-xl sm:text-2xl font-semibold">19. Enforcement & Legal Compliance</h2>
            <p>We comply with:</p>
            <ul className="list-disc ml-6 space-y-1">
            <li>GDPR (EU General Data Protection Regulation)</li>
            <li>CCPA (California Consumer Privacy Act)</li>
            <li>CPRA (California Privacy Rights Act)</li>
            <li>Indian DPDP Act (2023)</li>
            <li>Applicable global data protection laws</li>
            </ul>

            <p className="mt-2">
            We provide mechanisms for data access, correction, deletion, and portability.
            </p>

            <hr className="my-6" />


          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
