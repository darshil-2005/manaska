"use client";

import { useState, useEffect } from 'react';
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

const ExcalidrawWrapper = ({
    initialData = null,
    onChange = () => { },
    className = "",
    theme,
    excalidrawAPI
}) => {
 
     return (
        <>
            <Excalidraw
                initialData={initialData}
                onChange={onChange}
                theme={theme}
                className={`text-black border border-gray-200 rounded-lg ${className}`}
                zenModeEnabled={true}
                excalidrawAPI={(api) => {
                  if (excalidrawAPI) {
                    excalidrawAPI(api);
                  }
                }}
            />
        </>
    );
};

export default ExcalidrawWrapper;
