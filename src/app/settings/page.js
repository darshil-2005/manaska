"use client";


import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProfileSettings from '@/components/ProfileSettings';
import AccountSecuritySettings from '@/components/AccountSecuritySettings';
import AppearanceSettings from '@/components/AppearanceSettings';
import APIKeysSettings from '@/components/APIKeysSettings';
import { User, KeyRound, Palette, ShieldCheck, Brain, LogOut } from 'lucide-react';
import LogoutSettings from '@/components/LogoutSettings';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// === HELPER COMPONENT ===
function SettingsNavLink({ href, icon: Icon, children, isActive }) {
  return (
    <li>
      <a
        href={href}
        className={`flex items-center p-2 rounded-md transition-colors group font-medium
          ${isActive
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' // Active style
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' // Default style
          }
        `}
      >
        <Icon
          className={`w-5 h-5 mr-3 transition-colors
            ${isActive
              ? 'text-gray-800 dark:text-white' // Active icon style
              : 'text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white' // Default icon style
            }
          `}
        />
        <span>{children}</span>
      </a>
    </li>
  );
}


// === MAIN PAGE COMPONENT ===
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const mainRef = useRef(null);


  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;


    const sections = mainEl.querySelectorAll('section[id]');
    if (sections.length === 0) return;


    const options = {
      root: mainEl,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0
    };


    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);


    sections.forEach(section => {
      observer.observe(section);
    });


    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);




  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">


      <aside className="w-64 border-r bg-white dark:bg-gray-900 dark:border-gray-800 p-4 sticky top-0 h-screen hidden md:block">


        {/* ---  Wrap Logo/Title in Link component --- */}
        <Link
          href="/dashboard"
          className="flex items-center space-x-2.5 mb-6 px-2 group" // Added group
        >
          {/* --- logo */}
          <Brain className="h-6 w-6 text-gray-800 dark:text-gray-200 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
          <h2 className="text-xl font-semibold transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            ManaskaAI
          </h2>
        </Link>
       
        <nav>
          <ul className="space-y-1">
            <li className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</li>
            <SettingsNavLink href="#profile" icon={User} isActive={activeSection === 'profile'}>Profile</SettingsNavLink>
            <SettingsNavLink href="#account-security" icon={ShieldCheck} isActive={activeSection === 'account-security'}>Account & Security</SettingsNavLink>
            <SettingsNavLink href="#appearance" icon={Palette} isActive={activeSection === 'appearance'}>Appearance</SettingsNavLink>
           
            <SettingsNavLink href="#api-keys" icon={KeyRound} isActive={activeSection === 'api-keys'}>API Keys</SettingsNavLink>
          </ul>
          <ul className="space-y-1 mt-4 border-t pt-4 dark:border-gray-700">
            <SettingsNavLink href="#log-out" icon={LogOut} isActive={activeSection === 'log-out'}>Log out</SettingsNavLink>
          </ul>
        </nav>
      </aside>


      <main
        ref={mainRef}
        className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto relative h-screen"
      >
        <ProfileSettings />
        <AccountSecuritySettings />
        <AppearanceSettings />
        <APIKeysSettings />
        <LogoutSettings />
      </main>


      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
