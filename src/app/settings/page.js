"use client"
import React, { useState, useEffect } from 'react';
import {
    User,
    Shield,
    Palette,
    Ear,
    KeyRound,
    CreditCard,
    Upload,
    Trash2
} from 'lucide-react';


/* --- Reusable Tailwind Class Strings --- */
const inputClasses = "block w-full rounded-md shadow-sm sm:text-sm text-gray-900 bg-white border-gray-300 focus:ring-black focus:border-black py-2 px-3";
const inputDisabledClasses = "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";

const btnBase = "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";

/* Black & White theme buttons */
const btnPrimary = `${btnBase} text-white bg-black hover:bg-gray-900 focus:ring-black`;
const btnSecondary = `${btnBase} text-black bg-white border border-gray-400 hover:bg-gray-100 focus:ring-black`;

/* Keep Danger button red */
const btnDanger = `${btnBase} text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`;

/* --- Reusable Sub-Components --- */

const SidebarLink = ({ icon: Icon, label, tabName, activeTab, setActiveTab }) => {
    const isActive = activeTab === tabName;
    return (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full transition-colors duration-150 ${isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
        >
            <Icon
                className={`w-5 h-5 mr-3 ${isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                aria-hidden="true"
            />
            {label}
        </button>
    );
};


/**
 * A styled card wrapper for each settings group.
 */
const SettingsCard = ({ title, description, children, footer }) => (
    <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            <div className="mt-6">{children}</div>
        </div>
        {footer && (
            <div className="px-6 py-4 bg-gray-50 text-right rounded-b-lg space-x-3">
                {footer}
            </div>
        )}
    </div>
);


/**
 * A custom toggle switch component.
 */
const ToggleSwitch = ({ enabled, setEnabled }) => (
    <button
        type="button"
        className={`${enabled ? 'bg-indigo-600' : 'bg-gray-400'
            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled(!enabled)}
    >
        <span
            className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
        />
    </button>
);


export default function SettingsPage() {
    // --- State ---
    const [activeTab, setActiveTab] = useState('profile');
    const [theme, setTheme] = useState('light'); // Keep a theme state for UI only
    const [audioCues, setAudioCues] = useState(false);

    // Profile Editing
    const [isProfileEditing, setProfileEditing] = useState(false);
    const [profileData, setProfileData] = useState({ name: 'Manaska User', username: 'manaska_user' });
    const [originalProfileData, setOriginalProfileData] = useState(profileData);


    // API Key Editing
    const [currentApiKey, setCurrentApiKey] = useState({ provider: 'OpenAI', key: '••••••••••••••••••••••••sk-1234' });
    const [selectedLlm, setSelectedLlm] = useState('');
    const [newApiKey, setNewApiKey] = useState('');

    // --- Effects ---


    // Effect to ensure light mode is applied
    useEffect(() => {
        try {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = ''; // Use Tailwind's default
        } catch (e) {
            // ignore in environments where document is not available
        }
    }, []);



    // --- Data ---
    const navItems = [
        { tab: 'profile', label: 'Profile', icon: User },
        { tab: 'security', label: 'Account & Security', icon: Shield },
        { tab: 'appearance', label: 'Appearance', icon: Palette },
        { tab: 'accessibility', label: 'Accessibility', icon: Ear },
        { tab: 'api', label: 'API Keys', icon: KeyRound },
        { tab: 'billing', label: 'Subscription & Billing', icon: CreditCard },
    ];

    // --- Handlers ---

    // Profile
    const handleProfileEdit = () => {
        setOriginalProfileData(profileData);
        setProfileEditing(true);
    };
    const handleProfileCancel = () => {
        setProfileData(originalProfileData);
        setProfileEditing(false);
    };
    const handleProfileSave = (e) => {
        e.preventDefault();
        // In a real app, save to backend here
        console.log('Saving profile:', profileData);
        setOriginalProfileData(profileData);
        setProfileEditing(false);
    };
    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };


    // API Key
    const handleLlmChange = (e) => {
        setSelectedLlm(e.target.value);
        setNewApiKey(''); // Reset key input when provider changes
    };


    const handleApiCancel = () => {
        setSelectedLlm('');
        setNewApiKey('');
    };

    const handleApiSave = (e) => {
        e.preventDefault();
        // In a real app, save to backend here
        console.log('Saving API key for:', selectedLlm);
        // On save, mask the key again for display
        const maskedKey = '••••••••••••••••••••••••' + newApiKey.slice(-4);
        setCurrentApiKey({ provider: selectedLlm, key: maskedKey });

        // Reset the form
        setSelectedLlm('');
        setNewApiKey('');
    };


    const handleApiDelete = () => {
        // In a real app, show a confirmation modal first
        console.log('Deleting current API key');
        setCurrentApiKey(null);
    };


    // --- Render ---
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-white text-gray-700 font-inter">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-gray-200">
                <div className="p-4 md:p-6">
                    <a href="#" className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">ManaskaAI</span>
                    </a>
                </div>
                <nav className="flex-1 px-4 md:px-6 py-2 md:py-4 space-y-2">
                    <h2 className="px-2 text-xs font-semibold uppercase text-gray-500 tracking-wider">Settings</h2>
                    <div className="space-y-1">
                        {navItems.map(item => (
                            <SidebarLink
                                key={item.tab}
                                icon={item.icon}
                                label={item.label}
                                tabName={item.tab}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        ))}
                    </div>
                </nav>
            </aside>


            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-white">
                <div className="max-w-3xl mx-auto">

                    {/* Profile Section */}
                    {activeTab === 'profile' && (
                        <section id="profile" className="space-y-8">
                            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

                            <SettingsCard title="Profile Picture" description="Update your profile picture. (Max 5MB: JPG, PNG, WEBP)">
                                <div className="flex items-center space-x-4">
                                    <img className="h-16 w-16 rounded-full" src="https://placehold.co/128x128/4F46E5/FFFFFF?text=MA" alt="Profile placeholder" />
                                    <input type="file" id="profile-pic-upload" className="hidden" accept=".jpg,.jpeg,.png,.webp" />
                                    <button onClick={() => document.getElementById('profile-pic-upload').click()} className={btnSecondary}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload New
                                    </button>
                                    <button className={btnSecondary}>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Remove
                                    </button>
                                </div>
                            </SettingsCard>


                            <form onSubmit={handleProfileSave}>
                                <SettingsCard
                                    title="Profile Information"
                                    footer={
                                        !isProfileEditing ? (
                                            <button type="button" onClick={handleProfileEdit} className={btnPrimary}>Edit Profile</button>
                                        ) : (
                                            <>
                                                <button type="button" onClick={handleProfileCancel} className={btnSecondary}>Cancel</button>
                                                <button type="submit" className={btnPrimary}>Save Changes</button>
                                            </>
                                        )
                                    }
                                >
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                            <input type="text" name="name" id="name" value={profileData.name} onChange={handleProfileChange} disabled={!isProfileEditing} className={`${inputClasses} ${inputDisabledClasses} mt-1`} />
                                        </div>
                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                            <input type="text" name="username" id="username" value={profileData.username} onChange={handleProfileChange} disabled={!isProfileEditing} className={`${inputClasses} ${inputDisabledClasses} mt-1`} />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                            <input type="email" name="email" id="email" value="user@manaska.ai" disabled className={`${inputClasses} ${inputDisabledClasses} mt-1`} />
                                            <p className="mt-2 text-xs text-gray-500">Email address cannot be changed.</p>
                                        </div>
                                    </div>
                                </SettingsCard>
                            </form>
                        </section>
                    )}


                    {/* Account & Security Section */}
                    {activeTab === 'security' && (
                        <section id="security" className="space-y-8">
                            <h1 className="text-2xl font-bold text-gray-900">Account & Security</h1>


                            <form>
                                <SettingsCard title="Change Password" footer={<button type="submit" className={btnPrimary}>Update Password</button>}>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                                            <input type="password" name="current-password" id="current-password" className={`${inputClasses} mt-1`} />
                                        </div>
                                        <div>
                                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                                            <input type="password" name="new-password" id="new-password" className={`${inputClasses} mt-1`} />
                                        </div>
                                        <div>
                                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                            <input type="password" name="confirm-password" id="confirm-password" className={`${inputClasses} mt-1`} />
                                        </div>
                                    </div>
                                </SettingsCard>
                            </form>


                            <div className="bg-white rounded-lg shadow border border-red-500/30">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium leading-6 text-red-600">Danger Zone</h3>
                                    <p className="mt-1 text-sm text-gray-500">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                    <div className="mt-4">
                                        <button type="button" className={btnDanger}>
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}


                    {/* Appearance Section (buttons shown but disabled) */}
                    {activeTab === 'appearance' && (
                        <section id="appearance" className="space-y-8">
                            <h1 className="text-2xl font-bold text-gray-900">Appearance</h1>

                            <SettingsCard title="Theme" description="Buttons are present as UI only (disabled).">
                                <div className="flex bg-gray-100 rounded-lg p-1 max-w-xs">
                                    {['light', 'dark', 'system'].map(t => (
                                        <button
                                            key={t}
                                            // intentionally disabled: non-functional for now
                                            disabled
                                            className={`flex-1 capitalize py-2 px-3 rounded-md text-sm font-medium transition-all opacity-60 cursor-not-allowed select-none ${theme === t
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-500'
                                                }`}
                                            title="Disabled for now"
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </SettingsCard>
                        </section>
                    )}

                    {/* Accessibility Section */}
                    {activeTab === 'accessibility' && (
                        <section id="accessibility" className="space-y-8">
                            <h1 className="text-2xl font-bold text-gray-900">Accessibility</h1>

                            <SettingsCard title="Color Scheme" description="Specify color-blind friendly palettes for generated mind maps.">
                                <select id="color-scheme" className={`${inputClasses} max-w-xs`}>
                                    <option>Default Palette</option>
                                    <option>Deuteranopia-friendly</option>
                                    <option>Protanopia-friendly</option>
                                    <option>Tritanopia-friendly</option>
                                </select>
                            </SettingsCard>

                            <SettingsCard title="Audio Cues">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-base font-medium text-gray-900">Enable Audio Cues</h4>
                                        <p className="text-sm text-gray-500">Enable audio cues for key actions and notifications.</p>
                                    </div>
                                    <ToggleSwitch enabled={audioCues} setEnabled={setAudioCues} />
                                </div>

                                {audioCues && (
                                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                                        <div>
                                            <label htmlFor="audio-volume" className="block text-sm font-medium text-gray-700">Volume</label>
                                            <input type="range" id="audio-volume" min="0" max="100" defaultValue="50" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                        </div>
                                        <div>
                                            <label htmlFor="audio-speed" className="block text-sm font-medium text-gray-700">Speech Rate</label>
                                            <input type="range" id="audio-speed" min="50" max="200" defaultValue="100" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                        </div>
                                    </div>
                                )}
                            </SettingsCard>
                        </section>
                    )}


                    {/* API Keys Section */}
                    {activeTab === 'api' && (
                        <section id="api" className="space-y-8">
                            <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>

                            <form onSubmit={handleApiSave}>
                                <SettingsCard
                                    title="Add New LLM API Key"
                                    description="Use your own LLM API key to control costs and model choice. Your key is stored securely."
                                    footer={
                                        selectedLlm && (
                                            <>
                                                <button type="button" onClick={handleApiCancel} className={btnSecondary}>Cancel</button>
                                                <button type="submit" className={btnPrimary} disabled={!newApiKey}>Save Key</button>
                                            </>
                                        )
                                    }
                                >
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="llm-provider" className="block text-sm font-medium text-gray-700">LLM Provider</label>
                                            <select
                                                id="llm-provider"
                                                value={selectedLlm}
                                                onChange={handleLlmChange}
                                                className={`${inputClasses} max-w-xs mt-1`}
                                            >
                                                <option value="" disabled>Select a provider...</option>
                                                <option value="OpenAI">OpenAI</option>
                                                <option value="Gemini">Google Gemini</option>
                                                <option value="Claude">Anthropic (Claude)</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>


                                        {selectedLlm && (
                                            <div>
                                                <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">{selectedLlm} API Key</label>
                                                <input
                                                    type="password"
                                                    name="api-key"
                                                    id="api-key"
                                                    value={newApiKey}
                                                    placeholder="Enter your new API key"
                                                    onChange={(e) => setNewApiKey(e.target.value)}
                                                    className={`${inputClasses} mt-1`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </SettingsCard>
                            </form>


                            <SettingsCard title="Current API Key">
                                {currentApiKey ? (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{currentApiKey.provider} Key</p>
                                            <p className="text-sm text-gray-500 font-mono">{currentApiKey.key}</p>
                                        </div>
                                        <button type="button" onClick={handleApiDelete} className={btnDanger}>
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Key
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No API key is currently in use. Add one above to get started.</p>
                                )}
                            </SettingsCard>
                        </section>
                    )}

                    {/* Subscription & Billing Section */}
                    {activeTab === 'billing' && (
                        <section id="billing" className="space-y-8">
                            <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>

                            <SettingsCard title="Current Plan">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">You are currently on the <span className="font-medium text-indigo-600">Pro Plan</span>.</p>
                                        <p className="mt-1 text-sm text-gray-500">Next billing date: November 30, 2025</p>
                                    </div>
                                    <button type="button" className={`${btnPrimary} mt-4 sm:mt-0 w-full sm:w-auto`}>
                                        Manage Subscription
                                    </button>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">
                                    Click "Manage Subscription" to change or cancel your plan, or update your payment method.
                                </p>
                            </SettingsCard>

                            <SettingsCard title="Billing History">
                                <ul role="list" className="-my-4 divide-y divide-gray-200">
                                    <li className="flex items-center justify-between py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Invoice #12345</p>
                                            <p className="text-sm text-gray-500">October 30, 2025</p>
                                        </div>
                                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Download</a>
                                    </li>
                                    <li className="flex items-center justify-between py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Invoice #12344</p>
                                            <p className="text-sm text-gray-500">September 30, 2025</p>
                                        </div>
                                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Download</a>
                                    </li>
                                </ul>
                            </SettingsCard>
                        </section>
                    )}

                </div>
            </main>
        </div>
    );
}







