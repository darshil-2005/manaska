"use client";


import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

export default function APIKeysSettings() {
  const PROVIDER_NAME = 'Groq';
  // --- State Management ---
  const [storedKey, setStoredKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState('');
  const [showNewKeyValue, setShowNewKeyValue] = useState(false);

  useEffect(() => {
    loadStoredKey();
  }, []);

  const loadStoredKey = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/api-key');
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = data?.error || 'Failed to load API key.';
        throw new Error(message);
      }

      if (data.hasKey) {
        setStoredKey({ provider: PROVIDER_NAME, maskedValue: data.maskedKey });
      } else {
        setStoredKey(null);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load API key.');
      setStoredKey(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Event Handlers ---


  const handleAddKey = () => {
    if (!newKeyValue) {
      toast.error("Please enter a key.");
      return;
    }
   
    void saveKey();
  };

  const saveKey = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: newKeyValue }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data?.error || 'Failed to save API key.';
        throw new Error(message);
      }

      toast.success(`${PROVIDER_NAME} key saved successfully.`);
      setNewKeyValue('');
      setShowNewKeyValue(false);
      await loadStoredKey();
    } catch (error) {
      toast.error(error.message || 'Failed to save API key.');
    } finally {
      setSaving(false);
    }
  };


  const handleCancel = () => {
    // Reset inputs and hide the key section
    setNewKeyValue('');
    setShowNewKeyValue(false);
  };


  const handleDeleteKey = async () => {
    setDeleting(true);
    try {
      const res = await fetch('/api/user/api-key', { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = data?.error || 'Failed to delete API key.';
        throw new Error(message);
      }

      toast.success('API key deleted.');
      setStoredKey(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete API key.');
    } finally {
      setDeleting(false);
    }
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
              Use your own {PROVIDER_NAME} API key to control costs and model choice. Your key is stored securely.
            </p>
            <div className="space-y-4 pt-2 animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <div className="grid gap-2">
                <Label htmlFor="api-key">API Key for {PROVIDER_NAME}</Label>
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
             
              {/* --- Updated Button Group --- */}
              <div className="flex items-center justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddKey} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Key'}
                </Button>
              </div>
            </div>
          </div>


          <div className="border-t pt-6 mt-6 dark:border-gray-700">
            <h3 className="text-lg font-medium">Current API Keys</h3>
            {loading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Loading your stored API key...
              </p>
            ) : !storedKey ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                You have no API key saved yet.
              </p>
            ) : (
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between p-4 border rounded-md dark:border-gray-700">
                  <span className="font-mono">
                    {storedKey.provider} Key: {storedKey.maskedValue}
                  </span>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteKey}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete Key'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
