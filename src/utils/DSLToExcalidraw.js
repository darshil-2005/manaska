import { randomId } from "./randomIdGenerator.js";
//import {parseMindmapToDSL} from './parseJsonToDSL.js';
import { unquote } from "./removeQuotes.js";
// Removed unused imports: getBaseCoordinates, getPointsArrayForArrows

/**
 * Processes a string element to extract its type, name, and properties object.
 * This version uses robust regex parsing for the properties block.
 * @param {string} element - The raw string representation of the element.
 * @returns {object | number} An object {type, name, properties} or -1 on failure.
 */
function processElement(element) {
  let type;
  let name;

  // --- 1. Get Type ---
  try {
    // Original regex: ^(\s*)\b(Node|Connection)\b
    const typeMatch = element.match(/^(\s*)\b(Node|Connection)\b/);
    if (!typeMatch || !typeMatch[2]) {
      throw new Error("Type match failed.");
    }
    type = typeMatch[2];
  } catch (error) {
    console.log("Error finding type of element.", error);
    return -1;
  }

  if (type !== "Node" && type !== "Connection") {
    console.log("Type of node is not valid.", type);
    return -1;
  }

  // --- 2. Get Name ---
  try {
    // Original regex: \s{1,}"([^"]+)"
    // This captures the ID *inside* the quotes
    const nameMatch = element.match(/\s{1,}"([^"]+)"/);
    if (!nameMatch || !nameMatch[1]) {
      throw new Error("Name match failed.");
    }
    name = nameMatch[1]; // e.g., "welcomeNode"
  } catch (error) {
    console.log("Error capturing programmatic name of node.", error);
    return -1;
  }

  if (name == null || name === undefined) {
    // This check is from the original code
    return -1;
  }

  // --- 3. Get Properties (Robust Regex Version) ---
  let propertiesText;
  try {
    // Use regex to find all content between the first { and last }
    const match = element.match(/{([\s\S]*)}/);
    if (!match || typeof match[1] === "undefined") {
      // No properties block found
      throw new Error("No properties block {} found.");
    }
    propertiesText = match[1].trim();

    // If the block is empty, return properties as an empty object
    if (propertiesText.length === 0) {
      return { type, name, properties: {} };
    }
  } catch (error) {
    console.log("Not a valid Element (Error finding properties block): ", error);
    return -1;
  }

  const properties = {};

  // This regex splits by a comma, ONLY IF that comma is followed by
  // optional whitespace, a "word" (key), optional whitespace, and a colon.
  const propertiesRegex = /,(?=\s*[\w\d_]+\s*:)/g;
  const propertiesArray = propertiesText.split(propertiesRegex);

  // Return the final object as in the original function
  for (const propString of propertiesArray) {
    let key, valueString;
    try {
      const colonIndex = propString.indexOf(":");
      if (colonIndex === -1) continue;

      key = propString.substring(0, colonIndex).trim();
      valueString = propString.substring(colonIndex + 1).trim();

      // Remove any trailing comma leftover from input
      valueString = valueString.replace(/,+\s*$/, "").trim();

      // --- FIX ---
      // Updated logic to handle properties based on the fix in File 1
      if (key === "points" || key === "absoluteStart") {
        // These are now raw JSON, not strings.
        // e.g., points: [[0,0],[...]] or absoluteStart: {"x":430,"y":1500}
        try {
          properties[key] = JSON.parse(valueString);
        } catch (err) {
          // If JSON.parse fails, keep the raw string (safer than crashing)
          console.warn(
            `Failed to JSON.parse(${key}) — saving raw:`,
            valueString,
            err
          );
          properties[key] = valueString;
        }
      } else {
        // Other keys (label, source, etc.) are still strings.
        // e.g., label: "Hello", source: "node-1"
        // Use your unquote helper to remove surrounding " or '
        try {
          properties[key] = unquote(valueString);
        } catch (e) {
          // fall back to raw valueString if unquote fails
          properties[key] = valueString;
        }
      }
    } catch (error) {
      console.log(
        "Not a valid Element because properties cannot be parsed properly: ",
        error,
        "on string:",
        propString
      );
      return -1;
    }
  }
  return { type, name, properties };
}

