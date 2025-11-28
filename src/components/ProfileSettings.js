"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ProfileSettings() {
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');


  const [initialData, setInitialData] = useState({ name: '', username: '' });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to load profile');
        }

        if (isMounted && data?.profile) {
          const profile = data.profile;
          
          const emailName = profile.email ? profile.email.split('@')[0] : '';
          const loadedName = profile.name || emailName;
          const loadedUsername = profile.username || emailName;
          
          setName(loadedName);
          setUsername(loadedUsername);
          setEmail(profile.email || '');

          setInitialData({
            name: loadedName,
            username: loadedUsername
          });
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error.message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to update profile');
      }

      toast.success('Profile updated successfully.');
      
      // Update the initial data to the new values so the button disables again
      setInitialData({ name, username });
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  // Cancel: Revert changes back to initial data
  const handleCancel = () => {
    setName(initialData.name);
    setUsername(initialData.username);
    setIsEditing(false);
  };

  // Check if there are any changes
  const hasChanges = name !== initialData.name || username !== initialData.username;

  return (
    <section id="profile" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Profile
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Profile Information</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing || isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing || isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled readOnly />
              <p className="text-sm text-gray-500 dark:text-gray-400">Email address cannot be changed.</p>
            </div>

            <div className="flex justify-end space-x-2">
            <Button
              id="edit-profile-button"
              className="float-right"
              onClick={handleToggleEdit}
              disabled={isLoading || (isEditing && isSaving)}
            >
              {isEditing ? (isSaving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
            </Button>

              {isEditing && (
                <Button
                  onClick={handleCancel}
                  variant={"destructive"}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              )}             
            </div>
            
          </div>
        </CardContent>
      </Card>
    </section>
  );
}