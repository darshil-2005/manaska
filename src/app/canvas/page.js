'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Share,
    Save,
    MoreHorizontal,
    Undo,
    Redo,
    Search,
    Settings,
    Zap,
    Code,
    Play,
    Plus,
    Upload,
    Download
} from 'lucide-react';
import dynamic from "next/dynamic"; 
import {DSLToExcalidraw} from '../../utils/DSLToExcalidraw.js';

const ExcalidrawWrapper = dynamic(
  () => import('../../wrapper/excalidraw.js'),
  {
    ssr: false,
    loading: () => (
        <div className="w-full h-screen flex items-center justify-center bg-white">
            <div className="text-gray-500 text-sm">Loading canvas...</div>
        </div>
    )
  }
);

export default function MindMapDesigner() {
    const handleCanvasChange = (elements, appState, files) => {
        console.log('Canvas updated:', elements);
    };

    const [scriptCode, setScriptCode] = useState(`Node "welcomeNode" {
label: "Welcome To Manaska!!",
height: 100,
width: 390,
x: 400,
y: 300,
backgroundColor: "#fff3bf",
borderColor: "#000000",
textColor: "#000000",
};`);
    const [activeTab, setActiveTab] = useState('script');
    const [aiPrompt, setAiPrompt] = useState('');
    const [elements, setElements] = useState(null);
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    
    // Track previous script to detect text changes
    const previousScriptRef = useRef(scriptCode);

   useEffect(() => {
        // Don't run if the API isn't ready
        if (!excalidrawAPI) return;

        const newElementSkeletons = DSLToExcalidraw(scriptCode);
        setElements(newElementSkeletons);
        // Pass the new elements directly to updateScene
        updateScene(newElementSkeletons);

    }, [scriptCode, excalidrawAPI]);   
    
 const updateScene = async (elementSkeletons) => {
      if (!excalidrawAPI || !elementSkeletons) return;

      const { convertToExcalidrawElements, restoreElements } = await import("@excalidraw/excalidraw");

      const oldLabels = previousScriptRef.current.match(/label:\s*"[^"]*"/g) || [];
      const newLabels = scriptCode.match(/label:\s*"[^"]*"/g) || [];
      const textChanged = JSON.stringify(oldLabels) !== JSON.stringify(newLabels);

     // After creating your elements programmatically
     const normalizedElements = restoreElements(elementSkeletons, null, {
       refreshDimensions: textChanged,  // Only refresh when text changes (OPTIMIZATION)
       repairBindings: true,
       normalizeIndices: true
     });
      
      const sceneData = {
        elements: convertToExcalidrawElements(normalizedElements),
          appState:{
          },
      };
      excalidrawAPI.updateScene(sceneData);
      
      // Only refresh if text changed (OPTIMIZATION)
      if (textChanged) {
          excalidrawAPI.refresh();
      }
      
      previousScriptRef.current = scriptCode;
  };


    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                            <span className="text-white text-sm font-bold">M</span>
                        </div>
                        <span className="font-semibold text-gray-900">Manaska</span>
                    </div>

                    {/* Project Info */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Project:</span>
                        <span className="font-medium">Untitled Mind Map</span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">Unsaved</span>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <Undo size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <Redo size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <Search size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <Settings size={20} className="text-gray-600" />
                    </button>
                    <button className="px-3 py-1 bg-black text-white rounded text-sm hover:bg-gray-800 flex items-center space-x-1">
                        <Share size={16} />
                        <span>Share</span>
                    </button>
                    <button className="px-3 py-1 bg-black text-white rounded text-sm hover:bg-gray-800 flex items-center space-x-1">
                        <Save size={16} />
                        <span>Save</span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <MoreHorizontal size={20} className="text-gray-600" />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-900">Mind Map Designer</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('script')}
                            className={`flex-1 px-3 py-2 text-sm font-medium border-b-2 ${activeTab === 'script'
                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Code size={16} className="inline mr-1" />
                            Script
                        </button>
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`flex-1 px-3 py-2 text-sm font-medium border-b-2 ${activeTab === 'ai'
                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Zap size={16} className="inline mr-1" />
                            AI
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {activeTab === 'script' && (
                            <div className="space-y-4">
                                {/* Script Section */}
                                <div>
                                    <h3 className="text-xs font-medium text-gray-900 mb-2">
                                        JavaScript Mind Map Script
                                    </h3>
                                    <textarea
                                        value={scriptCode}
                                        onChange={(e) => setScriptCode(e.target.value)}
                                        className="w-full text-black rounded-md p-3 text-xs font-mono h-[64vh] overflow-y-auto border resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your JavaScript code here..."
                                        style={{
                                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                                        }}
                                    />
                                </div>
                                {/* Execute Button */}
                                <button
                                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 flex items-center justify-center space-x-2"
                                    onClick={() => { }}
                                >
                                    <Play size={16} />
                                    <span>Execute Script</span>
                                </button>

                            </div>
                        )}

                        {activeTab === 'ai' && (
                            <div className="space-y-4">
                                {/* AI Assistant Section */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">AI Assistant</h3>
                                    <textarea
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        placeholder="Describe how you want to modify your mind map..."
                                        className="text-black w-full h-20 p-3 border border-gray-300 rounded text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Generate Button */}
                                <button
                                    className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 flex items-center justify-center space-x-2"
                                    onClick={() => { }}
                                >
                                    <Zap size={16} />
                                    <span>Generate</span>
                                </button>

                                {/* Quick Actions */}
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-800 mb-3 uppercase tracking-wide">Quick Actions</h3>
                                    <div className="space-y-2">
                                        <button
                                            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg border border-transparent hover:border-gray-200 transition-all duration-200 flex items-center justify-between group"
                                            onClick={() => { }}
                                        >
                                            <span>Add Implementation Topics</span>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                        <button
                                            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg border border-transparent hover:border-gray-200 transition-all duration-200 flex items-center justify-between group"
                                            onClick={() => { }}
                                        >
                                            <span>Create Timeline Branch</span>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                        <button
                                            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg border border-transparent hover:border-gray-200 transition-all duration-200 flex items-center justify-between group"
                                            onClick={() => { }}
                                        >
                                            <span>Add Research Section</span>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg border border-transparent hover:border-gray-200 transition-all duration-200 flex items-center justify-between group"
                                            onClick={() => { }}
                                        >
                                            <span>Organize by Priority</span>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-gray-200 space-y-2">
                        <button
                            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 flex items-center justify-center space-x-2"
                            onClick={() => { }}
                        >
                            <Plus size={16} />
                            <span>Add Node</span>
                        </button>
                        <div className="flex space-x-2">
                            <button
                                className="text-black flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center justify-center space-x-1"
                                onClick={() => { }}
                            >
                                <Upload size={16} />
                                <span>Import</span>
                            </button>
                            <button
                                className="text-black flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center justify-center space-x-1"
                                onClick={() => { }}
                            >
                                <Download size={16} />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1 relative">
                    <ExcalidrawWrapper
                        onChange={handleCanvasChange}
                        theme="light"
                        initialData={null}
                        excalidrawAPI={setExcalidrawAPI}
                        className="text-black border border-gray-200 rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}
