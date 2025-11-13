"use client"; // Required for Input, Button components, and useState

import { useState } from 'react'; // Import useState
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react'; // Import icons

export default function AccountSecuritySettings() {
  // State to manage password visibility
  const [showExistingPassword, setShowExistingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mock data for the current password
  const currentPassword = "mySecretPassword1234";

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
                  value={currentPassword}
                  disabled
                  className="pr-10" 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full px-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setShowExistingPassword(!showExistingPassword)}
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
              {/* This field is for *typing* the password, so it's not disabled */}
              <Input id="current-password" type="password" />
              {/* Note: You could add an eye toggle here too, but it's often skipped for the "verification" field. */}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  className="pr-10" 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full px-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  <span className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
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
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full px-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <Button className="float-right">Update Password</Button>
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
                <Button variant="destructive" className="mt-4">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}