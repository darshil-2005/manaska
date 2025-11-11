

export function getBaseCoordinates(sourceNode, targetNode) {
  
  let referenceX;
  let referenceY;

  const sourceProps = sourceNode.properties;
  const targetProps = targetNode.properties;
  
  const sourceHeight = parseFloat(sourceProps.height);
  const sourceWidth = parseFloat(sourceProps.width);
  const sourceX = parseFloat(sourceProps.x);
  const sourceY = parseFloat(sourceProps.y);
  
  const targetHeight = parseFloat(targetProps.height);
  const targetWidth = parseFloat(targetProps.width);
  const targetX = parseFloat(targetProps.x);
  const targetY = parseFloat(targetProps.y);

  const sourceCoordinates = [
    [sourceX, sourceY + sourceHeight / 2],
    [sourceX + sourceWidth / 2, sourceY],
    [sourceX + sourceWidth / 2, sourceY + sourceHeight],
    [sourceX + sourceWidth, sourceY + sourceHeight / 2]
  ];

  const targetCoordinates = [
    [targetX, targetY + targetHeight / 2],
    [targetX + targetWidth / 2, targetY],
    [targetX + targetWidth / 2, targetY + targetHeight],
    [targetX + targetWidth, targetY + targetHeight / 2]
  ];
  
  let sourcePointIndex = null;
  let targetPointIndex = null;
  let minDist = Infinity;

  for (let i=0; i < sourceCoordinates.length; i++) {
    for (let j=0; j < targetCoordinates.length; j++) {
      
      let sx = sourceCoordinates[i];
      let tx = targetCoordinates[j];

      let dist = (tx[0] - sx[0]) ** 2 + (tx[1] - sx[1]) ** 2;

      if (dist < minDist) {
        minDist = dist;
        sourcePointIndex = i;
        targetPointIndex = j;
      }
    }
  }

  const fsx = sourceCoordinates[sourcePointIndex][0];
  const fsy = sourceCoordinates[sourcePointIndex][1];
  const ftx = targetCoordinates[targetPointIndex][0];
  const fty = targetCoordinates[targetPointIndex][1];

  return {sourceCoordinates: [fsx, fsy], targetCoordinates: [ftx - fsx, fty - fsy]};
};


export function getPointsArrayForArrows(x, y) {
  


};












