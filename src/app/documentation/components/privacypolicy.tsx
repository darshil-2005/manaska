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

          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
