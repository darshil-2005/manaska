"use client"; // Required for Button, Input components, and useRef

import { useRef, useState } from 'react'; // Import useState
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react'; // Import the User icon

export default function ProfileSettings() {
 // Ref for the hidden file input
  const fileInputRef = useRef(null);

   // --- New State for Edit Mode ---
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Manaska User"); // Mock data
  const [username, setUsername] = useState("manaska_ai"); // Mock data

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // You can now handle the file upload logic
      console.log("Selected file:", file.name);
      // For example, you could upload it or display a preview.
    }
  };

   // --- New Toggle Function ---
  const handleToggleEdit = () => {
    if (isEditing) {
      // Logic to save data would go here
      console.log("Saving data:", { name, username });
    }
    setIsEditing(!isEditing); // Toggle edit mode
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
                <Button>
                  Remove
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your profile picture. (Max 5MB: JPG, PNG, WEBP)</p>
          </div>

           {/* --- PROFILE INFORMATION (UPDATED) --- */}  

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Profile Information</h3>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
               <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing} // <-- Toggle disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
                  <Input 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing} // <-- Toggle disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
               <Input id="email" defaultValue="user@example.com" disabled />
              <p className="text-sm text-gray-500 dark:text-gray-400">Email address cannot be changed.</p>
            </div>
            <Button className="float-right" onClick={handleToggleEdit}>
              {isEditing ? "Save Changes" : "Edit Profile"} {/* <-- Toggle text */}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}