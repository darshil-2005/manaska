import { randomId } from "./randomId.js";
import {getPoints} from "./getPoints.js"
import { unquote } from "./removeQuotes.js";
import { removeCommentsFromDSL } from "./removeCommentsFromDSL.js"

function processElement(element) {
  let type;
  let name;

  try {
    const typeMatch = element.match(/^(\s*)\b(Node|Connection|Text)\b/);
    if (!typeMatch || !typeMatch[2]) {
      throw new Error("Type match failed.");
    }
    type = typeMatch[2];
  } catch (error) {
    console.log("Error finding type of element.", error);
    return -1;
  }

  if (type !== "Node" && type !== "Connection" && type !== "Text") {
    console.log("Type of node is not valid.", type);
    return -1;
  }

  try {
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
    return -1;
  }

  let propertiesText;
  try {
    const match = element.match(/{([\s\S]*)}/);
    if (!match || typeof match[1] === "undefined") {
      throw new Error("No properties block {} found.");
    }
    propertiesText = match[1].trim();

    if (propertiesText.length === 0) {
      return { type, name, properties: {} };
    }
  } catch (error) {
    console.log("Not a valid Element (Error finding properties block): ", error);
    return -1;
  }

  const properties = {};

  const propertiesRegex = /,(?=\s*[\w\d_]+\s*:)/g;
  const propertiesArray = propertiesText.split(propertiesRegex);

  for (const propString of propertiesArray) {
    let key, valueString;
    try {
      const colonIndex = propString.indexOf(":");
      if (colonIndex === -1) continue;

      key = propString.substring(0, colonIndex).trim();
      valueString = propString.substring(colonIndex + 1).trim();

      valueString = valueString.replace(/,+\s*$/, "").trim();

      if (key === "points" || key === "absoluteStart") {
        try {
          properties[key] = JSON.parse(valueString);
        } catch (err) {
          console.warn(
            `Failed to JSON.parse(${key}) — saving raw:`,
            valueString,
            err
          );
          properties[key] = valueString;
        }
      } else {
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

export function DSLToExcalidraw(DSLSrcipt) {
  
  let scriptWithoutComments = removeCommentsFromDSL(DSLSrcipt); 
  const elements = scriptWithoutComments.split(";").filter(Boolean).filter((d) => d != "\n");
  const processedElements = [];

  for (let i = 0; i < elements.length; i++) {
    const processedElement = processElement(elements[i]);
    if (processedElement == -1) {
      continue;
    }
    processedElements.push(processedElement);
  }

  const excalidrawElements = [];

  const nodeMap = new Map();
  for (const el of processedElements) {
    if (el.type === "Node") {
      nodeMap.set(el.name, el);
    }
  }

  let last;

  for (let i = 0; i < processedElements.length; i++) {
    const currentElement = processedElements[i];

    if (currentElement.type == "Node") {
      let label;
      try {
        label = currentElement.properties.label;
      } catch (error) {
        console.log("Error Processing label of the node.");
        label = "No Name!!";
      }

      let backgroundColor;
      try {
        backgroundColor = currentElement.properties.backgroundColor;
      } catch (error) {
        console.log("Error Processing Background Color");
        backgroundColor = "#fff3bf";
      }

      let roundness;
      try {
        roundness = parseInt(currentElement.properties.roundness);
      } catch(error) {
        console.warn("Cannot capture roundness of element Id: ", currentElement.name, "\nError: ", error);
      }


      const node = {
        id: currentElement.name,
        type: currentElement.properties.type ? currentElement.properties.type : "ellipse",
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
        // FIX 1: Fixed roundness logic
        roundness: !isNaN(roundness) ? {type: roundness} : {type: 3},
        label: {
          text: label,
          fontSize: currentElement.properties.fontSize ? currentElement.properties.fontSize : 20,
        },
        customData: {
          persistentId: currentElement.name,
        }
      };
      excalidrawElements.push(node)
    } else if (currentElement.type == "Connection") {
      let sourceId;
      let targetId;

      try {
        sourceId = currentElement.properties.source;
        targetId = currentElement.properties.target;
      } catch (error) {
        console.log("Cannot connect the arrows to nodes properly!!");
        continue;
      }

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

      let points;
      let x;
      let y;
      const arrowMeta = structuredClone(getPoints(processedElements, sourceId, targetId, "radial"));

      if (currentElement?.properties?.points != undefined && currentElement?.properties?.x != undefined && currentElement?.properties?.y != undefined) {
        points = currentElement?.properties?.points;
        let temp = points[0];
        points = points.map((d) => [d[0] - temp[0], d[1] - temp[1]]);
        x = parseFloat(currentElement.properties.x);
        y = parseFloat(currentElement.properties.y);
      } else {
        points = arrowMeta.points;
        // FIX 2: Add null check for absoluteStart
        if (!arrowMeta.absoluteStart) {
          console.warn("Missing points or absoluteStart for connection:", currentElement.name);
          continue;
        }
        x = arrowMeta.absoluteStart.x;
        y = arrowMeta.absoluteStart.y;
      }

      let label;

      if (points == undefined || x == undefined || y == undefined) {
        console.warn("Missing points or absoluteStart for connection:", currentElement.name);
        continue;
      }

      try {
        label = currentElement.properties.relation;
      } catch {
        console.log("Unable to process the arrow label.");
        continue;
      }

      const connection = {
        id: currentElement.name, // The connection's own ID
        type: currentElement.properties.type ? currentElement.properties.type : "arrow",
        x: x,
        y: y,
        strokeColor: currentElement.properties.arrowColor,
        strokeStyle: currentElement.properties.arrowStyle ? currentElement.properties.arrowStyle : "dotted",
        startArrowhead: currentElement.properties.startArrowhead ? currentElement.properties.startArrowhead : "dot",
        endArrowhead: currentElement.properties.endArrowhead ? currentElement.properties.endArrowhead : "dot",
        points: structuredClone(points),
        label: {
          text: label,
          fontSize: currentElement.properties.fontSize,
        },
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

      last = connection;
      excalidrawElements.push(connection);
    } else if(currentElement.type == "Text") {
      const text = {
        id: currentElement.name,
        type: "text",
        x: currentElement.properties.x,
        y: currentElement.properties.y,
        text: currentElement.properties.text,
        fontSize: currentElement.properties.fontSize,
        strokeColor: currentElement.properties.color,
        customData: {
          persistentId: currentElement.name,
        }
      }

      excalidrawElements.push(text);
    }
  }

  return excalidrawElements;
}