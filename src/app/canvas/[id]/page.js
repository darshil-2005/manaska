'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Head from "next/head";
import CoordinatesDisplay from "../../../components/coordinatesDisplay.jsx"
import {
  Share,
  CodeXml,
  Save,
  MoreHorizontal,
  Undo,
  Redo,
  Search,
  Settings,
  Zap,
  FolderUp,
  Code,
  Play,
  Plus,
  Upload,
  X,
  MessageSquare, 
  Download
} from 'lucide-react';
import dynamic from "next/dynamic"; 
import Chat from "@/components/chat.jsx"
import {DSLToExcalidraw} from '../../../utils/DSLToExcalidraw.js';
import {elementsToDSL} from '../../../utils/elementsToDSL.js'
import {Button} from "../../../components/ui/button.tsx"
import {Label} from "../../../components/ui/label.tsx"
import {Switch} from "../../../components/ui/switch.tsx"
import { toast, ToastContainer, Zoom } from "react-toastify";
import {Separator} from "../../../components/ui/separator.tsx"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ModeToggle } from '../../../components/themeToggle.jsx';
import { useTheme } from "next-themes"
import axios from 'axios'
import { useParams } from "next/navigation"

const Editor = dynamic(
  () => import('../../../components/editor.jsx'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="text-gray-500 text-sm">Loading editor...</div>
      </div>
    )
  }
) 

const ExcalidrawWrapper = dynamic(
  () => import('../../../wrapper/excalidraw.js'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="text-gray-500 text-sm">Loading canvas...</div>
      </div>
    )
  }
);

