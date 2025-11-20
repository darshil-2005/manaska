/*
 * @file parseJsonToDSL.js
 *
 * @brief 
 * Contains the central function parseJsonToDSL and a bunch of its helper functions.
 *
 * @details
 * This file implements the central callable function parseJsonToDSL() and helper functions as listed below:
 * - buildNodes()
 * - buildConnections()
 * - extractNodesAndConnections()
 *
 * The parseJsonToDSL() function takes in a mindmap in json format and processes it completely to convert it into
 * custom DSL script as defined in the Manaska docs.
 *
 * The function can arrange mindmap in 3 ways:
 * - Horizontal
 * - Vertical
 * - Radial
 *
 * The function first calls the function layoutMindmap() to get all nodes to have there x, y, height, width. Then the 
 * function calls extractNodesAndConnections() and flatten the recursively arranged json mindmap into a flat array of
 * mindmap elements which are of type either "Node" or "Connection".
 *
 * The function then passes the individual elements of the mindmap into either buildNodes() or buildConnections() function
 * depending on there type. Both these functions return DSL script of that particular element. The script of individual
 * elements is combined to form the DSL script of whole mindmap.
 *
 *
 * @author
 * Darshil Gandhi (202301056)
 *
 * */

import { randomId } from "./randomId.js";
import { layoutMindmap } from "./layoutMindmap.js";

// Defaults
const NODE_BACKGROUND_COLOR = `#3bc9db`;
const NODE_TEXT_COLOR = `#000000`;
const NODE_BORDER_COLOR = `#000000`;

function buildNodes(jsonNode) {
  const script =
    `Node "${jsonNode.id}" {\n` +
    `  label: "${jsonNode.label}",\n` +
    `  height: ${jsonNode.height},\n` +
    `  width: ${jsonNode.width},\n` +
    `  x: ${jsonNode.x},\n` +
    `  y: ${jsonNode.y},\n` +
    `  backgroundColor: "${NODE_BACKGROUND_COLOR}",\n` +
    `  borderColor: "${NODE_BORDER_COLOR}",\n` +
    `  textColor: "${NODE_TEXT_COLOR}",\n` +
    `};\n`;

  return script;
}

function buildConnections(jsonConnection) {
  const source = jsonConnection.source;
  const target = jsonConnection.target;
  const relation = jsonConnection.label;
  const id = randomId();

  const script =
    `Connection "${id}" {\n` +
    `  source: "${source}",\n` +
    `  target: "${target}",\n` +
    `  relation: "${relation}",\n` +
    `};\n`;

  return script;
}

function extractNodesAndConnections(
  inputNode,
  depth = 0,
  parent = null,
  nodeSize = { w: 240, h: 100 }
) {
  if (!inputNode) return { nodes: [], connections: [] };

  const thisWidth =
    typeof inputNode.width === "number" ? inputNode.width : nodeSize.w;
  const thisHeight =
    typeof inputNode.height === "number" ? inputNode.height : nodeSize.h;

  const node = {
    id: inputNode.id,
    label: inputNode.label,
    depth,
    parent,
    x: inputNode.x,
    y: inputNode.y,
    width: thisWidth,
    height: thisHeight,
  };

  let nodes = [node];
  let connections = [];

  if (Array.isArray(inputNode.children) && inputNode.children.length > 0) {
    for (const child of inputNode.children) {
      const { nodes: childNodes, connections: childConnections } =
        extractNodesAndConnections(child, depth + 1, inputNode.id, nodeSize);

      nodes = nodes.concat(childNodes);
      connections = connections.concat(childConnections);

      const childWidth =
        typeof child.width === "number" ? child.width : nodeSize.w;
      const childHeight =
        typeof child.height === "number" ? child.height : nodeSize.h;

      if (
        typeof inputNode.x !== "number" ||
        typeof inputNode.y !== "number" ||
        typeof child.x !== "number" ||
        typeof child.y !== "number"
      ) {
        continue;
      }

      const parentBottomX = inputNode.x + thisWidth / 2;
      const parentBottomY = inputNode.y + thisHeight;
      const childTopX = child.x + childWidth / 2;
      const childTopY = child.y;
      const midY = parentBottomY + (childTopY - parentBottomY) / 2;

      const absPoints = [
        [parentBottomX, parentBottomY], // absolute start
        [parentBottomX, midY],
        [childTopX, midY],
        [childTopX, childTopY], // absolute end at child's top midpoint
      ];

      const relPoints = absPoints.map(([ax, ay]) => [
        ax - parentBottomX,
        ay - parentBottomY,
      ]);

      connections.push({
        source: inputNode.id,
        target: child.id,
        label: `${inputNode.label}`,
      });
    }
  }

  return { nodes, connections };
}