console.log(
  processElement(` Node "welcomeNode" {
label: "Welcome To: Manaska!!",
height: 50,
width: 200,
x: 400,
y: 300,
backgroundColor: "#fff3bf",
borderColor: "#000000",
textColor: "#000000",
}`)
);

export function DSLToExcalidraw(DSLSrcipt) {
  const elements = DSLSrcipt.split(";").filter(Boolean).filter((d) => d != "\n");
  const processedElements = [];

  for (let i = 0; i < elements.length; i++) {
    const processedElement = processElement(elements[i]);
    if (processedElement == -1) {
      continue;
    }
    processedElements.push(processedElement);
  }

  const excalidrawElements = [];

  // --- OPTIMIZATION ---
  // Create a Map of nodes for fast lookup
  // This avoids the slow O(N^2) loop inside the connection builder
  const nodeMap = new Map();
  for (const el of processedElements) {
    if (el.type === "Node") {
      nodeMap.set(el.name, el);
    }
  }

  for (let i = 0; i < processedElements.length; i++) {
    const currentElement = processedElements[i];

    if (currentElement.type == "Node") {
      let label;
      try {
        // 'label' was already unquoted by processElement
        label = currentElement.properties.label;
      } catch (error) {
        console.log("Error Processing label of the node.");
        label = "No Name!!";
      }

      let backgroundColor;
      try {
        // 'backgroundColor' was already unquoted by processElement
        backgroundColor = currentElement.properties.backgroundColor;
      } catch (error) {
        console.log("Error Processing Background Color");
        backgroundColor = "#fff3bf";
      }

      const node = {
        id: currentElement.name,
        type: currentElement.properties.type ? currentElement.properties.type : "rectangle",
        x: parseFloat(currentElement.properties.x),
        y: parseFloat(currentElement.properties.y),
        height: parseFloat(currentElement.properties.height),
        width: parseFloat(currentElement.properties.width)
          ? parseFloat(currentElement.properties.width)
          : 300,
        backgroundColor,
        strokeColor: currentElement.properties.borderColor,
        strokeStyle: currentElement.properties.borderStyle,
        fillStyle: currentElement.properties.backgroundStyle,
        strokeWidth: currentElement.properties.borderWidth,
        label: {
          text: label,
          fontSize: currentElement.properties.fontSize ? currentElement.properties.fontSize : 20,
        },
        customData: {
          persistentId: currentElement.name,
        }
      };
      excalidrawElements.push(node);
    } else if (currentElement.type == "Connection") {
      let sourceId;
      let targetId;

      try {
        // 'source' and 'target' were already unquoted by processElement
        sourceId = currentElement.properties.source;
        targetId = currentElement.properties.target;
      } catch (error) {
        console.log("Cannot connect the arrows to nodes properly!!");
        continue; // Skip this connection
      }

      // Use the fast Map lookup
      const sourceNode = nodeMap.get(sourceId);
      const targetNode = nodeMap.get(targetId);

      if (!sourceNode) {
        console.warn(`Could not find source node with ID: ${sourceId}`);
        continue;
      }

      if (!targetNode) {
        console.warn(`Could not find target node with ID: ${targetId}`);
        continue;
      }

      const points = currentElement.properties.points;
      const absoluteStart = currentElement.properties.absoluteStart;
      let label;

      if (!points || !absoluteStart) {
        console.warn("Missing points or absoluteStart for connection:", currentElement.name);
        continue;
      }

      try {
        // 'relation' was already unquoted by processElement
        label = currentElement.properties.relation;
      } catch {
        console.log("Unable to process the arrow label.");
        continue;
      }

      const connection = {
        id: currentElement.name, // The connection's own ID
        type: currentElement.properties.type ? currentElement.properties.type : "arrow",
        elbowed: true, // Assuming this is desired
        x: absoluteStart.x,
        y: absoluteStart.y,
        strokeColor: currentElement.properties.arrowColor,
        strokeWidth: currentElement.properties.arrowWidth,
        strokeStyle: currentElement.properties.arrowStyle,
        startArrowhead: "dot",
        endArrowhead: "dot",
        points,
        start: {
          id: sourceId,
        },
        end: {
          id: targetId,
        },
        customData: {
          persistentId: currentElement.name,
        }
      };

      excalidrawElements.push(connection);
    }
  }

  return excalidrawElements;
}
