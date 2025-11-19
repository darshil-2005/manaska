/**
 * @brief 
 * Assigns mindmap nodes x, y, height, width according to the type of mindmap.
 *
 * @details
 * The function layout 3 diffrent kinds of mindmaps horizontal, vertical, radial.
 * The function is responsible for arranging the node with proper space, trying 
 * its best to make sure no node collides. 
 *
 * @param root
 * A recursive mindmap in JSON format.
 * 
 * @param type
 * Type of mindmap (horizontal, vertical, radial). 
 *
 * @return 
 * A deep copy of the original recursive JSON mindmap with extra attributes
 * like x, y, height, width.
 *
 * @author 
 * Darshil Gandhi (202301056)
 */

export function layoutMindmap(root, type, options = {}) {
  const opts = {
    // Node Spacing
    dx: 300, 
    dy: 120,
    marginX: 80,
    marginY: 60,

    // Node Sizing
    nodeHeight: 80,
    factor: 12,
    minWidth: 120,

    // Node Spacing (Radial)
    ringSpacing: 400, 
    centerX: null,
    centerY: null,

    // general safety
    maxDepth: 10,

    ...options,
  };

  // compute width from label
  function computeWidthFromLabel(label) {
    const len = String(label ?? "").length;
    return Math.max(len * opts.factor, opts.minWidth);
  }

  // Deep copy + metadata build pass: compute width, height, children array
  let leafCounter = 0;
  function build(node, depth = 0) {
    const copy = {
      id: node.id,
      label: node.label,
      children: Array.isArray(node.children) ? node.children.map((c) => build(c, depth + 1)) : [],
      meta: { ...(node.meta || {}) },
      depth,
    };
    copy.width = computeWidthFromLabel(copy.label);
    copy.height = opts.nodeHeight;
    copy.leafCount = 0; // will compute below
    if (!copy.children || copy.children.length === 0) {
      copy.leafCount = 1;
      copy._leafIndex = leafCounter++; // used for linear ordering
    } else {
      copy.leafCount = copy.children.reduce((s, c) => s + c.leafCount, 0);
    }
    return copy;
  }

  const tree = build(root, 0);

  // HELPERS for vertical/horizontal: compute _secondary (row position) using leaf indices
  function assignLinearPositions(node) {
    if (!node.children || node.children.length === 0) {
      node._row = node._leafIndex * opts.dy + opts.marginY;
    } else {
      for (const ch of node.children) assignLinearPositions(ch);
      const sum = node.children.reduce((s, c) => s + c._row, 0);
      node._row = sum / node.children.length;
    }
  }

  // finalize coordinates for vertical/horizontal
  function finalizeLinear(node, isVertical = true) {
    // primary = depth * dx + marginX
    if (isVertical) {
      node.x = node.depth * opts.dx + opts.marginX;
      node.y = node._row;
    } else {
      node.x = node._row;
      node.y = node.depth * opts.dx + opts.marginY;
    }
    // clear temp
    delete node._row;
    // recurse
    node.children = (node.children || []).map((c) => finalizeLinear(c, isVertical));
    return node;
  }

  // RADIAL: compute angular spans proportional to leaf counts
  function assignRadialAngles(rootNode) {
    // total leaves
    const totalLeaves = rootNode.leafCount || 1;
    // we'll allocate [0..2PI) to children based on leafCount
    function assign(node, startAng, endAng) {
      node.angleStart = startAng;
      node.angleEnd = endAng;
      node.angleMid = (startAng + endAng) / 2;
      // assign children slices
      if (node.children && node.children.length > 0) {
        let cursor = startAng;
        const span = endAng - startAng;
        for (const ch of node.children) {
          const portion = (ch.leafCount / node.leafCount) * span;
          assign(ch, cursor, cursor + portion);
          cursor += portion;
        }
      }
    }
    assign(rootNode, 0, Math.PI * 2);
  }

  // RADIAL: finalize positions (centered)
  function finalizeRadial(rootNode) {
    // determine center: if provided in opts use them, else compute bounding box from hierarchical result
    const cx = opts.centerX ?? (opts.marginX + (rootNode.depth + 1) * opts.dx); // fallback placeholder
    const cy = opts.centerY ?? opts.marginY + 200; // arbitrary fallback; we'll compute better below

    // Instead of trying to guess canvas extents, we compute positions relative to center (0,0) then translate outside if needed.
    function place(node) {
      const r = node.depth * opts.ringSpacing;
      // root (depth=0) should be at radius=0
      const radius = r;
      // mid angle for node
      const angle = node.angleMid ?? 0;
      // coordinates relative to center
      node.x = Math.cos(angle) * radius;
      node.y = Math.sin(angle) * radius;
      node.radiusFromCenter = radius;
      // compute node-specific radius in layout (for renderer)
      node.width = node.width; // preserve computed width
      node.height = node.width;
      // recurse
      if (node.children && node.children.length > 0) {
        for (const ch of node.children) place(ch);
      }
      return node;
    }
    place(rootNode);

    // after placement convert to positive coords by finding bounding box and translating so center maps to desired center
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    function bbox(n) {
      minX = Math.min(minX, n.x - n.width / 2);
      maxX = Math.max(maxX, n.x + n.width / 2);
      minY = Math.min(minY, n.y - n.height / 2);
      maxY = Math.max(maxY, n.y + n.height / 2);
      (n.children || []).forEach(bbox);
    }
    bbox(rootNode);

    // desired center
    const desiredCx = opts.centerX ?? Math.round((maxX - minX) / 2 - minX + opts.marginX);
    const desiredCy = opts.centerY ?? Math.round((maxY - minY) / 2 - minY + opts.marginY);

    // translate all nodes
    function translate(n) {
      n.x = Math.round(n.x + desiredCx);
      n.y = Math.round(n.y + desiredCy);
      (n.children || []).forEach(translate);
    }
    translate(rootNode);

    // done
    return rootNode;
  }

  // MAIN dispatch
  if (type === "radial") {
    // assign angles using leaf counts
    assignRadialAngles(tree);
    // for radial layout depth mapping: keep depth as computed; root.depth==0
    // finalize positions in polar coordinates -> absolute coords
    finalizeRadial(tree);
    // return with depth & leafCount populated
    return tree;
  } else if (type === "horizontal") {
    // treat as hierarchy with left->right: primary = depth, secondary = row
    assignLinearPositions(tree);
    // For horizontal we want primary to be y and secondary to be x swapped; pass isVertical=false
    return finalizeLinear(tree, false);
  } else {
    // default = vertical hierarchy
    assignLinearPositions(tree);
    return finalizeLinear(tree, true);
  }
}
