'use client';

import { use, useState, useEffect } from 'react';

// COMPONENTS
import CoordinatesDisplay from "../../../components/coordinatesDisplay.jsx";
import { Button } from "../../../components/ui/button.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { Switch } from "../../../components/ui/switch.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import { ModeToggle } from "../../../components/themeToggle.jsx";

// SELECT + POPOVER + RESIZABLE
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select.tsx";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover.tsx";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../../components/ui/resizable.tsx";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

// EDITOR + EXCALIDRAW
const Editor = dynamic(() => import('../../../components/editor.jsx'), { ssr: false });
const ExcalidrawWrapper = dynamic(() => import('../../../wrapper/excalidraw.js'), { ssr: false });

// DSL UTILS
import { DSLToExcalidraw } from "../../../utils/DSLToExcalidraw.js";
import { elementsToDSL } from "../../../utils/elementsToDSL.js";

export default function CanvasPage({ params }) {

  const { id } = use(params);

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
  };`;

  const [scriptCode, setScriptCode] = useState(defaultValue);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [exportType, setExportType] = useState("png");
  const [gridModeEnabled, setGridModeEnabled] = useState(false);

  const { theme, systemTheme } = useTheme();

  // -------------------------------
  // DSL → CONVERT → UPDATE CANVAS
  // -------------------------------
  useEffect(() => {
    if (!excalidrawAPI) return;

    const skeletons = DSLToExcalidraw(scriptCode);
    updateScene(skeletons);

  }, [scriptCode, excalidrawAPI]);

  const updateScene = async (skeletons) => {
    if (!excalidrawAPI || !skeletons) return;

    const { convertToExcalidrawElements, restoreElements } = await import("@excalidraw/excalidraw");

    let restored = restoreElements(skeletons, null, {
      normalizeIndices: true,
      repairBindings: true,
      refreshDimensions: true
    });

    const converted = convertToExcalidrawElements(skeletons);

    excalidrawAPI.updateScene({
      elements: converted,
      appState: {}
    });
  };

  return (
    <div className="h-screen bg-background flex flex-col">

      {/* HEADER */}
      <header className="bg-background px-4 py-2 flex border items-center justify-between">

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          Mind Map ID: <span className="font-semibold">{id}</span>
        </div>

        <div className="flex items-center space-x-2">

          <CoordinatesDisplay coordinates={coordinates} />

          <div className="flex gap-x-2 h-10 font-semibold border items-center px-3 rounded-lg">
            <Label>Grid</Label>
            <Switch
              value={gridModeEnabled}
              onCheckedChange={() => setGridModeEnabled(!gridModeEnabled)}
            />
          </div>

          <ModeToggle />

          <Button>Generate Script</Button>
          <Button>Share</Button>
          <Button>Save</Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button>Export</Button>
            </PopoverTrigger>

            <PopoverContent className="flex flex-col gap-y-3">
              
              <div className="text-lg font-semibold">Export Options</div>
              <Separator />

              <Select value={exportType} onValueChange={setExportType}>
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

            </PopoverContent>
          </Popover>

        </div>
      </header>

      {/* CANVAS + EDITOR */}
      <ResizablePanelGroup direction="horizontal">

        <ResizablePanel defaultSize={25}>
          <Editor scriptCode={scriptCode} setScriptCode={setScriptCode} />
        </ResizablePanel>

        <ResizableHandle className="w-1" />

        <ResizablePanel defaultSize={75}>
          <ExcalidrawWrapper
            onChange={() => {}}
            onPointerUpdate={(e) => setCoordinates([e.pointer.x, e.pointer.y])}
            theme={theme !== "system" ? theme : systemTheme}
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
