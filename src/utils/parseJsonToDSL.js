import { json } from "stream/consumers";
import { randomId } from "./randomIdGenerator.js";

// Defaults
const NODE_HEIGHT = 200;
const NODE_WIDTH = 400;
const NODE_BACKGROUND_COLOR = `#3bc9db`;
const NODE_TEXT_COLOR = `#000000`;
const NODE_BORDER_COLOR = `#000000`;
const RANGE = 1000;

/**
 *
 * @param {*} n
 * @param {*} range
 *
 * @brief Returns an array of coordinates that arranges n nodes in the space of (0, 0) to (range, range).
 *
 * @return An Array of coordinates for each node.
 */
function getCoordinates(n, range) {
  const center = { x: range / 2, y: range / 2 };
  const radius = range / 2;

  const angleStep = (2 * Math.PI) / n;
  const angleVec = [];

  for (let i = 0; i < n; i++) {
    angleVec.push((i * angleStep).toFixed(2));
  }

  const coordinates = [];

  for (let i = 0; i < n; i++) {
    let x = center.x + radius * Math.cos(angleVec[i]);
    let y = center.y + radius * Math.sin(angleVec[i]);

    coordinates.push({ x, y });
  }

  return coordinates;
}

function buildNodes(jsonNode, coordinate) {
  const script =
    `Node "${jsonNode.id}" {\n` +
    `  label: "${jsonNode.label}",\n` +
    `  height: ${NODE_HEIGHT},\n` +
    `  width: ${NODE_WIDTH},\n` +
    `  x: ${coordinate.x},\n` +
    `  y: ${coordinate.y},\n` +
    `  backgroundColor: "${NODE_BACKGROUND_COLOR}",\n` +
    `  borderColor: "${NODE_BORDER_COLOR}",\n` +
    `  textColor: "${NODE_TEXT_COLOR}",\n` +
    `};\n`;

  return script;
}

function buildConnections(jsonConnection) {
  const source = jsonConnection.source;
  const target = jsonConnection.target;
  const relation = jsonConnection.relation;
  const id = randomId();

  const script =
    `Connection "${id}" {\n` +
    `  source: "${source}",\n` +
    `  target: "${target}",\n` +
    `  relation: "${relation}",\n` +
    `};\n`;

  return script;
}

function parseMindmapToBlocks(mindmap) {
  if (!mindmap) {
    return -1;
  }

  // Processing Nodes
  const jsonNodes = mindmap["nodes"];

  if (!jsonNodes) {
    return -1;
  }

  const n = jsonNodes.length;
  const coordinates = getCoordinates(n, RANGE);

  const nodes = [];
  const connections = [];

  for (let i = 0; i < jsonNodes.length; i++) {
    const node = buildNodes(jsonNodes[i], coordinates[i]);
    nodes.push(node);
  }

  //Processing Connections

  const jsonConnection = mindmap["edges"];
  const m = jsonConnection.length;

  if (!jsonConnection) {
    return -1;
  }

  for (let i = 0; i < m; i++) {
    const connection = buildConnections(jsonConnection[i]);
    connections.push(connection);
  }

  const script = nodes.join("\n") + connections.join("\n");
  console.log(script);
}

/* ---------------------------
   Example usage with your mindmap JSON
   --------------------------- */

const mindmap = {
  nodes: [
    { id: "discrete_speech_processing", label: "Discrete Speech Processing" },
    { id: "speech_signal", label: "Speech Signal" },
    { id: "digitization", label: "Digitization" },
    { id: "feature_extraction", label: "Feature Extraction" },
    { id: "quantization", label: "Quantization" },
    { id: "speech_units", label: "Speech Units" },
    { id: "pattern_recognition", label: "Pattern Recognition" },
    { id: "applications", label: "Applications" },
    { id: "speech_recognition", label: "Speech Recognition" },
    { id: "speaker_identification", label: "Speaker Identification" },
    { id: "speech_synthesis", label: "Speech Synthesis" },
  ],
  edges: [
    {
      source: "discrete_speech_processing",
      target: "speech_signal",
      relation: "processes",
    },
    {
      source: "speech_signal",
      target: "digitization",
      relation: "converted_by",
    },
    {
      source: "digitization",
      target: "feature_extraction",
      relation: "enables",
    },
    {
      source: "feature_extraction",
      target: "quantization",
      relation: "followed_by",
    },
    { source: "quantization", target: "speech_units", relation: "produces" },
    {
      source: "speech_units",
      target: "pattern_recognition",
      relation: "used_in",
    },
    {
      source: "pattern_recognition",
      target: "applications",
      relation: "applied_in",
    },
    {
      source: "applications",
      target: "speech_recognition",
      relation: "includes",
    },
    {
      source: "applications",
      target: "speaker_identification",
      relation: "includes",
    },
    {
      source: "applications",
      target: "speech_synthesis",
      relation: "includes",
    },
  ],
};

parseMindmapToBlocks(mindmap);

