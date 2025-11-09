export function getPoints(elements, sourceId, targetId) {
  const points = [];
  let sourceNode;
  let targetNode;

  for (let i=0; i < elements.length; i++) {

    if (elements[i].name == sourceId) {
      sourceNode = elements[i];
    };

    if (elements[i].name == targetId) {
      targetNode = elements[i];
    }
  }

  const absoluteX = parseFloat(sourceNode.properties.x) + parseFloat(sourceNode.properties.width) / 2;
  const absoluteY = parseFloat(sourceNode.properties.y) + parseFloat(sourceNode.properties.height);
  const absoluteTargetX = parseFloat(targetNode.properties.x) + parseFloat(targetNode.properties.width) / 2;
  const absoluteTargetY = parseFloat(targetNode.properties.y);

  return {absoluteStart: {x: absoluteX, y: absoluteY}, points: [[0, 0], [0, 50], [absoluteTargetX - absoluteX, absoluteTargetY - absoluteY - 50], [absoluteTargetX - absoluteX, absoluteTargetY - absoluteY]]};
};
