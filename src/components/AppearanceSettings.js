"use client"; // Required for onClick and useTheme hook

import { useState, useEffect } from 'react'; // Import useState and useEffect
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react'; // Import icon

export default function AppearanceSettings() {
  const { setTheme, theme } = useTheme();
  // Create a state to track if the component is mounted
  const [mounted, setMounted] = useState(false);

  // When the component mounts on the client, set 'mounted' to true
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="appearance" className="space-y-6">
      <Card>
        <CardHeader>
          {/* --- Updated Heading --- */}
          <div className="flex items-center space-x-3">
            <Palette className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Appearance
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">Theme</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred theme.</p>

          {/* Show a placeholder on initial render to prevent layout shift */}
          {!mounted && (
            <div className="flex space-x-2">
              <Button variant="outline" disabled className="w-20">Light</Button>
              <Button variant="outline" disabled className="w-20">Dark</Button>
              <Button variant="outline" disabled className="w-20">System</Button>
            </div>
          )}

          {/* Show the real, interactive buttons only after mounting on the client */}
          {mounted && (
            <div className="flex space-x-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="w-20"
              >
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="w-20"
              >
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
                className="w-20"
              >
                System
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}