export function parseMindmapToDSL(mindmap, type="horizontal") {

  if (!mindmap) {
    return -1;
  }
  
  //TODO: Examine options for each case properly - (Darshil)
  const mapWithCoodinates = layoutMindmap(mindmap, type, {
    dx: 400,
    dy: 400,
    marginX: 600,
    marginY: 80,
    factor: 8,
    minWidth: 220,
  });

  const laidOut = extractNodesAndConnections(mapWithCoodinates, 1, "root");

  const scriptNodes = [];
  const scriptConnections = [];

  for (let i = 0; i < laidOut.nodes.length; i++) {
    const SNode = buildNodes(laidOut.nodes[i]);
    scriptNodes.push(SNode);
  }

  for (let i = 0; i < laidOut.connections.length; i++) {
    const SConnection = buildConnections(laidOut.connections[i]);
    scriptConnections.push(SConnection);
  }

  const script = scriptNodes.join("\n") + "\n" + scriptConnections.join("\n");
  return script;
}


const mindmap = 
{
  "id": "root",
  "label": "Line Codes",
  "children": [
    {
      "id": "lc1",
      "label": "Definition",
      "children": [
        {
          "id": "lc1a",
          "label": "Binary 1s and 0s → electrical pulses (waveforms)",
          "children": []
        },
        {
          "id": "lc1b",
          "label": "Used for transmission over channels",
          "children": []
        },
        {
          "id": "lc1c",
          "label": "Also called: Line Coding / Transmission Coding",
          "children": []
        }
      ]
    },

    {
      "id": "lc2",
      "label": "Major Categories",
      "children": [
        {
          "id": "lc2a",
          "label": "RZ (Return-to-Zero)",
          "children": [
            { "id": "lc2a1", "label": "Waveform returns to zero within Tb", "children": [] },
            { "id": "lc2a2", "label": "Typically returns after half-bit interval", "children": [] }
          ]
        },
        {
          "id": "lc2b",
          "label": "NRZ (Non-Return-to-Zero)",
          "children": [
            { "id": "lc2b1", "label": "Signal does NOT return to zero in Tb", "children": [] }
          ]
        }
      ]
    },

    {
      "id": "lc3",
      "label": "Voltage-Level Classification",
      "children": [
        {
          "id": "lc3a",
          "label": "Unipolar",
          "children": [
            { "id": "lc3a1", "label": "1 = +A volts", "children": [] },
            { "id": "lc3a2", "label": "0 = 0 volts (ground)", "children": [] },
            { "id": "lc3a3", "label": "Also called On-Off Keying", "children": [] }
          ]
        },

        {
          "id": "lc3b",
          "label": "Polar",
          "children": [
            { "id": "lc3b1", "label": "1 and 0 use equal +ve and -ve levels", "children": [] }
          ]
        },

        {
          "id": "lc3c",
          "label": "Bipolar (Pseudoternary / AMI)",
          "children": [
            { "id": "lc3c1", "label": "Three levels used: +A, 0, -A", "children": [] },
            { "id": "lc3c2", "label": "1 = alternates +A and -A", "children": [] },
            { "id": "lc3c3", "label": "0 = 0 volts", "children": [] }
          ]
        }
      ]
    },

    {
      "id": "lc4",
      "label": "Manchester Coding",
      "children": [
        {
          "id": "lc4a",
          "label": "1 → +ve half-bit then -ve half-bit",
          "children": []
        },
        {
          "id": "lc4b",
          "label": "0 → -ve half-bit then +ve half-bit",
          "children": []
        },
        {
          "id": "lc4c",
          "label": "Self-clocking, no DC component",
          "children": []
        },
        {
          "id": "lc4d",
          "label": "Terminology follows telephone industry",
          "children": []
        }
      ]
    },

    {
      "id": "lc5",
      "label": "Spectrum Considerations",
      "children": [
        {
          "id": "lc5a",
          "label": "Spectrum usage is important for PCM",
          "children": []
        },
        {
          "id": "lc5b",
          "label": "PCM requires minimum NB Hz",
          "children": []
        },
        {
          "id": "lc5c",
          "label": "Exact bandwidth depends on line code used",
          "children": []
        },
        {
          "id": "lc5d",
          "label": "For spectrum calculations → refer to Couch’s book",
          "children": []
        }
      ]
    },

    {
      "id": "lc6",
      "label": "Benefits & Issues",
      "children": [
        {
          "id": "lc6a",
          "label": "Different line codes have different advantages",
          "children": []
        },
        {
          "id": "lc6b",
          "label": "Refer to Lathi or Couch for detailed comparisons",
          "children": []
        }
      ]
    }
  ]
}
console.log(parseMindmapToDSL(mindmap, "radial"));
