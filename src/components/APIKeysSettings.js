"use client";

import { useState } from 'react';
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
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

export default function APIKeysSettings() {
  const [keys, setKeys] = useState([
    { provider: 'OpenAI', value: '••••••••••••••••8k-1234' },
  ]);
  const [newKeyProvider, setNewKeyProvider] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [showNewKeyValue, setShowNewKeyValue] = useState(false);


  const handleAddKey = () => {
    if (!newKeyProvider || !newKeyValue) {
      toast.error("Please select a provider and enter a key.");
      return;
    }
    
    const maskedKey = `••••••••••••••••${newKeyValue.slice(-4)}`;
    setKeys([
      ...keys,
      { provider: newKeyProvider, value: maskedKey },
    ]);
    
    toast.success(`${newKeyProvider} key added successfully.`);
    
    // reset inputs
    setNewKeyProvider('');
    setNewKeyValue('');
    setShowNewKeyValue(false);
  };

  const handleCancel = () => {
    // reset inputs and hide the key section
    setNewKeyProvider('');
    setNewKeyValue('');
    setShowNewKeyValue(false);
  };

  const handleDeleteKey = (indexToDelete) => {
    const keyProvider = keys[indexToDelete].provider;
    setKeys(keys.filter((_, index) => index !== indexToDelete));
    toast.success(`${keyProvider} key deleted.`);
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
                <SelectContent>
                  <SelectItem value="OpenAI">OpenAI</SelectItem>
                  <SelectItem value="Deepseek">Deepseek</SelectItem>
                  <SelectItem value="Gemini">Gemini</SelectItem>
                  <SelectItem value="Grok">Grok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- Conditional Rendering --- */}
            {newKeyProvider && (
              <div className="space-y-4 pt-2 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                <div className="grid gap-2">
                  <Label htmlFor="api-key">API Key for {newKeyProvider}</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showNewKeyValue ? "text" : "password"}
                      value={newKeyValue}
                      onChange={(e) => setNewKeyValue(e.target.value)}
                      className="pr-10"
                      placeholder="Enter your API key"
                    />
                    <Button
                      id="toggle-api-key-visibility"
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-full px-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => setShowNewKeyValue(!showNewKeyValue)}
                    >
                      {showNewKeyValue ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      <span className="sr-only">{showNewKeyValue ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-2 pt-2">
                  <Button
                    id="cancel-add-key"
                    variant="outline"
                    
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button id="add-api-key-button" onClick={handleAddKey}>
                    Add Key
                  </Button>
                </div>
              </div>
            )}
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md dark:border-gray-700 gap-4 sm:gap-0"
                  >
                    <span className="font-mono text-sm break-all">
                      {key.provider} Key: {key.value}
                    </span>
                    <Button
                      id={`delete-api-key-${index}`}
                      variant="destructive"
                      onClick={() => handleDeleteKey(index)}
                      className="shrink-0 sm:ml-4 w-full sm:w-auto"
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