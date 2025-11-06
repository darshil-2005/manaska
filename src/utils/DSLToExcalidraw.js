'use client';

import { randomId } from "./randomIdGenerator.js";
import {parseMindmapToDSL} from './parseJsonToDSL.js';
import {unquote} from "./removeQuotes.js";
import {getBaseCoordinates, getPointsArrayForArrows} from "./arrowCoordinatesHelpers.js"

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

function processElement(element) {

    const type = element.split(" ")[0]?.trim();
    if (type != "Node" && type != "Connection" ) {
      return -1;
    };
    
    const name = element.split("\"")[1]?.trim();

    if (name == null || name == undefined) {
      return -1;
    }
    let propertiesString;
    try {
      propertiesString = element.split("{")[1].split("}")[0].split(",").map(d => d.trim()).filter(Boolean); 
    } catch (error) {
      console.log("Not a valid Element!");
      return -1;
    }

    
    if (propertiesString == null || propertiesString == undefined) {
      return -1;
    }

    const properties = {};
    for (let i = 0; i < propertiesString.length; i++) {
        
        let splitString;
      let key;
      let value;

      try {
        splitString = propertiesString[i].split(":")
        key = splitString[0].trim();
        value = splitString[1].trim();
      } catch (error) {
        console.log("Not a valid Elements because propeties cannot be parsed properl.");
        return -1;
      }

      if (key == null || key == undefined || value == null || value == undefined){
        return -1;
      }
      properties[key] = value;
    }

    return {type, name, properties};
}


export function DSLToExcalidraw(DSLSrcipt) {
    
    const elements = DSLSrcipt.split(";").filter(Boolean).filter(d => d != '\n');
    const processedElements = [];

    for (let i = 0; i < elements.length; i++) {

        const processedElement = processElement(elements[i]);
        if (processedElement == -1) {
          continue;
        }
        processedElements.push(processedElement);
    }

    const excalidrawElements = [];

    for (let i = 0; i< processedElements.length; i++) {
     
      if (processedElements[i].type == "Node") {
      let label;
      
      try {        
        label = unquote(processedElements[i].properties.label);    
      } catch (error) {
        console.log("Error Processing label of the node.");
        label = "No Name!!";
      }

      let backgroundColor;
      try {
        backgroundColor = unquote(processedElements[i].properties.backgroundColor);
      } catch (error) {
        console.log("Error Processing Background Color");
        backgroundColor = "#fff3bf";
      }
      
        const node = {
          id: unquote(processedElements[i].name),
          type: "rectangle",
          x: parseFloat(processedElements[i].properties.x),
          y: parseFloat(processedElements[i].properties.y),
          height: parseFloat(processedElements[i].properties.height),
          width: parseFloat(processedElements[i].properties.width) ? parseFloat(processedElements[i].properties.width) : 300,    
          backgroundColor,
          label: {
            text: label,
            fontSize: 20,
          }
        }
        excalidrawElements.push(node); 
      } else {

        let sourceId;
        let targetId;

        try {
          sourceId = unquote(processedElements[i].properties.source);
          targetId = unquote(processedElements[i].properties.target);
        } catch (error) {
         console.log("Cannot connect the arrows to nodes properly!!");
        }


        let sourceNode = null;
        let targetNode = null;

        for (let j=0; j < processedElements.length; j++) {

          if (processedElements[j].name == sourceId) {
            sourceNode = processedElements[j];
          }

          if (processedElements[j].name == targetId) {
            targetNode = processedElements[j];
          }
        }
        
        if (sourceNode == null) {
          continue;
        };

        if (targetNode == null) {
          continue;
        };
        
        let referenceX;
        let referenceY;
        let relativeEndX;
        let relativeEndY;

        const references = getBaseCoordinates(sourceNode, targetNode);
        referenceX = references.sourceCoordinates[0];
        referenceY = references.sourceCoordinates[1];
        relativeEndX = references.targetCoordinates[0];
        relativeEndY = references.targetCoordinates[1];
        

        const points = getPointsArrayForArrows(relativeEndX, relativeEndY);
        console.log("References: ", references);
        let label;

        try {
          label = unquote(processedElements[i].properties.relation);
        } catch {
          console.log("Unable to process the arrow label.")
          continue;
        }
        console.log("Label: ", processedElements[i].properties.relation);

        const connection = {
          id: processedElements[i].name,
          type: "arrow",
          elbowed: true,

          x: referenceX,
          y: referenceY,
          points: [
            [0, 0],
            [relativeEndX, relativeEndY],
          ],
          label: {
            text: label,  
          },
          start: {
            id: sourceId,
          },
          end: {
            id: targetId,
          }
        }

        excalidrawElements.push(connection);
      }
    }
    return excalidrawElements;
};
