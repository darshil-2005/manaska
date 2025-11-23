"use client";


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'react-toastify';


export default function LogoutSettings() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const performLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || 'Failed to log out');
    }
    router.push('/login');
    router.refresh();
  };


  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await performLogout();
      toast.success('Logged out successfully.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };


  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    try {
      await performLogout();
      toast.success('Logged out from all devices.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoggingOut(false);
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
     
      toast.success(data?.message || 'Account deleted successfully.');
      await performLogout();


    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <section id="log-out" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <LogOut className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Log out
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 divide-y divide-gray-200 dark:divide-gray-700">


          {/* --- Log out of this device --- */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 first:pt-0">
            <div>
              <h3 className="text-lg font-medium">Log out of this device</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                You will be returned to the login screen.
              </p>
            </div>
            <Button
              id="logout-this-device"
              onClick={handleLogout}
              className="mt-3 md:mt-0 md:ml-4"
              disabled={isLoggingOut || isDeleting}
            >
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </Button>
          </div>


          {/* --- Log out of all devices --- */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 first:pt-0">
            <div>
              <h3 className="text-lg font-medium">Log out of all devices</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                Log out of all active sessions across all devices, including your current session.
              </p>
            </div>
            <Button
              id="logout-all-devices"
              onClick={handleLogoutAll}
              className="mt-3 md:mt-0 md:ml-4"
              disabled={isLoggingOut || isDeleting}
            >
              {isLoggingOut ? 'Logging out...' : 'Log out all'}
            </Button> {}
          </div>


          {/* --- Delete Account --- */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 first:pt-0">
            <div>
              <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Delete account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                Permanently remove your data. This action cannot be undone.
              </p>
            </div>
            <Button
              id="delete-account-button"
              variant="destructive"
              onClick={handleDeleteAccount}
              className="mt-3 md:mt-0 md:ml-4"
              disabled={isDeleting || isLoggingOut}
            >
              {isDeleting ? 'Deleting...' : 'Delete account'}
            </Button>
          </div>


        </CardContent>
      </Card>
    </section>
  );
}
