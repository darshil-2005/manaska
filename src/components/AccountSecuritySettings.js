"use client"; // Required for Input, Button components, and useState

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AccountSecuritySettings() {
  const router = useRouter();
  // State to manage password visibility
  const [showExistingPassword, setShowExistingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for Change Password form
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  // --- State for validation messages ---
  const [message, setMessage] = useState({ type: '', content: '' }); // type can be 'error' or 'success'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdatePassword = async () => {
    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
      setMessage({ type: 'error', content: 'Please fill out all password fields.' });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setMessage({ type: 'error', content: 'New passwords do not match.' });
      return;
    }

    setMessage({ type: '', content: '' });
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput,
          confirmNewPassword: confirmPasswordInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to update password');
      }

      setMessage({ type: 'success', content: data?.message || 'Password updated successfully.' });
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to delete account');
      }
      alert(data?.message || 'Account deleted successfully.');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section id="account-security" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Account & Security
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Current Password</h3>
            <div className="grid gap-2">
              <Label htmlFor="existing-password">Your Password</Label>
              <div className="relative">
                <Input
                  id="existing-password"
                  type={showExistingPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  readOnly
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full px-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setShowExistingPassword(!showExistingPassword)}
                  disabled
                >
                  {showExistingPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  <span className="sr-only">{showExistingPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle visibility to show or hide your current password.
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6 dark:border-gray-700">
            <h3 className="text-lg font-medium">Change Password</h3>

            <div className="grid gap-2">
             <Label htmlFor="current-password">Current Password</Label> 
              <Input 
                id="current-password" 
                type="password"
                value={currentPasswordInput} 
                onChange={(e) => {
                  setCurrentPasswordInput(e.target.value);
                  setMessage({ type: '', content: '' }); // Clear message on new input
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  className="pr-10"
                  value={newPasswordInput}
                  onChange={(e) => {
                    setNewPasswordInput(e.target.value);
                    setMessage({ type: '', content: '' });
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full px-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="pr-10"
                  value={confirmPasswordInput}
                  onChange={(e) => {
                    setConfirmPasswordInput(e.target.value);
                    setMessage({ type: '', content: '' });
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full px-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                 
                </Button>
              </div>
            </div>
             {/* --- Validation Message & Button --- */}
            <div className="flex items-center justify-between pt-2">
              <div className="min-h-[20px]"> {/* Prevents layout shift */}
                {message.content && (
                  <p className={`text-sm ${
                    message.type === 'error' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {message.content}
                  </p>
                )}
              </div>
              <Button className="float-right" onClick={handleUpdatePassword} disabled={isSubmitting}> 
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            </div>

          </div>

          <div className="border-t pt-6 mt-6 dark:border-gray-700">
            <Card className="border-red-500 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4">
                <h3 className="flex items-center space-x-2 text-lg font-medium text-red-700 dark:text-red-300">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Danger Zone</span>
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="destructive" className="mt-4" onClick={handleDeleteAccount} disabled={isDeleting || isSubmitting}>
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}