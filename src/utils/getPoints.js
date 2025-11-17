
export function getPoints(elements, sourceId, targetId, mode) {

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

  if (mode == "vertical") {

    if (parseFloat(sourceNode.properties.y) < parseFloat(targetNode.properties.y)) {

      const absoluteX = parseFloat(sourceNode.properties.x) + parseFloat(sourceNode.properties.width) / 2;
      const absoluteY = parseFloat(sourceNode.properties.y) + parseFloat(sourceNode.properties.height);
      const absoluteTargetX = parseFloat(targetNode.properties.x) + parseFloat(targetNode.properties.width) / 2;
      const absoluteTargetY = parseFloat(targetNode.properties.y);
      const result = {absoluteStart: {x: absoluteX, y: absoluteY}, points: [[0, 0], [absoluteTargetX - absoluteX, absoluteTargetY - absoluteY]]};

      return result;
    } else {

      const absoluteX = parseFloat(sourceNode.properties.x) + parseFloat(sourceNode.properties.width) / 2;
      const absoluteY = parseFloat(sourceNode.properties.y);
      const absoluteTargetX = parseFloat(targetNode.properties.x) + parseFloat(targetNode.properties.width) / 2;
      const absoluteTargetY = parseFloat(targetNode.properties.y) + parseFloat(targetNode.properties.height);
      const result = {absoluteStart: {x: absoluteX, y: absoluteY}, points: [[0, 0], [absoluteTargetX - absoluteX, absoluteTargetY - absoluteY]]};

      return result;
    }
  }
  else if (mode == "horizontal") {

    if (parseFloat(sourceNode.properties.x) < parseFloat(targetNode.properties.x)) {

      const absoluteX = parseFloat(sourceNode.properties.x) + parseFloat(sourceNode.properties.width);
      const absoluteY = parseFloat(sourceNode.properties.y) + parseFloat(sourceNode.properties.height) / 2;
      const absoluteTargetX = parseFloat(targetNode.properties.x);
      const absoluteTargetY = parseFloat(targetNode.properties.y) + parseFloat(targetNode.properties.height) / 2;
      const result = {absoluteStart: {x: absoluteX, y: absoluteY}, points: [[0, 0], [absoluteTargetX - absoluteX, absoluteTargetY - absoluteY]]};
      return result;

    } else {

      const absoluteX = parseFloat(sourceNode.properties.x);
      const absoluteY = parseFloat(sourceNode.properties.y) + parseFloat(sourceNode.properties.height) / 2;
      const absoluteTargetX = parseFloat(targetNode.properties.x) + parseFloat(targetNode.properties.width);
      const absoluteTargetY = parseFloat(targetNode.properties.y) + parseFloat(targetNode.properties.height) / 2;
      const result = {absoluteStart: {x: absoluteX, y: absoluteY}, points: [[0, 0], [absoluteTargetX - absoluteX, absoluteTargetY - absoluteY]]};

      return result;
    }
  }
  else {
    return -1;
  }
};

