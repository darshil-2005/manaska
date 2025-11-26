/*
 * @file parseMindmapToDSL.js
 *
 * @brief 
 * Contains the central function parseMindmapToDSL and a bunch of its helper functions.
 *
 * @details
 * This file implements the central callable function parseMindmapToDSL() and helper functions as listed below:
 * - buildNodes()
 * - buildConnections()
 * - extractNodesAndConnections()
 *
 * The parseMindmapToDSL() function takes in a mindmap in json format and processes it completely to convert it into
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
    "label": "Personalized Development Environment Configuration",
    "children": [
        {
            "id": "n1",
            "label": "Zsh Shell Configuration (.zshrc)",
            "children": [
                {
                    "id": "n1a",
                    "label": "Shell Initialization",
                    "children": [
                        {
                            "id": "n1a1",
                            "label": "Starship Prompt Integration (eval \"$(starship init zsh)\")",
                            "children": []
                        }
                    ]
                },
                {
                    "id": "n1b",
                    "label": "Plugin Management",
                    "children": [
                        {
                            "id": "n1b1",
                            "label": "Zsh-Syntax-Highlighting (activate, source)",
                            "children": []
                        },
                        {
                            "id": "n1b2",
                            "label": "Other Plugins (e.g., zsh-autosuggestions)",
                            "children": []
                        }
                    ]
                },
                {
                    "id": "n1c",
                    "label": "Custom Styling & Options",
                    "children": [
                        {
                            "id": "n1c1",
                            "label": "ZSH_HIGHLIGHT_STYLES (e.g., disable underline, set colors)",
                            "children": []
                        },
                        {
                            "id": "n1c2",
                            "label": "Path & Environment Variable Setup",
                            "children": []
                        }
                    ]
                },
                {
                    "id": "n1d",
                    "label": "Sourcing Other Scripts/Configs",
                    "children": [
                        {
                            "id": "n1d1",
                            "label": "Loading specific plugin files or custom functions",
                            "children": []
                        }
                    ]
                }
            ]
        },
        {
            "id": "n2",
            "label": "Terminal Emulator (WezTerm) Configuration",
            "children": [
                {
                    "id": "n2a",
                    "label": "Hosts the Zsh Shell",
                    "children": [
                        {
                            "id": "n2a1",
                            "label": "Defines default shell to launch (e.g., zsh)",
                            "children": []
                        }
                    ]
                },
                {
                    "id": "n2b",
                    "label": "Visuals and Appearance",
                    "children": [
                        {
                            "id": "n2b1",
                            "label": "Font selection and size",
                            "children": []
                        },
                        {
                            "id": "n2b2",
                            "label": "Color scheme (background, foreground, ANSI colors)",
                            "children": []
                        }
                    ]
                },
                {
                    "id": "n2c",
                    "label": "Keybindings & Features",
                    "children": [
                        {
                            "id": "n2c1",
                            "label": "Custom keyboard shortcuts",
                            "children": []
                        },
                        {
                            "id": "n2c2",
                            "label": "Multiplexing (panes, tabs), split management",
                            "children": []
                        }
                    ]
                }
            ]
        },
        {
            "id": "n3",
            "label": "Text Editor (Neovim) Configuration",
            "children": [
                {
                    "id": "n3a",
                    "label": "Runs within Terminal (WezTerm)",
                    "children": [
                        {
                            "id": "n3a1",
                            "label": "Utilizes terminal's font and color settings",
                            "children": []
                        }
                    ]
                },
                {
                    "id": "n3b",
                    "label": "Editor Customization",
                    "children": [
                        {
                            "id": "n3b1",
                            "label": "Plugin management (e.g., Packer, Lazy.nvim)",
                            "children": []
                        },
                        {
                            "id": "n3b2",
                            "label": "Key mappings and shortcuts",
                            "children": []
                        },
                        {
                            "id": "n3b3",
                            "label": "Colorschemes and syntax highlighting",
                            "children": []
                        }
                    ]
                },
                {
                    "id": "n3c",
                    "label": "Shell Integration",
                    "children": [
                        {
                            "id": "n3c1",
                            "label": "Executing shell commands from Neovim (:!cmd)",
                            "children": []
                        },
                        {
                            "id": "n3c2",
                            "label": "Integrated terminal (e.g., :terminal command)",
                            "children": []
                        }
                    ]
                }
            ]
        },
        {
            "id": "n4",
            "label": "Interconnections & Workflow",
            "children": [
                {
                    "id": "n4a",
                    "label": "WezTerm Launches Zsh",
                    "children": [
                        {
                            "id": "n4a1",
                            "label": "Zsh's .zshrc loads prompt (Starship) and plugins (syntax highlighting)",
                            "children": []
                        }
                    ]
                },
                {
                    "id": "n4b",
                    "label": "Zsh Powers Neovim's CLI Interactions",
                    "children": [
                        {
                            "id": "n4b1",
                            "label": "Neovim leverages Zsh for commands, path resolution, and scripts",
                            "children": []
                        }
                    ]
                },
                {
                    "id": "n4c",
                    "label": "Shared Aesthetics & Theming",
                    "children": [
                        {
                            "id": "n4c1",
                            "label": "Consistent fonts and color palettes across all three components",
                            "children": []
                        }
                    ]
                },
                {
                    "id": "n4d",
                    "label": "Dotfile Management",
                    "children": [
                        {
                            "id": "n4d1",
                            "label": "Managing .zshrc, wezterm.lua, and nvim configs in a central repository",
                            "children": []
                        }
                    ]
                }
            ]
        }
    ]
}
