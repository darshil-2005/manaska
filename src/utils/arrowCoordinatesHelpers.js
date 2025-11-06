

export function getBaseCoordinates(sourceNode, targetNode) {
  
  let referenceX;
  let referenceY;

  const sourceProps = sourceNode.properties;
  const targetProps = targetNode.properties;

  if (sourceProps.x < targetProps.x) {
    referenceX = parseFloat(sourceProps.x) + parseFloat(sourceProps.width);
  } else {
    referenceX = parseFloat(sourceProps.x);
  }
  
  referenceY = parseFloat(sourceProps.y) + parseFloat(sourceProps.height / 2);

  return {referenceX, referenceY};
};


export function getArrowEndRelativePoints(sourceNode, targetNode, referenceX, referenceY) {
  const sourceProps = sourceNode.properties;
  const targetProps = targetNode.properties;

  let relativeEndX;
  let relativeEndY;

  if (sourceProps.x < targetProps.x) {

    relativeEndX = parseFloat(targetProps.x) - referenceX;

  } else {
    
    relativeEndX = parseFloat(targetProps.x) + parseFloat(targetProps.width) - referenceX;
  }
  
    relativeEndY = parseFloat(targetProps.y) + parseFloat(targetProps.height / 2) - referenceY;
    
    return {relativeEndX, relativeEndY};
}
