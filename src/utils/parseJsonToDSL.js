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
  "id": "quantum_computing_overview",
  "label": "Quantum Computing",
  "relation": "root",
  "children": [
    {
      "id": "qubits_and_superposition",
      "label": "Qubits & Superposition",
      "relation": "subtopic",
      "children": [
        {
          "id": "qubit_definition",
          "label": "Qubit Definition",
          "relation": "subtopic",
          "children": [
            {
              "id": "qubit_states",
              "label": "Qubit States",
              "relation": "subtopic",
              "children": [
                {
                  "id": "qubit_states_0",
                  "label": "0 State",
                  "relation": "subtopic",
                  "children": []
                },
                {
                  "id": "qubit_states_1",
                  "label": "1 State",
                  "relation": "subtopic",
                  "children": []
                },
                {
                  "id": "qubit_states_superposition",
                  "label": "Superposition",
                  "relation": "subtopic",
                  "children": []
                }
              ]
            },
            {
              "id": "qubit_states_measurement",
              "label": "Measurement",
              "relation": "subtopic",
              "children": []
            }
          ]
        },
        {
          "id": "superposition_explanation",
          "label": "Superposition Explanation",
          "relation": "subtopic",
          "children": [
            {
              "id": "superposition_vs_classical",
              "label": "Vs Classical",
              "relation": "subtopic",
              "children": []
            },
            {
              "id": "superposition_advantages",
              "label": "Advantages",
              "relation": "subtopic",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "id": "quantum_gates",
      "label": "Quantum Gates",
      "relation": "subtopic",
      "children": [
        {
          "id": "quantum_gate_types",
          "label": "Gate Types",
          "relation": "subtopic",
          "children": [
            {
              "id": "quantum_gate_types_single",
              "label": "Single-Qubit Gates",
              "relation": "subtopic",
              "children": []
            },
            {
              "id": "quantum_gate_types_multi",
              "label": "Multi-Qubit Gates",
              "relation": "subtopic",
              "children": []
            }
          ]
        },
        {
          "id": "quantum_gate_applications",
          "label": "Gate Applications",
          "relation": "subtopic",
          "children": [
            {
              "id": "quantum_gate_applications_quantum_algorithm",
              "label": "Quantum Algorithm",
              "relation": "subtopic",
              "children": []
            },
            {
              "id": "quantum_gate_applications_quantum_simulation",
              "label": "Quantum Simulation",
              "relation": "subtopic",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "id": "quantum_algorithms",
      "label": "Quantum Algorithms",
      "relation": "subtopic",
      "children": [
        {
          "id": "shor_algorithm",
          "label": "Shor's Algorithm",
          "relation": "subtopic",
          "children": []
        },
        {
          "id": "grover_algorithm",
          "label": "Grover's Algorithm",
          "relation": "subtopic",
          "children": []
        },
        {
          "id": "simons_algorithm",
          "label": "Simons Algorithm",
          "relation": "subtopic",
          "children": []
        }
      ]
    },
    {
      "id": "quantum_computing_applications",
      "label": "Quantum Computing Applications",
      "relation": "subtopic",
      "children": [
        {
          "id": "cryptography",
          "label": "Cryptography",
          "relation": "subtopic",
          "children": []
        },
        {
          "id": "optimization",
          "label": "Optimization",
          "relation": "subtopic",
          "children": []
        },
        {
          "id": "machine_learning",
          "label": "Machine Learning",
          "relation": "subtopic",
          "children": []
        }
      ]
    },
    {
      "id": "quantum_computing_challenges",
      "label": "Quantum Computing Challenges",
      "relation": "subtopic",
      "children": [
        {
          "id": "quantum_noise",
          "label": "Quantum Noise",
          "relation": "subtopic",
          "children": []
        },
        {
          "id": "quantum_error_correction",
          "label": "Quantum Error Correction",
          "relation": "subtopic",
          "children": []
        },
        {
          "id": "scalability",
          "label": "Scalability",
          "relation": "subtopic",
          "children": []
        }
      ]
    }
  ]
};

console.log(parseMindmapToDSL(mindmap));
