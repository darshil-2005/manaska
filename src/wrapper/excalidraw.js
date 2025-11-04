'use client';

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
    theme = "light"
}) => {
    const [isClient, setIsClient] = useState(false);
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);

    // Ensure we're on the client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Reset canvas size if it gets too large
    useEffect(() => {
        if (excalidrawAPI) {
            const handleCanvasError = () => {
                try {
                    // Reset zoom to prevent canvas size issues
                    excalidrawAPI.updateScene({
                        appState: {
                            zoom: { value: 1 },
                            scrollX: 0,
                            scrollY: 0
                        }
                    });
                } catch (error) {
                    console.warn('Canvas size reset failed:', error);
                }
            };

            // Listen for canvas errors
            window.addEventListener('error', handleCanvasError);
            return () => window.removeEventListener('error', handleCanvasError);
        }
    }, [excalidrawAPI]);

    // Default initial data with sample mind map nodes
    const defaultInitialData = {
        elements: [
  {
    "id": "RWEgnGH3MJ0jLOUVCFA66",
    "type": "rectangle",
    "x": 0,
    "y": 0,
    "width": 403.63671875,
    "height": 198.06640625,
    "boundElements": [
        { "type": "text", "id": "S588m1VpIsPT0sj-WWIgv" }
    ],
    // "backgroundColor": "transparent",
    // "strokeColor": "#1e1e1e",
    // "strokeWidth": 2,
    // "strokeStyle": "solid",
    // "fillStyle": "solid",
    // "roughness": 1,
    // "opacity": 100,
    // "roundness": { "type": 3 },
    
    // "angle": 0,
    // "groupIds": [],
    // "frameId": null,
    // "link": null,
    // "locked": false,
    // "isDeleted": false,
    // "seed": 268039468,
    // "version": 53,
    // "versionNonce": 1945762708,
    // "updated": 1762150721551,
    // "index": "bEn"
  },
  {
    "id": "S588m1VpIsPT0sj-WWIgv",
    "type": "text",

    // have to find intial x and y manually for each container.
    "x": 20,
    "y": 10,

    "width": 43.19996643066406,
    "height": 25,
    "text": "Hello",
    "fontSize": 20,
    "fontFamily": 5,
    "containerId": "RWEgnGH3MJ0jLOUVCFA66",
    
    // "lineHeight": 1.25,
    // "originalText": "Hello",
    // "autoResize": true,
    // "backgroundColor": "transparent",
    // "strokeColor": "#1e1e1e",
    // "strokeWidth": 2,
    // "strokeStyle": "solid",
    // "fillStyle": "solid",
    // "roughness": 1,
    // "opacity": 100,
    // "groupIds": [],
    // "frameId": null,
    // "link": null,
    // "locked": false,
    // "isDeleted": false,
    // "seed": 504987156,
    // "version": 34,
    // "versionNonce": 1138583828,
    // "updated": 1762150721551,
    // "index": "bEo"
  }
],
        appState: {
            theme: "light",
            viewBackgroundColor: "#ffffff",
            currentItemFillStyle: "solid",
            currentItemStrokeWidth: 1,
            currentItemRoughness: 1,
            currentItemOpacity: 100,
            currentItemFontFamily: 1,
            currentItemFontSize: 12,
            currentItemTextAlign: "left",
            currentItemStrokeColor: "#1e1e1e",
            currentItemBackgroundColor: "transparent",
            gridSize: null,
            colorPalette: {},
            // Prevent canvas from getting too large
            zoom: { value: 1 },
            scrollX: 0,
            scrollY: 0,
            // Limit canvas bounds
            width: 1200,
            height: 800
        }
    };

    // Render only on client side
    if (!isClient) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-white ${className}`}>
                <div className="text-gray-500 text-sm">Loading canvas...</div>
            </div>
        );
    }

    return (
        <>
            <Excalidraw
                initialData={defaultInitialData}
                onChange={onChange}
                theme="light"
                className={`text-black border border-gray-200 rounded-lg ${className}`}
            />
        </>
    );
};

export default ExcalidrawWrapper;
