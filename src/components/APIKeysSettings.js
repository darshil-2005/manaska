"use client"; // Required for Select, Button, and useState

import { useState } from 'react'; // Import useState
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KeyRound, Eye, EyeOff } from 'lucide-react'; // Import icons

export default function APIKeysSettings() {
  // --- State Management ---
  const [keys, setKeys] = useState([
    { provider: 'OpenAI', value: '••••••••••••••••8k-1234' },
  ]);
  const [newKeyProvider, setNewKeyProvider] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [showNewKeyValue, setShowNewKeyValue] = useState(false); // <-- State for toggle

  // --- Event Handlers ---

  const handleAddKey = () => {
    if (!newKeyProvider || !newKeyValue) {
      console.warn("Please select a provider and enter a key."); 
      return;
    }
    // Simple masking, takes last 4 digits
    const maskedKey = `••••••••••••••••${newKeyValue.slice(-4)}`;
    setKeys([
      ...keys,
      { provider: newKeyProvider, value: maskedKey },
    ]);
    // Reset inputs
    setNewKeyProvider('');
    setNewKeyValue('');
    setShowNewKeyValue(false); // Hide password after adding
  };

  const handleDeleteKey = (indexToDelete) => {
    setKeys(keys.filter((_, index) => index !== indexToDelete));
  };

  return (
    <section id="api-keys" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <KeyRound className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <CardTitle className="text-2xl font-semibold tracking-tight">
              API Keys
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add New LLM API Key</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Use your own LLM API key to control costs and model choice. Your key is stored securely.
            </p>
            <div className="grid gap-2">
              <Label htmlFor="llm-provider">LLM Provider</Label>
              <Select
                value={newKeyProvider}
                onValueChange={setNewKeyProvider}
              >
                <SelectTrigger id="llm-provider">
                  <SelectValue placeholder="Select a provider..." />
                </SelectTrigger>
                {/* --- UPDATED DROPDOWN OPTIONS --- */}
                <SelectContent>
                  <SelectItem value="OpenAI">OpenAI</SelectItem>
                  <SelectItem value="Gemini">Gemini</SelectItem>
                  <SelectItem value="Grok">Grok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- API KEY INPUT (UPDATED) --- */}
            <div className="grid gap-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showNewKeyValue ? "text" : "password"} // <-- Toggle type
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full px-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setShowNewKeyValue(!showNewKeyValue)} // <-- Toggle state
                >
                  {showNewKeyValue ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  <span className="sr-only">{showNewKeyValue ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <Button className="float-right" onClick={handleAddKey}>
              Add Key
            </Button>
          </div>

          <div className="border-t pt-6 mt-6 dark:border-gray-700">
            <h3 className="text-lg font-medium">Current API Keys</h3>
            {keys.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                You have no API keys added.
              </p>
            ) : (
              <div className="space-y-4 mt-4">
                {keys.map((key, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-md dark:border-gray-700"
                  >
                    <span className="font-mono">
                      {key.provider} Key: {key.value}
                    </span>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteKey(index)}
                    >
                      Delete Key
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}