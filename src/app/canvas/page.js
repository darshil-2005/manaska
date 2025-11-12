'use client';

import { useState, useEffect } from 'react';
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
import {elementsToDSL} from '../../utils/elementsToDSL.js'
import {Textarea} from "../../components/ui/textarea.tsx"
import {Button} from "../../components/ui/button.tsx"

const ExcalidrawWrapper = dynamic(
  () => import('../../wrapper/excalidraw.js'), // Adjust your path as needed
  {
    ssr: false, // This is the most important part
    loading: () => (
        <div className="w-full h-screen flex items-center justify-center bg-white">
            <div className="text-gray-500 text-sm">Loading canvas...</div>
        </div>
    )
  }
);


export default function MindMapDesigner() {
    const handleCanvasChange = (elements, appState, files) => {
        //console.log('Canvas updated:', elements);
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
    const [debounceIndicator, setDebounceIndicator] = useState(true);  
    const [coordinates, setCoordinates] = useState([0, 0]);

  useEffect(() => {

    const time = setTimeout(() => {
      setDebounceIndicator(!debounceIndicator);
    }, 700);
    return () => clearTimeout(time);
  }, [scriptCode, excalidrawAPI]);

   useEffect(() => {
        if (!excalidrawAPI) return;

        const newElementSkeletons = DSLToExcalidraw(scriptCode);
        setElements(newElementSkeletons);
        updateScene(newElementSkeletons);

    }, [debounceIndicator]);   
    
 const updateScene = async (elementSkeletons) => {
        if (!excalidrawAPI || !elementSkeletons) return;

        const { convertToExcalidrawElements } = await import("@excalidraw/excalidraw");
            
        const sceneData = {
          elements: convertToExcalidrawElements(elementSkeletons),
            appState:{

            },
        };
        excalidrawAPI.updateScene(sceneData);
    };

async function handleElementsToDSL() {
  if (!excalidrawAPI) {
   
    return -1;
  }
  const elements = excalidrawAPI.getSceneElements();
  const script = elementsToDSL(elements);
};



    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                              {/* Project Info */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Project:</span>
                        <span className="font-medium">Untitled Mind Map</span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">Unsaved</span>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center space-x-2">
                    <Button variant={"outline"}>
                        <Undo size={20}  />
                    </Button>
                    <Button variant={"outline"}>
                        <Redo size={20}  />
                    </Button>
                    <Button>
                        <Share size={16} />
                        <span>Share</span>
                    </Button>
                    <Button>
                        <Save size={16} />
                        <span>Save</span>
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                          {/* Content Area */}
                    <div className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                                {/* Script Section */}
                                <div>
                                    <h3 className="text-lg text-primary mb-2">
                                        Script
                                    </h3>
                                    <Textarea
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
                                <Button
                                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 flex items-center justify-center space-x-2"
                                    onClick={handleElementsToDSL}
                                >
                                    <Play size={16} />
                                    <span>Generate Script</span>
                                </Button>

                            </div>
      </div>
      </div>

                {/* Main Canvas Area */}
                <div className="flex-1 relative">
                    <ExcalidrawWrapper
                        onChange={handleCanvasChange}
                        onPointerUpdate={(event) => {
                          setCoordinates([event.pointer.x, event.pointer.y]);
                        }}
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
