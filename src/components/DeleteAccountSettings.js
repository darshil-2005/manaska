"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Trash2 } from 'lucide-react'; 
import { toast } from 'react-toastify';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteAccountSettings() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to delete account');
      }
      
      toast.success(data?.message || 'Account deleted successfully. Redirecting to login...');
      
      setTimeout(() => {
        router.push('/login');
        router.refresh();
      }, 3000);

    } catch (error) {
      toast.error(error.message);
      setIsDeleting(false); 
    }
  };

  return (
    <section id="delete-account" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            <CardTitle className="text-2xl font-semibold tracking-tight text-red-700 dark:text-red-400">
              Danger Zone
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Reddish styling is applied to this inner container only */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                   <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-red-700 dark:text-red-400">Delete Account</h3>
                  <p className="text-sm text-red-600/80 dark:text-red-400/70">
                    Permanently remove your data and access. This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isDeleting}
                    className="w-full sm:w-auto shrink-0"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </AlertDialogTrigger>
                
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}