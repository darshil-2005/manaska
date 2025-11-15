"use client"; // Required for Button, Input components, and useRef

import { useRef } from 'react'; // Import useRef
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react'; // Import the User icon

export default function ProfileSettings() {
  // Create a ref for the hidden file input
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // You can now handle the file upload logic
      console.log("Selected file:", file.name);
      // For example, you could upload it or display a preview.
    }
  };

  return (
    <section id="profile" className="space-y-6">
      <Card>
        <CardHeader>
          {/* --- Updated Heading --- */}
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Profile
            </CardTitle>
          </div>
          {/* "No token found" message has been removed */}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://placehold.co/80x80/6366f1/white?text=MA" alt="MA" />
                <AvatarFallback className="text-lg bg-indigo-500 text-white">MA</AvatarFallback>
              </Avatar>

              {/* --- Hidden File Input --- */}
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileSelect}
              />

              <div className="flex space-x-2">
                {/* --- Updated Buttons to default variant --- */}
                <Button 
                  // variant="secondary" Removed this line, default is implied
                  onClick={() => fileInputRef.current.click()} // Triggers the hidden file input
                >
                  Upload New
                </Button>
                <Button 
                  // variant="secondary" Removed this line, default is implied
                >
                  Remove
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your profile picture. (Max 5MB: JPG, PNG, WEBP)</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Profile Information</h3>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="" disabled />
              <p className="text-sm text-gray-500 dark:text-gray-400">Email address cannot be changed.</p>
            </div>
            <Button className="float-right">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}