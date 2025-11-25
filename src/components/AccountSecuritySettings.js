"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { validatePasswordRules } from '@/utils/validators';

export default function AccountSecuritySettings() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  const [message, setMessage] = useState({ type: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isChangePasswordSectionOpen, setIsChangePasswordSectionOpen] = useState(false);

  const [passwordRuleError, setPasswordRuleError] = useState(null);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    if (newPasswordInput) {
      const error = validatePasswordRules(newPasswordInput);
      setPasswordRuleError(error);
    } else {
      setPasswordRuleError(null);
    }

    if (newPasswordInput && confirmPasswordInput) {
      setPasswordsMatch(newPasswordInput === confirmPasswordInput);
    } else {
      setPasswordsMatch(true);
    }
  }, [newPasswordInput, confirmPasswordInput]);

  const handleUpdatePassword = async () => {
    setMessage({ type: '', content: '' });
    toast.dismiss();

    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
      setMessage({ type: 'error', content: 'Please fill out all password fields.' });
      toast.error('Please fill out all password fields.');
      return;
    }
    if (!passwordsMatch) {
      setMessage({ type: 'error', content: 'New passwords do not match.' });
      toast.error('New passwords do not match.');
      return;
    }
    if (passwordRuleError) {
      setMessage({ type: 'error', content: passwordRuleError });
      toast.error(passwordRuleError);
      return;
    }

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
      if (!res.ok) throw new Error(data?.error || 'Failed to update password');

      setMessage({ type: 'success', content: data?.message || 'Password updated successfully.' });
      toast.success(data?.message || 'Password updated successfully.');
      
      // Clear inputs on success
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setIsChangePasswordSectionOpen(false);
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentPasswordInput("");
    setNewPasswordInput("");
    setConfirmPasswordInput("");
    setMessage({ type: '', content: '' });
    setIsChangePasswordSectionOpen(false);
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

          {/* --- Password Section --- */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Password</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click the button below to change your password.
            </p>
            <Button
              id="change-password-button"
              onClick={() => setIsChangePasswordSectionOpen(true)}
              className="mt-2 w-fit"
              disabled={isChangePasswordSectionOpen}
            >
              Change Password
            </Button>
          </div>

          {/* --- Change Password Form --- */}
          {isChangePasswordSectionOpen && (
            <div className="space-y-4 border-t pt-6 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-lg font-medium">Change Password</h3>

              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPasswordInput}
                  placeholder="Enter your current password"
                  onChange={(e) => {
                    setCurrentPasswordInput(e.target.value);
                    setMessage({ type: '', content: '' });
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
                    placeholder="Enter a new secure password"
                    onChange={(e) => {
                      setNewPasswordInput(e.target.value);
                      setMessage({ type: '', content: '' });
                    }}
                  />
                  <Button
                    id="toggle-new-password-visibility"
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-full px-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
                {newPasswordInput && passwordRuleError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> {passwordRuleError}
                  </p>
                )}
                {newPasswordInput && !passwordRuleError && (
                  <p className="text-sm text-green-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Password meets requirements.
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pr-10"
                    value={confirmPasswordInput}
                    placeholder="Re-enter your new password"
                    onChange={(e) => {
                      setConfirmPasswordInput(e.target.value);
                      setMessage({ type: '', content: '' });
                    }}
                  />
                  <Button
                    id="toggle-confirm-password-visibility"
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-full px-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
                {newPasswordInput && confirmPasswordInput && !passwordsMatch && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Passwords do not match.
                  </p>
                )}
                {newPasswordInput && confirmPasswordInput && passwordsMatch && (
                  <p className="text-sm text-green-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Passwords match.
                    </p>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <Button
                  id="close-password-form"
                  variant="outline"
                  onClick={() => setIsChangePasswordSectionOpen(false)}
                >
                  Close
                </Button>
                <Button
                  id="update-password-button"
                  onClick={handleUpdatePassword}
                  disabled={isSubmitting || !!passwordRuleError || !passwordsMatch || !newPasswordInput}
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </section>
  );
}