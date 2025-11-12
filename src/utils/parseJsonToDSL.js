import { randomId } from "./randomId.js";
import { layoutMindmap } from "./getDimensions.js"; // Corrected typo "Diminsions"

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
        label: `${inputNode.label} → ${child.label}`,
        absoluteStart: { x: parentBottomX, y: parentBottomY },
        points: relPoints,
      });
    }
  }

  return { nodes, connections };
}

export function parseMindmapToDSL(mindmap) {
  if (!mindmap) {
    return -1;
  }

  const mapWithCoodinates = layoutMindmap(mindmap, {
    dx: 400,
    dy: 400,
    marginX: 600,
    marginY: 80,
    orientation: "horizontal",
    factor: 12,
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
  "id": "discrete_speech_processing",
  "label": "Discrete Speech Processing",
  "relation": "root",
  "children": [
    {
      "id": "speech_signal",
      "label": "Speech Signal",
      "relation": "subtopic",
      "children": [
        { "id": "digitization", "label": "Digitization", "relation": "subtopic", "children": [] }
      ]
    },
    {
      "id": "feature_extraction",
      "label": "Feature Extraction",
      "relation": "subtopic",
      "children": [
        { "id": "spectral", "label": "Spectral Features", "relation": "subtopic", "children": [] }
      ]
    },
    {
      "id": "speech_modeling",
      "label": "Speech Modeling",
      "relation": "subtopic",
      "children": [
        { "id": "source_filter", "label": "Source-Filter Model", "relation": "subtopic", "children": [] }
      ]
    },
    {
      "id": "applications",
      "label": "Applications",
      "relation": "subtopic",
      "children": [
        { "id": "speech_recognition", "label": "Speech Recognition", "relation": "subtopic", "children": [] }
      ]
    },
    {
      "id": "evaluation_metrics",
      "label": "Evaluation Metrics",
      "relation": "subtopic",
      "children": [
        { "id": "objective_metrics", "label": "Objective Metrics", "relation": "subtopic", "children": [] }
      ]
    }
  ]
}

console.log(parseMindmapToDSL(mindmap));
