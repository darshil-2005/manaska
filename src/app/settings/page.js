"use client"; // Required for helper component
import ProfileSettings from '@/components/ProfileSettings';
import AccountSecuritySettings from '@/components/AccountSecuritySettings';
import AppearanceSettings from '@/components/AppearanceSettings';
import APIKeysSettings from '@/components/APIKeysSettings';
import { User, KeyRound, Palette, ShieldCheck, Bot } from 'lucide-react';

// === HELPER COMPONENT (Simple) ===
function SettingsNavLink({ href, icon: Icon, children }) {
  return (
    <li>
      <a
        href={href}
        // Simple styles, no 'active' state
        className={`flex items-center p-2 rounded-md transition-colors group text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`}
      >
        <Icon 
          className={`w-5 h-5 mr-3 transition-colors text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white`} 
        />
        <span className="font-medium">{children}</span>
      </a>
    </li>
  );
}

// === MAIN PAGE COMPONENT (Simple) ===
export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      
      <aside className="w-64 border-r bg-white dark:bg-gray-900 dark:border-gray-800 p-4 sticky top-0 h-screen hidden md:block">
        
        <div className="flex items-center space-x-2.5 mb-6 px-2">
          <Bot className="h-6 w-6 text-gray-800 dark:text-gray-200" />
          <h2 className="text-xl font-semibold">ManaskaAI</h2>
        </div>

        <nav>
          <ul className="space-y-1">
            <li className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</li>
            <SettingsNavLink href="#profile" icon={User}>Profile</SettingsNavLink>
            <SettingsNavLink href="#account-security" icon={ShieldCheck}>Account & Security</SettingsNavLink>
            <SettingsNavLink href="#appearance" icon={Palette}>Appearance</SettingsNavLink>
            <SettingsNavLink href="#api-keys" icon={KeyRound}>API Keys</SettingsNavLink>
          </ul>
        </nav>
      </aside>

      {/* === MAIN CONTENT (Simple) === */}
      <main 
        className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto relative"
      >
        <ProfileSettings />
        <AccountSecuritySettings />
        <AppearanceSettings />
        <APIKeysSettings />
      </main>
    </div>
  );
}