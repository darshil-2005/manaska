"use client";

import { useState, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, Brain } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FeedbackSettings() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const prompts = [
      "Spot a bug we missed? 🪲",
      "What's one feature you wish we had? 🚀",
      "How can we make Manaska smarter? 🧠",
      "Love it or hate it? Let us know! 💭",
      "Found a glitch in the matrix? 🕶️"
    ];
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, [isExpanded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSent(true);

    const successMessages = [
      "High five! Feedback received. 🙌",
      "Transmitted to headquarters! 📡",
      "Thanks for the insight! 💡",
      "You're helping us build this! 🚀",
      "Noted! We'll get right on it. 📝",
      "Loud and clear. Thanks! 🔊"
    ];
    const payload = { response: text.trim() };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to submit feedback");
      }

      const randomMsg = successMessages[Math.floor(Math.random() * successMessages.length)];
      toast.success(randomMsg);
      setIsExpanded(false);
      setText("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit feedback";
      toast.error(message);
    } finally {
      setIsSent(false);
    }
  };

  return (
    <section id="feedback" className="space-y-6">
    
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Feedback
            </CardTitle>
          </div>
        </CardHeader>


        <CardContent>
          <div className={`
            relative overflow-hidden rounded-lg border transition-all duration-200 ease-in-out
            ${isExpanded 
              ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700' 
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
            }
          `}>
            
            {!isExpanded && (
              <button 
                onClick={() => setIsExpanded(true)}
                className="w-full text-left p-5 group flex items-center justify-between"
              >
                <div>
                  <h3 className="text-base font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {prompt}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 transition-colors">
                    Click to send a quick message to the team.
                  </p>
                </div>
                
                {/* Icon Circle */}
                <div className="h-9 w-9 rounded-md bg-neutral-900 dark:bg-white flex items-center justify-center border border-neutral-800 dark:border-neutral-200 group-hover:opacity-80 transition-all">
                  <Sparkles className="w-4 h-4 text-white dark:text-black" />
                </div>
              </button>
            )}

            {/* The chat expansion */}
            {isExpanded && (
              <div className="p-5 animate-in fade-in zoom-in-95 duration-200">
                
                <div className="space-y-4 mb-4">
                  
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-md bg-neutral-200 dark:bg-black border border-neutral-300 dark:border-neutral-800 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div className="bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 py-2 px-3 rounded-lg rounded-tl-none text-sm text-neutral-700 dark:text-neutral-300">
                      {prompt}
                    </div>
                  </div>

                  
                  {text && (
                    <div className="flex gap-3 justify-end">
                      <div className="bg-black dark:bg-white border border-black dark:border-white py-2 px-3 rounded-lg rounded-tr-none text-sm text-white dark:text-black break-all max-w-[80%]">
                        {text}
                      </div>
                    </div>
                  )}
                  
                  {isSent && (
                    <div className="flex gap-3 justify-end">
                      <div className="text-xs text-neutral-500 italic pr-1">Sending...</div>
                    </div>
                  )}
                </div>

               
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    autoFocus
                    type="text"
                    className="w-full bg-neutral-100 dark:bg-black border border-neutral-300 dark:border-neutral-800 rounded-md pl-4 pr-28 py-3 text-sm 
                              text-neutral-900 dark:text-white 
                              placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                    placeholder="Type your thoughts here..."
                    maxLength={50}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isSent}
                  />
                  
                  
                  <div className="absolute right-2 top-1 flex items-center gap-1">
                    <span className={`text-[10px] font-mono mr-2 ${text.length === 50 ? 'text-red-500' : 'text-neutral-400'}`}>
                      {text.length}/50
                    </span>
                    
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => { setIsExpanded(false); setText(""); }}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!text.trim() || isSent}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}