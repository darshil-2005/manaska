
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

    // new options for sizing
    nodeHeight = 100,  // height assigned to every node
    factor = 15,       // width factor (characters * factor)
    minWidth = 300     // minimum width for a node
  } = options;

  // counter for leaf placement (left-to-right or top-to-bottom depending)
  let leafIndex = 0;

  // Helper to compute width from label
  function computeWidthFromLabel(label) {
    const len = String(label ?? "").length;
    return Math.max(len * factor, minWidth);
  }

  // Recursively build a deep copy of tree and compute positions post-order.
  function build(node, depth = 0) {
    // shallow copy basic fields (keep other fields intact)
    const copy = {
      id: node.id,
      label: node.label,
      // we'll rebuild children array below (so we don't mutate original)
      children: [],
      // keep any other properties the user had:
      ...Object.fromEntries(
        Object.keys(node)
          .filter((k) => !["id", "label", "children"].includes(k))
          .map((k) => [k, node[k]])
      ),
    };

    // compute width/height for this node (based only on its label)
    copy.width = computeWidthFromLabel(copy.label);
    copy.height = nodeHeight;

    // build children first (post-order)
    if (Array.isArray(node.children) && node.children.length > 0) {
      for (const c of node.children) {
        copy.children.push(build(c, depth + 1));
      }
    }

    // if leaf: assign secondary axis from leafIndex and increment
    if (!copy.children || copy.children.length === 0) {
      // leaf coordinate in the "secondary axis" (y for vertical layout)
      copy._secondary = leafIndex * dy + marginY;
      leafIndex++;
    } else {
      // internal: secondary axis = average of children
      const sum = copy.children.reduce((s, ch) => s + ch._secondary, 0);
      copy._secondary = sum / copy.children.length;
    }

    // primary axis (x for vertical layout) is depth * dx
    copy._primary = depth * dx + marginX;

    return copy;
  }

  // Build tree with temporary _primary/_secondary coordinates
  const tempRoot = build(root, 0);

  // Convert to final x/y based on requested orientation and remove temps.
  function finalize(node) {
    if (orientation === "vertical") {
      node.x = node._primary;
      node.y = node._secondary;
    } else {
      // horizontal: swap roles
      node.x = node._secondary;
      node.y = node._primary;
    }

    // clean temp fields
    delete node._primary;
    delete node._secondary;

    // recurse (ensure children array exists)
    if (Array.isArray(node.children) && node.children.length > 0) {
      node.children = node.children.map(finalize);
    } else {
      node.children = [];
    }
    return node;
  }

  return finalize(tempRoot);
}
