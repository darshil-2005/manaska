// Author: Siva Suhas Thatvarthy
// Student ID: 202301050

export function parseMMDSLtoExcalidraw(mmsl) {
  // Split the input MMDSL string into non-empty trimmed lines
  const lines = mmsl.split("\n").map(l => l.trim()).filter(l => l.length);

  // This will store all created nodes for reference when creating connections
  const objects = {};

  // This array will hold the final Excalidraw objects to return
  const result = [];

  let current = null; 

  // Loop through each line in the MMDSL input
  for (let line of lines) {

    // Detect start of a Node or Connection block
    if (line.startsWith("Node ") || line.startsWith("Connection ")) {
      const [keyword, name] = line.split(/\s+/); // Extract type and name
      current = { type: keyword, name, props: {} }; 
    } 
    
    // Detect end of a block
    else if (line === "};") {
      const { type, name, props } = current; 

      if (type === "Node") {
        // Create an Excalidraw-style node object
        const node = {
          type: props.shape || "rectangle", // Default shape if none specified
          id: `node-${name}`, // Unique ID for this node
          x: props.x,
          y: props.y,
          width: props.width,
          height: props.height,
          label: props.content ? { text: props.content } : undefined, 
          backgroundColor: props.backgroundColor,
        };
        objects[name] = node; 
        result.push(node);    
      }

      if (type === "Connection") {
        // Lookup start and end nodes for this connection
        const startNode = objects[props.start];
        const endNode = objects[props.end];

        // Create an arrow object for Excalidraw
        const arrow = {
          type: "arrow",
          id: `arrow-${name}`,
          x: startNode ? startNode.x : 0, 
          y: startNode ? startNode.y : 0,
          start: startNode ? { id: startNode.id } : undefined, // Reference start node
          end: endNode ? { id: endNode.id } : undefined,       // Reference end node
          width: endNode && startNode ? Math.abs(endNode.x - startNode.x) : 50,
          height: endNode && startNode ? Math.abs(endNode.y - startNode.y) : 50,
        };
        result.push(arrow); 
      }

      current = null; 
    } 
    
    
    else if (current) {
      const parts = line.replace(/,$/, "").split(":"); 
      if (parts.length === 2) {
        let key = parts[0].trim();
        let val = parts[1].trim();

        // Remove quotes for string values
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        } 
        // Convert numeric strings to numbers
        else if (!isNaN(val)) {
          val = Number(val);
        }

        current.props[key] = val; 
      }
    }
  }

 
  return result;
}
