import { describe, it, expect, vi, beforeEach } from 'vitest';

// 👇 Mock helper modules BEFORE importing the module under test
vi.mock('../../src/utils/randomId.js', () => {
  return {
    randomId: vi.fn(() => 'connection-fixed-id'),
  };
});

vi.mock('../../src/utils/layoutMindmap.js', () => {
  return {
    layoutMindmap: vi.fn((mindmap /*, type, options */) => mindmap),
  };
});

// Now import the SUT and the mocked functions
import { parseMindmapToDSL } from '../../src/utils/parseMindmapToDSL.js';
import { randomId } from '../../src/utils/randomId.js';
import { layoutMindmap } from '../../src/utils/layoutMindmap.js';

describe('parseMindmapToDSL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns -1 when mindmap is null or undefined', () => {
    expect(parseMindmapToDSL(null)).toBe(-1);
    expect(parseMindmapToDSL(undefined)).toBe(-1);
  });

  it('calls layoutMindmap with default type "horizontal" when type is not provided', () => {
    const mindmap = {
      id: 'root',
      label: 'Root',
      x: 0,
      y: 0,
      width: 200,
      height: 100,
      children: [],
    };

    const script = parseMindmapToDSL(mindmap);

    expect(layoutMindmap).toHaveBeenCalledTimes(1);
    expect(layoutMindmap).toHaveBeenCalledWith(
      mindmap,
      'horizontal',
      expect.objectContaining({
        dx: 400,
        dy: 400,
        marginX: 600,
        marginY: 80,
        factor: 8,
        minWidth: 220,
      }),
    );

    expect(script).toContain('Node "root"');
  });

  it('builds node and connection DSL for a simple tree (including colors)', () => {
    const mindmap = {
      id: 'root',
      label: 'RootLabel',
      x: 10,
      y: 20,
      width: 220,
      height: 80,
      children: [
        {
          id: 'child',
          label: 'ChildLabel',
          x: 30,
          y: 140,
          width: 240,
          height: 100,
          children: [],
        },
      ],
    };

    const script = parseMindmapToDSL(mindmap, 'vertical');

    // layoutMindmap called with specific type
    expect(layoutMindmap).toHaveBeenCalledWith(
      mindmap,
      'vertical',
      expect.any(Object),
    );

    // ✅ Nodes
    expect(script).toMatch(/Node "root"/);
    expect(script).toMatch(/Node "child"/);

    // ✅ Node geometry
    expect(script).toContain('height: 80');
    expect(script).toContain('width: 220');
    expect(script).toContain('x: 10');
    expect(script).toContain('y: 20');

    // ✅ Colors
    expect(script).toContain('backgroundColor: "#3bc9db"');
    expect(script).toContain('borderColor: "#000000"');
    expect(script).toContain('textColor: "#000000"');

    // ✅ Connection block uses mocked randomId
    expect(randomId).toHaveBeenCalledTimes(1);
    expect(script).toMatch(/Connection "connection-fixed-id"/);
    expect(script).toContain('source: "root"');
    expect(script).toContain('target: "child"');
    expect(script).toContain('relation: "RootLabel"');
  });

  it('uses default width/height when node width/height are not provided', () => {
    const mindmap = {
      id: 'rootNoSize',
      label: 'RootNoSize',
      x: 0,
      y: 0,
      // width/height missing -> should use 240x100
      children: [],
    };

    const script = parseMindmapToDSL(mindmap, 'horizontal');

    expect(script).toMatch(/Node "rootNoSize"/);
    expect(script).toContain('width: 240');
    expect(script).toContain('height: 100');
  });

  it('skips creating connections when child coordinates are missing (continue branch)', () => {
    const mindmap = {
      id: 'root',
      label: 'Root',
      x: 0,
      y: 0,
      width: 200,
      height: 80,
      children: [
        {
          id: 'childNoCoords',
          label: 'ChildNoCoords',
          // x, y are missing -> triggers the "continue" in extractNodesAndConnections
          children: [],
        },
      ],
    };

    const script = parseMindmapToDSL(mindmap, 'horizontal');

    // child still becomes a Node
    expect(script).toMatch(/Node "childNoCoords"/);

    // but no Connection created
    expect(script).not.toContain('Connection "');
    expect(randomId).not.toHaveBeenCalled();
  });
});
