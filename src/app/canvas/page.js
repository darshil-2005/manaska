'use client';

import { useState, useEffect } from 'react';
import CoordinatesDisplay from "../../components/coordinatesDisplay.jsx"
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
  Download
} from 'lucide-react';
import dynamic from "next/dynamic"; 
import {DSLToExcalidraw} from '../../utils/DSLToExcalidraw.js';
import {elementsToDSL} from '../../utils/elementsToDSL.js'
import {Button} from "../../components/ui/button.tsx"
import {Label} from "../../components/ui/label.tsx"
import {Switch} from "../../components/ui/switch.tsx"
import {Separator} from "../../components/ui/separator.tsx"
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
} from "../../components/ui/resizable"
import { ModeToggle } from '../../components/themeToggle.jsx';
import { useTheme } from "next-themes"

const Editor = dynamic(
  () => import('../../components/editor.jsx'),
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
  const {theme, systemTheme} = useTheme();

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

    let elements = restoreElements(elementSkeletons, null, {normalizeIndices: true, repairBindings: true, refreshDimensions: true})
    elements = convertToExcalidrawElements(elementSkeletons);

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
  };

  function handleExport() {
    console.log("Export Type: ", exportType);
  }



  return (
    <div className="h-screen bg-backgorund flex flex-col">
    {/* Header */}
    <header className="bg-backgorund px-4 py-2 flex border items-center justify-between">
    {/* Project Info */}
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
    Untitled Mind Map
    </div>

    {/* Header Actions */}
    <div className="flex items-center space-x-2">

    <CoordinatesDisplay coordinates={coordinates}/>
   
    <div className="flex tracking-wider gap-x-2 h-10 font-semibold border items-center px-3 rounded-lg">
      <Label>Grid</Label>
      <Switch value={gridModeEnabled} onCheckedChange={() => setGridModeEnabled(!gridModeEnabled)}/>
    </div>
   <ModeToggle />
    <Button
    onClick={handleElementsToDSL}
    >
    <CodeXml size={16} />
    <span>Generate Script</span>
    </Button>
    <Button>
    <Share size={16} />
    <span>Share</span>
    </Button>
    <Button>
    <Save size={16} />
    <span>Save</span>
    </Button>

    <Popover>
    <PopoverTrigger asChild>
    <Button>
    <FolderUp size={16} />
    <span>Export</span>
    </Button>
    </PopoverTrigger>

    <PopoverContent className="flex flex-col gap-y-3">

    <div className="flex flex-col gap-y-2">
    <div className="text-lg font-semibold">
    Export Options
    </div>
    <Separator/>
    </div>

    <div className="">
    <Select value={exportType} onValueChange={(d) => setExportType(d)}>
    <SelectTrigger className="w-full">
    <SelectValue placeholder="File Type" />
    </SelectTrigger>
    <SelectContent>
    <SelectItem value="png">PNG</SelectItem>
    <SelectItem value="jpeg">JPEG</SelectItem>
    <SelectItem value="svg">SVG</SelectItem>
    <SelectItem value="json">JSON</SelectItem>
    <SelectItem value="webp">WEBP</SelectItem>
    </SelectContent>
    </Select>      
    </div>

    <Button onClick={handleExport}>
      <Download size={16}/>
      <span>Download</span>
    </Button>

    </PopoverContent>
    </Popover>

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
    gridModeEnabled={gridModeEnabled}
    className="text-black border border-gray-200 rounded-lg"
    />
    </ResizablePanel>

    </ResizablePanelGroup>

    </div>
  );
}
