/**
 * layoutMindmap
 *  - Input: tree object with children arrays (like your example)
 *  - Output: new tree with { x, y, width, height } added to each node
 *
 * Defaults produce a vertical top->down layout.
 *
 * Example:
 *   const laidOut = layoutMindmap(exampleTree, { dx: 300, dy: 120, nodeHeight: 72, factor: 8, minWidth: 80 });
 */
export function layoutMindmap(root, options = {}) {
  const {
    dx = 300,         // horizontal spacing per depth
    dy = 120,         // vertical spacing between leaves
    marginX = 80,     // left/top margin
    marginY = 60,
    orientation = "vertical", // "vertical" (top->down) or "horizontal" (left->right)
    nodeHeight = 100,  // height assigned to every node
    factor = 15,       // width factor (characters * factor)
    minWidth = 300     // minimum width for a node
  } = options;

  let leafIndex = 0;

  function computeWidthFromLabel(label) {
    const len = String(label ?? "").length;
    return Math.max(len * factor, minWidth);
  }

  function build(node, depth = 0) {
    const copy = {
      id: node.id,
      label: node.label,
      children: [],
      ...Object.fromEntries(
        Object.keys(node)
          .filter((k) => !["id", "label", "children"].includes(k))
          .map((k) => [k, node[k]])
      ),
    };

    copy.width = computeWidthFromLabel(copy.label);
    copy.height = nodeHeight;

    if (Array.isArray(node.children) && node.children.length > 0) {
      for (const c of node.children) {
        copy.children.push(build(c, depth + 1));
      }
    }

    if (!copy.children || copy.children.length === 0) {
      copy._secondary = leafIndex * dy + marginY;
      leafIndex++;
    } else {
      const sum = copy.children.reduce((s, ch) => s + ch._secondary, 0);
      copy._secondary = sum / copy.children.length;
    }

    copy._primary = depth * dx + marginX;

    return copy;
  }

  const tempRoot = build(root, 0);

  function finalize(node) {
    if (orientation === "vertical") {
      node.x = node._primary;
      node.y = node._secondary;
    } else {
      node.x = node._secondary;
      node.y = node._primary;
    }

    delete node._primary;
    delete node._secondary;

    if (Array.isArray(node.children) && node.children.length > 0) {
      node.children = node.children.map(finalize);
    } else {
      node.children = [];
    }
    return node;
  }

  return finalize(tempRoot);
}
