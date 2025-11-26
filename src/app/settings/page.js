"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProfileSettings from '@/components/ProfileSettings';
import AccountSecuritySettings from '@/components/AccountSecuritySettings';
import AppearanceSettings from '@/components/AppearanceSettings';
import APIKeysSettings from '@/components/APIKeysSettings';
import { User, KeyRound, Palette, ShieldCheck, Brain, LogOut, Trash2, Menu, X, MessageSquare } from 'lucide-react';
import LogoutSettings from '@/components/LogoutSettings';
import DeleteAccountSettings from '@/components/DeleteAccountSettings';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "next-themes";
import FeedbackSettings from '@/components/FeedbackSettings';


function SettingsNavLink({ href, icon: Icon, children, isActive, onClick }) {
  return (
    <li>
      <a
        href={href}
        onClick={onClick} 
        className={`flex items-center p-2 rounded-md transition-all duration-200 group font-medium
          ${isActive
            ? 'bg-gray-300 dark:bg-gray-600 text-black dark:text-white font-bold shadow-sm' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200' 
          }
        `}
      >
        <Icon
          className={`w-5 h-5 mr-3 transition-colors
            ${isActive
              ? 'text-black dark:text-white' 
              : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300' 
            }
          `}
        />
        <span>{children}</span>
      </a>
    </li>
  );
}


export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainRef = useRef(null);
  const { theme } = useTheme();
  
  const isManualScroll = useRef(false);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    isManualScroll.current = true; 
    
    setIsMobileMenuOpen(false);

    setTimeout(() => {
      isManualScroll.current = false; 
    }, 1000);
  };

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const sections = mainEl.querySelectorAll('section[id]');
    if (sections.length === 0) return;

    const options = {
      root: mainEl,
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      if (isManualScroll.current) return; 

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sections.forEach(section => {
      observer.observe(section);
    });

    const handleScroll = () => {
      if (isManualScroll.current) return;

      const { scrollTop, scrollHeight, clientHeight } = mainEl;
      if (scrollHeight - scrollTop - clientHeight < 20) {
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
           setActiveSection(lastSection.id);
        }
      }
    };

    mainEl.addEventListener('scroll', handleScroll);

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
      mainEl.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
   
    async function fetchUser() {
      try {

        const response = await axios.get("/api/auth/me");

        if (response.status != 200 || response.data.ok != true) {
          router.push("/login");
        }

        
        setUser(response.data);

      } catch(error) {
        toast.error("Error Authenticating!!");
        router.push("/login")
      }
    }

    async function loadUser() {
      await fetchUser();
    }
    loadUser();

  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">

      <header className="md:hidden flex items-center justify-between p-4 border-b dark:border-gray-800 bg-background sticky top-0 z-30">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manaska</h2>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 z-50 h-screen w-64 bg-sidebar p-4 shadow-xl md:shadow-none border-r dark:border-gray-800 bg-white dark:bg-black
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        <Link
          href="/dashboard"
          className="hidden md:flex items-center space-x-2.5 mb-6 px-2 group" 
        >
          <Brain className="h-6 w-6 text-gray-800 dark:text-gray-200 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
          <h2 className="text-xl font-semibold transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            Manaska
          </h2>
        </Link>

        <div className="flex md:hidden items-center justify-between mb-6 px-2">
           <span className="text-lg font-semibold text-gray-500">Menu</span>
           <button onClick={() => setIsMobileMenuOpen(false)}>
             <X className="w-5 h-5 text-gray-500" />
           </button>
        </div>
        
        <nav className="h-[calc(100vh-100px)] md:h-auto overflow-y-auto">
          <ul className="space-y-1">
            <li className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</li>
            <SettingsNavLink 
              href="#profile" 
              icon={User} 
              isActive={activeSection === 'profile'}
              onClick={() => handleNavClick('profile')}
            >
              Profile
            </SettingsNavLink>
            
            <SettingsNavLink 
              href="#appearance" 
              icon={Palette} 
              isActive={activeSection === 'appearance'}
              onClick={() => handleNavClick('appearance')}
            >
              Appearance
            </SettingsNavLink>
            
            <SettingsNavLink 
              href="#api-keys" 
              icon={KeyRound} 
              isActive={activeSection === 'api-keys'}
              onClick={() => handleNavClick('api-keys')}
            >
              API Keys
            </SettingsNavLink>
            
            <SettingsNavLink 
              href="#feedback" 
              icon={MessageSquare}
              isActive={activeSection === 'feedback'}
              onClick={() => handleNavClick('feedback')}
            >
              Feedback
            </SettingsNavLink>
            
            <SettingsNavLink 
              href="#account-security" 
              icon={ShieldCheck} 
              isActive={activeSection === 'account-security'}
              onClick={() => handleNavClick('account-security')}
            >
              Account & Security
            </SettingsNavLink>
          </ul>
          
          <ul className="space-y-1 mt-4 border-t pt-4 dark:border-gray-700">
            <SettingsNavLink 
              href="#log-out" 
              icon={LogOut} 
              isActive={activeSection === 'log-out'}
              onClick={() => handleNavClick('log-out')}
            >
              Log out
            </SettingsNavLink>
            
            <SettingsNavLink 
              href="#delete-account" 
              icon={Trash2} 
              isActive={activeSection === 'delete-account'}
              onClick={() => handleNavClick('delete-account')}
            >
              Delete Account
            </SettingsNavLink>
          </ul>
        </nav>
      </aside>

      <main
        ref={mainRef}
        className="flex-1 p-4 md:p-10 space-y-8 overflow-y-auto relative h-[calc(100vh-65px)] md:h-screen"
      >
        <ProfileSettings />
        <AppearanceSettings />
        <APIKeysSettings />
        <FeedbackSettings />
        <AccountSecuritySettings />
        <LogoutSettings />
        <DeleteAccountSettings />
      </main>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  );
}