export default function MindMapDesigner({params}) {
    useEffect(() => {
    document.title = "Canvas";
  }, []);

  const router = useRouter();

  const handleCanvasChange = (elements, appState, files) => {
  };

  const defaultValue = `Node "welcomeNode" {
  label: "Welcome",
  fontSize: 40,
  height: 100,
  width: 390,
  x: 400,
  y: 300,
  backgroundColor: "#fff3bf",
  borderColor: "#000000",
  textColor: "#000000",
};`

  const [scriptCode, setScriptCode] = useState(defaultValue);
  const [elements, setElements] = useState(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [debounceIndicator, setDebounceIndicator] = useState(true);  
  const [coordinatesDebounce, setCoordinatesDebounce] = useState(true);
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [exportType, setExportType] = useState('png');
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const {theme, systemTheme} = useTheme();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(undefined);
  const { id } = useParams();
  const [showEditor, setShowEditor] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showExportPopover, setShowExportPopover] = useState(false);
  
  useEffect(() => {

    if (user == undefined || id == undefined) {
      return;
    }

    async function fetchMindmap() {
      
      if (user.userId == undefined || id == undefined) {
        return;
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mindmap`, {
        canvasId: id,
        userId: user.userId,
      })

      let fetchedCode = response.data.map.script;
      if (fetchedCode == null) {
        return;
      }
      setScriptCode(fetchedCode);
      let fetchedMessages = response.data.map.messages;
      setMessages(JSON.parse(fetchedMessages));
    }

    async function loadMindMap() {
      await fetchMindmap();
    }
    loadMindMap();

  }, [user, id]);

    useEffect(() => {
    const time = setTimeout(() => {
      setDebounceIndicator(!debounceIndicator);
    }, 700);
    return () => clearTimeout(time);
  }, [scriptCode, excalidrawAPI]);

  useEffect(() => {
    const time = setTimeout(() => {
      setCoordinatesDebounce(!coordinatesDebounce);
    }, 200);
    return () => clearTimeout(time);
  }, [coordinates]);

  useEffect(() => {
    if (!excalidrawAPI) return;

    const newElementSkeletons = DSLToExcalidraw(scriptCode);
    setElements(newElementSkeletons);
    updateScene(newElementSkeletons);

  }, [debounceIndicator]);   

  const updateScene = async (elementSkeletons) => {
    if (!excalidrawAPI || !elementSkeletons) return;

    const { convertToExcalidrawElements } = await import("@excalidraw/excalidraw");
    const { restoreElements } = await import("@excalidraw/excalidraw");

    let elements = convertToExcalidrawElements(elementSkeletons);
    elements = restoreElements(elements, null, {normalizeIndices: true, repairBindings: true, refreshDimensions: true})

    const sceneData = {
      elements: elements,
      appState: {}
    };
    excalidrawAPI.updateScene(sceneData);
  };

  async function handleElementsToDSL() {
    if (!excalidrawAPI) {

      return -1;
    }
    const elements = excalidrawAPI.getSceneElements();
    const script = elementsToDSL(elements);
    setScriptCode(script);
  };

  async function handleExport() {

    if (!excalidrawAPI) return -1;

    toast.info("Export might take some time. Be patient!");
    setIsExporting(true);

    await new Promise(resolve => setTimeout(resolve, 100));

    const {exportToBlob, exportToSvg} = await import("@excalidraw/excalidraw");
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState?.() ?? {};
    const files = excalidrawAPI.getFiles?.() ?? {};
    let filename;
    let blob;
    appState.exportWithDarkMode = appState.theme == "dark" ? true : false;

    if (exportType == "png") {

    blob = await exportToBlob({
      elements,
      appState,
      files,
      mimeType: "image/png",
      exportPadding: 10,
    });
    filename = "export.png"
    } else if (exportType == "jpeg") {

    blob = await exportToBlob({
      elements,
      appState,
      files,
      mimeType: "image/jpeg",
      exportPadding: 10,
      quality: 1,
    });
    filename = "export.jpeg"

    } else if (exportType == "svg") {

    const svgObj = await exportToSvg({
      elements,
      appState,
      files,
      exportPadding: 10,
    })

      const svgText = new XMLSerializer().serializeToString(svgObj);

      blob = new Blob([svgText], {
        type: "image/svg+xml",
      });
      console.log("Bloh: ", blob)
      filename = "export.svg"

    } else if (exportType == "json") {

      const json = JSON.stringify(
        {
          type: "excalidraw",
          version: 2,
          source: "manaska",
          elements,
          appState,
          files,
        },
        null,
        2
      );

     blob = new Blob([json], { type: "application/json" });
      filename = "export.json"

    } else if (exportType == "markdown") {

    const sceneData = {
      type: "excalidraw",
      version: 2,
      source: "https://excalidraw.com",
      elements,
      appState,
      files,
    };
    
    const markdownContent = `---
    type: excalidraw
    version: 2
    source: https://excalidraw.com
    ---

    \`\`\`excalidraw
    ${JSON.stringify(sceneData, null, 2)}
    \`\`\`
    `;
      blob = new Blob([markdownContent], { type: "text/markdown" });
      filename = "export.excalidraw.md"


    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  }

  const handleSave = async () => {
    if (!excalidrawAPI || !id) {
      console.warn("Unable to save: canvas not ready or id missing");
      return;
    }

    try {
      const elements = excalidrawAPI.getSceneElements
        ? excalidrawAPI.getSceneElements()
        : [];
      const mapCode = elementsToDSL(elements);
      setScriptCode(mapCode);

      const response = await fetch("/api/canvas/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          map_code: mapCode,
          mapId: id,
          messages: JSON.stringify(messages),
        }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        console.error("Failed to save mind map", await response.text());
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Error while saving mind map:", error);
    }
  };

  return (
  <div className="h-screen bg-background flex flex-col">
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
      transition={Zoom}
    />
    
    {/* Header */}
    <header className="bg-background px-2 sm:px-4 py-2 flex border border-border items-center justify-between gap-2">
      {/* Project Info */}
      <div className="flex items-center text-xs sm:text-sm text-muted-foreground truncate min-w-0">
        <span className="truncate">Untitled Mind Map</span>
      </div>
      
      {/* Header Actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 flex-wrap">
        <div className="hidden sm:block">
          <CoordinatesDisplay coordinates={coordinates}/>
        </div>
        
        {/* Grid Toggle */}
        <div className="flex gap-1 sm:gap-2 h-8 sm:h-10 text-xs sm:text-sm font-semibold border border-border items-center px-2 sm:px-3 rounded-lg bg-card">
          <Label className="hidden sm:inline text-card-foreground">Grid</Label>
          <Label className="sm:hidden text-card-foreground">G</Label>
          <Switch value={gridModeEnabled} onCheckedChange={() => setGridModeEnabled(!gridModeEnabled)}/>
        </div>
        
        {/* Mobile Panel Toggles - Only visible on mobile/tablet */}
        <Button
          onClick={() => setShowEditor(!showEditor)}
          className="lg:hidden h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm"
          variant="outline"
        >
          <Code className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline ml-1">Editor</span>
        </Button>
        
        <Button
          onClick={() => setShowChat(!showChat)}
          className="lg:hidden h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm"
          variant="outline"
        >
          <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline ml-1">Chat</span>
        </Button>
        
        {/* Theme Toggle */}
        <div className="hidden md:block">
          <ModeToggle />
        </div>
        
        {/* Sync Script - Hidden on small mobile */}
        <Button
          onClick={handleElementsToDSL}
          className="hidden md:flex h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm"
        >
          <CodeXml className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="ml-1">Sync Script</span>
        </Button>
        
        {/* Save */}
        <Button 
          onClick={handleSave}
          className="h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm"
        >
          <Save className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline ml-1">Save</span>
        </Button>
        
        {/* Export Popover */}
        <Popover open={showExportPopover} onOpenChange={setShowExportPopover}>
          <PopoverTrigger asChild>
            <Button className="h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm">
              <FolderUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1">Export</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-y-3 w-64 bg-popover text-popover-foreground">
            <div className="flex flex-col gap-y-2">
              <div className="text-lg font-semibold">Export Options</div>
              <Separator className="bg-border"/>
            </div>
            <div>
              <Select value={exportType} onValueChange={(d) => setExportType(d)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                </SelectContent>
              </Select>      
            </div>
            <Button onClick={handleExport} disabled={isExporting}>
              {!isExporting && <Download size={16}/>}
              <span>
                {isExporting && (<div className="animate-spin text-2xl">+</div>)}
                {!isExporting && (<div>Download</div>)}
              </span>
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
    
    {/* Main Content Area */}
    <div className="flex-1 overflow-hidden relative">
      {/* Desktop Layout - ResizablePanels visible on large screens */}
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Editor Panel - Hidden on mobile */}
        <ResizablePanel className="bg-background hidden lg:block" defaultSize={25}>
          <Editor scriptCode={scriptCode} setScriptCode={setScriptCode}/>
        </ResizablePanel>
        <ResizableHandle className="w-1 bg-border hidden lg:block"/>
        
        {/* Canvas Panel - Always visible, takes full width on mobile */}
        <ResizablePanel defaultSize={45} className="lg:default">
          <ExcalidrawWrapper
            onChange={handleCanvasChange}
            onPointerUpdate={(event) => {
              setCoordinates([event.pointer.x, event.pointer.y]);
            }}
            theme={theme !== "system" ? theme : systemTheme}
            initialData={null}
            excalidrawAPI={setExcalidrawAPI}
            gridModeEnabled={gridModeEnabled}
            className="text-black border border-border rounded-lg"
          />
        </ResizablePanel>
        
        {/* Chat Panel - Hidden on mobile */}
        <ResizableHandle className="w-1 bg-border hidden lg:block"/>
        <ResizablePanel defaultSize={30} className="hidden lg:block">
          <Chat messages={messages} setMessages={setMessages} scriptCode={scriptCode} setScriptCode={setScriptCode} />
        </ResizablePanel>
      </ResizablePanelGroup>
      
      
      {/* Editor Overlay - Slides in from left */}
      {showEditor && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" 
          onClick={() => setShowEditor(false)}
        >
          <div 
            className="absolute left-0 top-0 bottom-0 w-full sm:w-96 bg-background shadow-2xl border-r border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-3 sm:p-4 border-b border-border bg-card">
                <h2 className="text-base sm:text-lg font-semibold text-card-foreground">Editor</h2>
                <Button 
                  onClick={() => setShowEditor(false)} 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor scriptCode={scriptCode} setScriptCode={setScriptCode}/>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Overlay - Slides in from right */}
      {showChat && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" 
          onClick={() => setShowChat(false)}
        >
          <div 
            className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-background shadow-2xl border-l border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-3 sm:p-4 border-b border-border bg-card">
                <h2 className="text-base sm:text-lg font-semibold text-card-foreground">Chat</h2>
                <Button 
                  onClick={() => setShowChat(false)} 
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <Chat 
                  messages={messages} 
                  setMessages={setMessages} 
                  scriptCode={scriptCode} 
                  setScriptCode={setScriptCode} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}

