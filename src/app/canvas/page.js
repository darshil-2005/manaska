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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable"
import { ModeToggle } from '../../components/themeToggle.jsx';
import { useTheme } from "next-themes"
import Editor from"../../components/editor.jsx"

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
    console.log('Canvas updated:', elements);
  };


  const defaultValue = `Node "welcomeNode" {
  label: "Welcome To Manaska!!",
  height: 100,
  width: 390,
  x: 400,
  y: 300,
  backgroundColor: "#fff3bf",
  borderColor: "#000000",
  textColor: "#000000",
};`


  const [scriptCode, setScriptCode] = useState(defaultValue);
  const [activeTab, setActiveTab] = useState('script');
  const [aiPrompt, setAiPrompt] = useState('');
  const [elements, setElements] = useState(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [debounceIndicator, setDebounceIndicator] = useState(true);  
  const [coordinates, setCoordinates] = useState([0, 0]);

  const {theme, systemTheme} = useTheme();

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

    console.log("Elements: ", elementSkeletons);

    const sceneData = {
      elements: convertToExcalidrawElements(elementSkeletons),
      appState: {},
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
    <div className="h-screen bg-backgorund flex flex-col">
    {/* Header */}
    <header className="bg-backgorund px-4 py-2 flex border items-center justify-between">
    <div className="flex items-center space-x-4">
    {/* Project Info */}
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
    <span>Project:</span>
    <span className="font-medium">Untitled Mind Map</span>
    <span className="bg-muted-foreground text-primary px-2 py-1 rounded text-xs">Unsaved</span>
    </div>
    </div>

    {/* Header Actions */}
    <div className="flex items-center space-x-2">
    <Button
    onClick={handleElementsToDSL}
    >
    <Play size={16} />
    <span>Generate Script</span>
    </Button>

    <ModeToggle />

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

    <ResizablePanelGroup direction="horizontal">

    <ResizablePanel className="bg-backgorund" defaultSize={25}>
      <Editor scriptCode={scriptCode} setScriptCode={setScriptCode}/>
    </ResizablePanel>

    <ResizableHandle className="w-1"/>

    {/* Main Canvas Area */}
    <ResizablePanel defaultSize={75}>
    <ExcalidrawWrapper
    onChange={handleCanvasChange}
    onPointerUpdate={(event) => {
      setCoordinates([event.pointer.x, event.pointer.y]);
    }}
    theme={theme != "system" ? theme : systemTheme}
    initialData={null}
    excalidrawAPI={setExcalidrawAPI}
    className="text-black border border-gray-200 rounded-lg"
    />
    </ResizablePanel>

    </ResizablePanelGroup>

    </div>
  );
}
