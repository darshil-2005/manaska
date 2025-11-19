/**
 * @brief
 * Computes the connector points between two nodes.
 *
 * @details
 * Supports vertical, horizontal, and radial mindmap layouts.
 * Returns the start point on the source node and a relative line
 * to the target node. Radial mode computes points on the circle
 * edges along the shortest line between their centers.
 *
 * @param
 * elements List of node objects with position and size.
 * @param
 * sourceId ID of the source node.
 * @param
 * targetId ID of the target node.
 * @param
 * type Layout type ("vertical", "horizontal", "radial").
 * @return
 * Connector info or -1 if nodes are missing.
 *
 * @author
 * Darshil Gandhi (202301056)
 */

export function getPoints(elements, sourceId, targetId, type) {

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

  if (type == "vertical") {

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
  else if (type == "horizontal") {

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
  else if (type == "radial") {

    const sx = parseFloat(sourceNode.properties.x) + parseFloat(sourceNode.properties.width) / 2;
    const sy = parseFloat(sourceNode.properties.y) + parseFloat(sourceNode.properties.height) / 2;
    const tx = parseFloat(targetNode.properties.x) + parseFloat(targetNode.properties.width) / 2;
    const ty = parseFloat(targetNode.properties.y) + parseFloat(targetNode.properties.height) / 2;

    const sr = Math.min(parseFloat(sourceNode.properties.width), parseFloat(sourceNode.properties.height)) / 2;
    const tr = Math.min(parseFloat(targetNode.properties.width), parseFloat(targetNode.properties.height)) / 2;

    let dx = tx - sx;
    let dy = ty - sy;
    let dist = Math.hypot(dx, dy);

    if (dist === 0) {
      dx = 1;
      dy = 0;
      dist = 1;
    }

    const ux = dx / dist;
    const uy = dy / dist;

    const sxp = sx + ux * sr;
    const syp = sy + uy * sr;

    const txp = tx - ux * tr;
    const typ = ty - uy * tr;

    const result = {
      absoluteStart: { x: sxp, y: syp },
      points: [[0, 0], [parseFloat((txp - sxp).toFixed(3)), parseFloat((typ - syp).toFixed(3))]],
      absoluteEnd: { x: txp, y: typ }
    };

    return result;
  }
  else {
    return -1;
  }
};

