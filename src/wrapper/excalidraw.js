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
                id: "node1",
                type: "rectangle",
                x: 200,
                y: 100,
                width: 120,
                height: 40,
                backgroundColor: "#e0e7ff",
                strokeColor: "#3b82f6",
                strokeWidth: 1,
                fillStyle: "solid",
                roughness: 1,
                opacity: 100,
                angle: 0,
                strokeSharpness: "sharp",
                seed: 1234567890,
                versionNonce: 123456789,
                isDeleted: false,
                link: null,
                locked: false
            },
            {
                id: "text1",
                type: "text",
                x: 215,
                y: 112,
                width: 90,
                height: 16,
                text: "Target Audience",
                fontSize: 12,
                fontFamily: 1,
                textAlign: "left",
                verticalAlign: "top",
                opacity: 100,
                angle: 0,
                strokeColor: "#1e1e1e",
                backgroundColor: "transparent",
                fillStyle: "hachure",
                strokeWidth: 1,
                strokeSharpness: "sharp",
                roughness: 1,
                seed: 987654321,
                versionNonce: 987654321,
                isDeleted: false,
                link: null,
                locked: false
            },
            {
                id: "node2",
                type: "rectangle",
                x: 400,
                y: 80,
                width: 130,
                height: 40,
                backgroundColor: "#dcfce7",
                strokeColor: "#22c55e",
                strokeWidth: 1,
                fillStyle: "solid",
                roughness: 1,
                opacity: 100,
                angle: 0,
                strokeSharpness: "sharp",
                seed: 1111111111,
                versionNonce: 111111111,
                isDeleted: false,
                link: null,
                locked: false
            },
            {
                id: "text2",
                type: "text",
                x: 415,
                y: 92,
                width: 100,
                height: 16,
                text: "Marketing Campaign",
                fontSize: 12,
                fontFamily: 1,
                textAlign: "left",
                verticalAlign: "top",
                opacity: 100,
                angle: 0,
                strokeColor: "#1e1e1e",
                backgroundColor: "transparent",
                fillStyle: "hachure",
                strokeWidth: 1,
                strokeSharpness: "sharp",
                roughness: 1,
                seed: 222222222,
                versionNonce: 222222222,
                isDeleted: false,
                link: null,
                locked: false
            },
            {
                id: "node3",
                type: "rectangle",
                x: 300,
                y: 200,
                width: 120,
                height: 40,
                backgroundColor: "#fef3c7",
                strokeColor: "#f59e0b",
                strokeWidth: 1,
                fillStyle: "solid",
                roughness: 1,
                opacity: 100,
                angle: 0,
                strokeSharpness: "sharp",
                seed: 333333333,
                versionNonce: 333333333,
                isDeleted: false,
                link: null,
                locked: false
            },
            {
                id: "text3",
                type: "text",
                x: 315,
                y: 212,
                width: 90,
                height: 16,
                text: "Product Launch",
                fontSize: 12,
                fontFamily: 1,
                textAlign: "left",
                verticalAlign: "top",
                opacity: 100,
                angle: 0,
                strokeColor: "#1e1e1e",
                backgroundColor: "transparent",
                fillStyle: "hachure",
                strokeWidth: 1,
                strokeSharpness: "sharp",
                roughness: 1,
                seed: 444444444,
                versionNonce: 444444444,
                isDeleted: false,
                link: null,
                locked: false
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
