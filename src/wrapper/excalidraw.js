"use client";

import "@excalidraw/excalidraw/index.css";
import dynamic from 'next/dynamic';

// Dynamically import Excalidraw to avoid SSR issues
const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-white">
                <div className="text-gray-500 text-sm">Loading canvas...</div>
            </div>
        )
    }
);

const MainMenu = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-white">
                <div className="text-gray-500 text-sm">Loading canvas...</div>
            </div>
        )
    }
);

const ExcalidrawWrapper = ({
    initialData = null,
    onChange = () => { },
    className = "",
    gridModeEnabled,
    theme,
    excalidrawAPI,
    onPointerUpdate
}) => {
 
     return (
        <>
            <Excalidraw
                initialData={initialData}
                onPointerUpdate={onPointerUpdate}
                onChange={onChange}
                theme={theme}
                UIOptions={{
                  canvasActions: {
                    toggleMainMenu: false,
                  }
                }}
                gridModeEnabled={gridModeEnabled}
                className={`text-black border border-gray-200 rounded-lg ${className}`}
                excalidrawAPI={(api) => {
                  if (excalidrawAPI) {
                    excalidrawAPI(api);
                  }
                }}
            >
            </Excalidraw>
        </>
    );
};

export default ExcalidrawWrapper;
