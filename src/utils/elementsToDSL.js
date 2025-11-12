import {randomId} from "./randomId.js"
 
export function elementsToDSL(elements) {

  const scriptElements = [];
  
  for (let i=0; i < elements.length; i++) {

    const element = elements[i];

    if (element.customData?.persistentId == undefined) {
      element.customData= {persistentId: randomId()};
    }

    if (element.type == "rectangle" || element.type == "diamond" || element.type == "ellipse") {
      
      const labelElementId = element.boundElements.find(d => d.type == "text")?.id;
      let label;
      if (labelElementId == undefined) {
        label: "Unnamed";
      } else {
        label = elements.find(d => d.id == labelElementId);        
      }


      const node = `Node "${element.customData.persistentId}" {\n` +
                    `  label: "${label.originalText}",\n` + 
                    `  type: "${element.type}",\n` +
                    `  height: ${element.height},\n` +
                    `  width: ${element.width},\n` +
                    `  x: ${element.x},\n` +
                    `  y: ${element.y},\n` +
                    `  backgroundColor: "${element.backgroundColor}",\n` +
                    `  borderColor: "${element.strokeColor}",\n` +
                    `  borderStyle: "${element.strokeStyle}",\n` +
                    `  backgroundStyle: "${element.fillStyle}",\n` +
                    `  borderWidth: ${element.strokeWidth},\n` +
                    `  textColor: "${label.strokeColor}",\n` +
                    `  fontSize: ${label.fontSize},\n` +
                    `};\n`;

       scriptElements.push(node);             
    } else if (element.type == "text" && element.containerId == null) {
      
      const text = `Text "${element.customData.persistentId}" {\n` +
                   `  type: "${element.type}",\n` +
                   `  text: "${element.originalText}",\n` +
                   `  x: ${element.x},\n` +
                   `  y: ${element.y},\n` +
                   `  fontSize: ${element.fontSize},\n` +
                   `  color: ${element.strokeColor},\n` +
                   `};\n`;
      scriptElements.push(text);
    } else if (element.type == "arrow") {
      
      const sourceId = element.startBinding.elementId;
      if (sourceId == null) {
        console.log("Error parsing connection element.");
        continue;
      }
      const sourceNode = elements.find((d) => d.id == sourceId);

      if (sourceNode == undefined) {
        console.log("Cannot find source node\n Source Id: ${sourceId}");
        continue;
      }

      const targetId = element.endBinding.elementId;
      if (targetId == null) {
        console.log("Error parsing connection element.");
        continue;
      }

      const targetNode = elements.find((d) => d.id == targetId);

      if (targetNode == undefined) {
        console.log("Cannot find target node\n Target Id: ${targetId}");
        continue;
      }

      
      let labelId = element.boundElements.find(d => d.type == "text")?.id;

      if (labelId == null) {
        console.log("Error parsing label of connection.");
        continue;
      }
      const labelElement = elements.find(d => {
        return (labelId == d.id) && (d.type == "text");
      });

      const connection = 
        `Connection "${element.customData.persistentId}" {\n` +
        `  source: "${sourceNode.customData.persistentId}",\n` +
        `  target: "${targetNode.customData.persistentId}",\n` +
        `  relation: "${labelElement.originalText}",\n` +
        `  arrowColor: "${element.strokeColor}",\n` +
        `  arrowStyle: "${element.strokeStyle}",\n` +
        `  startArrowhead: "${element.startArrowhead}",\n` +
        `  endArrowhead: "${element.endArrowhead}",\n` +
        `  fontSize: ${labelElement.fontSize},\n` +
        `  points: ${JSON.stringify(element.points)},\n` +
        `};\n`;

      scriptElements.push(connection);
    }
  };

  const script = scriptElements.join("\n");
  console.log(script);
  return script;
};
