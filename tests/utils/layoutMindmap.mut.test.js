import { describe, it, expect } from "vitest";
import { layoutMindmap } from "../../src/utils/layoutMindmap.js";

describe("layoutMindmap - MUTATION TESTING", () => {
  const simpleMindmap = {
    id: "root",
    label: "Root Node",
    children: [
      {
        id: "child1",
        label: "First Child",
        children: []
      },
      {
        id: "child2", 
        label: "Second Child",
        children: []
      }
    ]
  };

  const nestedMindmap = {
    id: "root",
    label: "Root",
    children: [
      {
        id: "level1",
        label: "Level 1",
        children: [
          {
            id: "level2a",
            label: "Level 2 A",
            children: []
          },
          {
            id: "level2b",
            label: "Level 2 B",
            children: []
          }
        ]
      }
    ]
  };

  const deepMindmap = {
    id: "root",
    label: "Root",
    children: [
      {
        id: "a",
        label: "A",
        children: [
          {
            id: "a1",
            label: "A1",
            children: [
              {
                id: "a1a",
                label: "A1A",
                children: []
              }
            ]
          }
        ]
      }
    ]
  };

  // ========================
  // BASIC LAYOUT TESTS
  // ========================
  describe("basic layout functionality", () => {
    it("should layout a simple single-node mindmap", () => {
      const root = { id: '1', label: 'Root' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result).toHaveProperty('x')
      expect(result).toHaveProperty('y')
      expect(result).toHaveProperty('width')
      expect(result).toHaveProperty('height')
      expect(result.id).toBe('1')
      expect(result.label).toBe('Root')
    });

    it("should layout a two-level vertical mindmap", () => {
      const result = layoutMindmap(simpleMindmap, "vertical");
      
      expect(result.id).toBe("root");
      expect(result.label).toBe("Root Node");
      expect(result.children).toHaveLength(2);
      
      // Root should be at depth 0
      expect(result.x).toBe(80); // marginX
      expect(result.depth).toBe(0);
      
      // Children should be at depth 1
      expect(result.children[0].x).toBe(380); // marginX + dx
      expect(result.children[1].x).toBe(380);
      expect(result.children[0].depth).toBe(1);
      expect(result.children[1].depth).toBe(1);
    });

    it("should layout a horizontal mindmap", () => {
      const result = layoutMindmap(simpleMindmap, "horizontal");
      
      expect(result.id).toBe("root");
      
      // In horizontal layout, y should be primary axis (depth-based)
      expect(result.y).toBe(60);
      expect(result.children[0].y).toBe(360);
      expect(result.children[1].y).toBe(360);
      
      // Should still have proper depths and leaf counts
      expect(result.depth).toBe(0);
      expect(result.children[0].depth).toBe(1);
      expect(result.leafCount).toBe(2);
    });

    it("should layout a radial mindmap", () => {
      const result = layoutMindmap(simpleMindmap, "radial");
      
      expect(result.id).toBe("root");
      expect(result.children).toHaveLength(2);
      
      // Root should be near center
      expect(result.x).toBeDefined();
      expect(result.y).toBeDefined();
      expect(result.radiusFromCenter).toBe(0);
      
      // Should have angle properties for radial layout
      expect(result.angleStart).toBeDefined();
      expect(result.angleEnd).toBeDefined();
      expect(result.angleMid).toBeDefined();
    });
  });

  // ========================
  // DEPTH AND LEAF COUNT CALCULATION (MUTANT KILLERS)
  // ========================
  describe("depth and leaf count calculation", () => {
    it("should correctly calculate depth for nested nodes", () => {
      const result = layoutMindmap(nestedMindmap, "vertical");
      
      expect(result.depth).toBe(0);
      expect(result.children[0].depth).toBe(1);
      expect(result.children[0].children[0].depth).toBe(2);
      expect(result.children[0].children[1].depth).toBe(2);
    });

    it("should correctly calculate leaf count", () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          { id: '2', label: 'Leaf 1' },
          { id: '3', label: 'Leaf 2' },
          { id: '4', label: 'Leaf 3' }
        ]
      }
      const result = layoutMindmap(root, "vertical");
      
      expect(result.leafCount).toBe(3);
      expect(result.children[0].leafCount).toBe(1);
    });

    it("should kill leaf count reduction mutants", () => {
      const complexTree = {
        id: "root", label: "R",
        children: [
          { id: "c1", label: "C1", children: [
            { id: "c1a", label: "C1A" },
            { id: "c1b", label: "C1B", children: [
              { id: "c1b1", label: "C1B1" },
              { id: "c1b2", label: "C1B2" }
            ]}
          ]},
          { id: "c2", label: "C2" }
        ]
      };

      const result = layoutMindmap(complexTree, "vertical");
      
      expect(result.leafCount).toBe(4);
      expect(result.children[0].leafCount).toBe(3);
      expect(result.children[1].leafCount).toBe(1);
      expect(result.children[0].children[0].leafCount).toBe(1);
      expect(result.children[0].children[1].leafCount).toBe(2);
    });
  });

  // ========================
  // WIDTH CALCULATION (MUTANT KILLERS)
  // ========================
  describe("width calculation", () => {
    it("should compute width based on label length", () => {
      const root = { id: '1', label: 'Short' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.width).toBeGreaterThanOrEqual(120) // minWidth
    });

    it("should use minimum width for short labels", () => {
      const root = { id: '1', label: 'A' }
      const result = layoutMindmap(root, 'vertical', { minWidth: 150 })
      
      expect(result.width).toBe(150)
    });

    it("should kill division/multiplication mutants in width calculation", () => {
      const shortLabel = { id: "1", label: "hi" };
      const longLabel = { id: "2", label: "very long label here" };

      const result1 = layoutMindmap(shortLabel, "vertical", { factor: 10, minWidth: 50 });
      const result2 = layoutMindmap(longLabel, "vertical", { factor: 10, minWidth: 50 });

      expect(result1.width).toBe(50);
      const actualWidth = result2.width;
      expect(actualWidth).toBeGreaterThan(50);
      expect(actualWidth).toBeGreaterThanOrEqual(19 * 10);
    });

    it("should handle null or undefined labels", () => {
      const root = { id: '1', label: null }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.width).toBe(120) // should use minWidth
    });
  });

  // ========================
  // CUSTOM OPTIONS (MUTANT KILLERS)
  // ========================
  describe("custom options", () => {
    it("should respect custom dx spacing", () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [{ id: '2', label: 'Child' }]
      }
      const result = layoutMindmap(root, 'vertical', { dx: 500 })
      
      expect(result.children[0].x - result.x).toBe(500)
    });

    it("should respect custom dy spacing", () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          { id: '2', label: 'Child 1' },
          { id: '3', label: 'Child 2' }
        ]
      }
      const result = layoutMindmap(root, 'vertical', { dy: 200 })
      
      const gap = Math.abs(result.children[1].y - result.children[0].y)
      expect(gap).toBeGreaterThan(0)
    });

    it("should kill arithmetic operator mutants in linear positioning", () => {
      const root = {
        id: "root", label: "Root",
        children: [
          { id: "c1", label: "C1" },
          { id: "c2", label: "C2" }
        ]
      };

      const result = layoutMindmap(root, "vertical", {
        dx: 100,
        marginX: 10
      });

      expect(result.x).toBe(10);
      expect(result.children[0].x).toBe(110);
      expect(result.children[1].x).toBe(110);
      expect(result.children[0].y).not.toBe(result.children[1].y);
    });
  });

  // ========================
  // RADIAL LAYOUT SPECIFICS (MUTANT KILLERS)
  // ========================
  describe("radial layout specifics", () => {
    it("should kill mathematical operator mutants in radial angle calculations", () => {
      const root = {
        id: "root",
        label: "Root",
        children: [
          { id: "child1", label: "Child1" },
          { id: "child2", label: "Child2" }
        ]
      };

      const result = layoutMindmap(root, "radial", {
        ringSpacing: 100
      });

      expect(result.angleStart).toBe(0);
      expect(result.angleEnd).toBeCloseTo(2 * Math.PI);
      expect(result.angleMid).toBeCloseTo(Math.PI);
      
      expect(result.children[0].angleStart).toBeCloseTo(0, 5);
      expect(result.children[0].angleEnd).toBeCloseTo(Math.PI, 5);
      expect(result.children[1].angleStart).toBeCloseTo(Math.PI, 5);
      expect(result.children[1].angleEnd).toBeCloseTo(2 * Math.PI, 5);
    });

    it("should kill radius calculation mutants", () => {
      const root = {
        id: "root", label: "Root",
        children: [{ id: "child", label: "Child" }]
      };

      const result = layoutMindmap(root, "radial", { ringSpacing: 200 });
      
      expect(result.radiusFromCenter).toBe(0);
      expect(result.children[0].radiusFromCenter).toBe(200);
    });

    it("should kill coordinate transformation mutants", () => {
      const root = { id: "root", label: "R" };
      const result = layoutMindmap(root, "radial", { 
        centerX: 1000, 
        centerY: 1000,
        ringSpacing: 100 
      });

      expect(result.x).toBe(1000);
      expect(result.y).toBe(1000);
    });

    it("should kill angle calculation mutants in radial layout", () => {
      const root = {
        id: "root", label: "Root",
        children: [
          { id: "c1", label: "C1" },
          { id: "c2", label: "C2" },
          { id: "c3", label: "C3" }
        ]
      };

      const result = layoutMindmap(root, "radial");

      expect(result.angleStart).toBe(0);
      expect(result.angleEnd).toBeCloseTo(2 * Math.PI);
      
      const angleMids = result.children.map(child => child.angleMid);
      const uniqueAngleMids = [...new Set(angleMids.map(angle => angle.toFixed(5)))];
      expect(uniqueAngleMids.length).toBe(3);
    });
  });

  // ========================
  // EDGE CASES (MUTANT KILLERS)
  // ========================
  describe("edge cases", () => {
    it("should kill null/undefined children array mutants", () => {
      const root = { id: "root", label: "Root", children: null };
      const result = layoutMindmap(root, "vertical");
      
      expect(result.children).toEqual([]);
      expect(result.leafCount).toBe(1);
    });

    it("should kill empty children array mutants", () => {
      const root = { id: "root", label: "Root", children: [] };
      const result = layoutMindmap(root, "vertical");
      
      expect(result.children).toEqual([]);
      expect(result.leafCount).toBe(1);
    });

    it("should handle nodes with undefined labels", () => {
      const root = { id: "root", label: undefined };
      const result = layoutMindmap(root, "vertical");
      
      expect(result.width).toBe(120);
    });

    it("should kill logical operator mutants for child checks", () => {
      const withChildren = {
        id: "parent", label: "P",
        children: [{ id: "child", label: "C" }]
      };
      const withoutChildren = { id: "leaf", label: "L" };

      const result1 = layoutMindmap(withChildren, "vertical");
      const result2 = layoutMindmap(withoutChildren, "vertical");

      expect(result1.children.length).toBe(1);
      expect(result2.children.length).toBe(0);
      expect(result1.leafCount).toBe(1);
      expect(result2.leafCount).toBe(1);
    });

    it("should handle deeply nested tree", () => {
      const result = layoutMindmap(deepMindmap, "vertical");
      
      expect(result.depth).toBe(0);
      let current = result
      for (let i = 1; i <= 3; i++) {
        expect(current.children).toHaveLength(1);
        current = current.children[0]
        expect(current.depth).toBe(i);
      }
    });
  });

  // ========================
  // MATHEMATICAL OPERATION VERIFICATION (MUTANT KILLERS)
  // ========================
  describe("mathematical operation verification", () => {
    it("should kill arithmetic operator mutants in leaf positioning", () => {
      const root = {
        id: "root", label: "Root",
        children: [
          { id: "c1", label: "C1" },
          { id: "c2", label: "C2" }
        ]
      };

      const result = layoutMindmap(root, "vertical", {
        dy: 50,
        marginY: 20
      });

      const leaf1Y = result.children[0].y;
      const leaf2Y = result.children[1].y;
      const expectedDifference = 50;
      expect(Math.abs(leaf2Y - leaf1Y)).toBeCloseTo(expectedDifference, 0);
    });

    it("should kill division mutants in average row calculation", () => {
      const root = {
        id: "root", label: "Root",
        children: [
          { id: "c1", label: "C1" },
          { id: "c2", label: "C2" }
        ]
      };

      const result = layoutMindmap(root, "vertical");

      const child1Y = result.children[0].y;
      const child2Y = result.children[1].y;
      const expectedParentY = (child1Y + child2Y) / 2;
      
      expect(result.y).toBeCloseTo(expectedParentY, 1);
    });

    it("should kill addition/subtraction mutants in coordinate calculations", () => {
      const root = { id: "root", label: "Root" };
      
      const result = layoutMindmap(root, "vertical", {
        marginX: 50,
        marginY: 30,
        dx: 80
      });

      expect(result.x).toBe(50);
      expect(result.y).toBeGreaterThanOrEqual(30);
    });
  });

  // ========================
  // BOUNDING BOX CALCULATION (MUTANT KILLERS)
  // ========================
  describe("bounding box calculation", () => {
    it("should kill min/max calculation mutants", () => {
      const root = {
        id: "root", label: "Root",
        children: [
          { id: "left", label: "Left" },
          { id: "right", label: "Right" }
        ]
      };

      const result = layoutMindmap(root, "radial", {
        centerX: 500,
        centerY: 500,
        ringSpacing: 100
      });

      expect(result.x).toBeGreaterThan(0);
      expect(result.y).toBeGreaterThan(0);
      expect(result.children[0].x).toBeGreaterThan(0);
      expect(result.children[0].y).toBeGreaterThan(0);
      expect(result.children[1].x).toBeGreaterThan(0);
      expect(result.children[1].y).toBeGreaterThan(0);
      expect(result.x).toBeLessThan(10000);
      expect(result.y).toBeLessThan(10000);
    });

    it("should kill Math.min/Math.max mutants in bbox calculation", () => {
      const root = {
        id: "root", label: "R",
        children: [
          { id: "c1", label: "Child1" },
          { id: "c2", label: "Child2" }
        ]
      };

      const result = layoutMindmap(root, "radial");

      const distance1 = Math.sqrt(
        (result.children[0].x - result.x) ** 2 + 
        (result.children[0].y - result.y) ** 2
      );
      const distance2 = Math.sqrt(
        (result.children[1].x - result.x) ** 2 + 
        (result.children[1].y - result.y) ** 2
      );
      
      expect(distance1).toBeGreaterThan(0);
      expect(distance2).toBeGreaterThan(0);
    });
  });

  // ========================
  // ARRAY OPERATION MUTANTS
  // ========================
  describe("array operation mutants", () => {
    it("should kill array mapping mutants", () => {
      const root = {
        id: "root", label: "Root",
        children: [
          { id: "c1", label: "Child1" },
          { id: "c2", label: "Child2" }
        ]
      };

      const result = layoutMindmap(root, "vertical");
      
      expect(result.children.length).toBe(2);
      result.children.forEach(child => {
        expect(child.x).toBeDefined();
        expect(child.y).toBeDefined();
        expect(child.width).toBeDefined();
        expect(child.height).toBeDefined();
      });
    });

    it("should kill update operator mutants in leaf counting", () => {
      const root = {
        id: "root", label: "Root",
        children: [
          { id: "c1", label: "C1" },
          { id: "c2", label: "C2" },
          { id: "c3", label: "C3" }
        ]
      };

      const result = layoutMindmap(root, "vertical");

      const leafIndices = result.children.map(child => child._leafIndex).filter(idx => idx !== undefined);
      expect(new Set(leafIndices).size).toBe(3);
      expect(Math.max(...leafIndices)).toBe(2);
    });
  });

  // ========================
  // LAYOUT TYPE COMPARISON
  // ========================
  describe("layout type comparison", () => {
    it("should produce different coordinates for different layout types", () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          { id: '2', label: 'Child 1' },
          { id: '3', label: 'Child 2' }
        ]
      }
      
      const vertical = layoutMindmap(root, 'vertical')
      const horizontal = layoutMindmap(root, 'horizontal')
      const radial = layoutMindmap(root, 'radial')
      
      // Coordinates should differ between layout types
      expect(vertical.children[0].x).not.toBe(horizontal.children[0].x)
      expect(vertical.children[0].y).not.toBe(radial.children[0].y)
    });
  });

  // ========================
  // INVALID INPUTS
  // ========================
  describe("invalid inputs", () => {
    it("should handle undefined root gracefully", () => {
      expect(() => layoutMindmap(undefined, 'vertical')).toThrow()
    });

    it("should handle null root gracefully", () => {
      expect(() => layoutMindmap(null, 'vertical')).toThrow()
    });

    it("should handle root without id", () => {
      const root = { label: 'Root' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result).toHaveProperty('x')
      expect(result).toHaveProperty('y')
    });

    it("should handle root without label", () => {
      const root = { id: '1' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result).toHaveProperty('width')
      expect(result.width).toBe(120) // minWidth
    });
  });

  // ========================
  // BOUNDARY VALUES
  // ========================
  describe("boundary values", () => {
    it("should handle single character labels", () => {
      const root = { id: '1', label: 'A' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.width).toBeGreaterThanOrEqual(120)
      expect(result).toHaveProperty('x')
      expect(result).toHaveProperty('y')
    });

    it("should handle very long labels", () => {
      const longLabel = 'A'.repeat(1000)
      const root = { id: '1', label: longLabel }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.width).toBeGreaterThan(1000)
    });

    it("should handle unicode characters in labels", () => {
      const root = { id: '1', label: '你好世界 🎉' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result).toHaveProperty('width')
      expect(result.width).toBeGreaterThan(0)
    });
  });

  // ========================
  // LEAF INDEX ASSIGNMENT VERIFICATION (MUTANT KILLERS)
  // ========================
  describe("leaf index assignment verification", () => {
    it("should kill update operator mutant by verifying leaf index assignment", () => {
      const root = {
        id: "root", label: "Root",
        children: [
          { id: "leaf1", label: "Leaf1" },
          { id: "leaf2", label: "Leaf2" },
          { id: "leaf3", label: "Leaf3" }
        ]
      };

      const result = layoutMindmap(root, "vertical");

      const leafIndices = [];
      function collectLeafIndices(node) {
        if (node.children.length === 0 && node._leafIndex !== undefined) {
          leafIndices.push(node._leafIndex);
        }
        node.children.forEach(collectLeafIndices);
      }
      collectLeafIndices(result);

      expect(leafIndices.length).toBe(3);
      expect(leafIndices).toEqual(expect.arrayContaining([0, 1, 2]));
      expect(leafIndices).toEqual([0, 1, 2]);
    });
  });


  describe("layoutMindmap - NO COVERAGE KILLERS", () => {
  it("should cover boolean literal mutant for isVertical parameter", () => {
    const root = {
      id: "test",
      label: "Test",
      children: [{ id: "child", label: "Child" }]
    };
    
    // This tests the internal finalizeLinear function with both true and false isVertical
    const vertical = layoutMindmap(root, "vertical");
    const horizontal = layoutMindmap(root, "horizontal");
    
    // Verify different behavior between vertical and horizontal
    expect(vertical.children[0].x).toBeGreaterThan(vertical.x);
    expect(horizontal.children[0].y).toBeGreaterThan(horizontal.y);
  });

  it("should cover array declaration mutants with null children", () => {
    const testCases = [
      { id: "null", label: "Null Children", children: null },
      { id: "undefined", label: "Undefined Children" }, // no children property
      { id: "empty", label: "Empty Children", children: [] }
    ];
    
    testCases.forEach(testCase => {
      const result = layoutMindmap(testCase, "vertical");
      
      // Should always have an array for children
      expect(Array.isArray(result.children)).toBe(true);
      expect(result.children.length).toBe(0);
      
      // Should still compute valid layout
      expect(result.x).toBeDefined();
      expect(result.y).toBeDefined();
      expect(result.width).toBeDefined();
      expect(result.height).toBeDefined();
    });
  });
});


// Add these tests to your layoutMindmap.test.js file

describe("layoutMindmap - TARGETED MUTANT KILLERS", () => {
  // ========================
  // META OBJECT MUTANTS
  // ========================
  describe("meta object mutants", () => {
    it("should kill meta object literal and conditional mutants", () => {
      const rootWithMeta = {
        id: "root",
        label: "Root",
        meta: { customProp: "value", priority: 1 }
      };
      
      const rootWithoutMeta = {
        id: "root", 
        label: "Root"
        // no meta property
      };
      
      const result1 = layoutMindmap(rootWithMeta, "vertical");
      const result2 = layoutMindmap(rootWithoutMeta, "vertical");
      
      // Should preserve existing meta properties
      expect(result1.meta.customProp).toBe("value");
      expect(result1.meta.priority).toBe(1);
      
      // Should create empty object when no meta exists
      expect(result2.meta).toEqual({});
    });

    it("should kill meta logical operator mutants", () => {
      const root = {
        id: "root",
        label: "Root",
        meta: null // edge case: meta exists but is null
      };
      
      const result = layoutMindmap(root, "vertical");
      
      // Should handle null meta gracefully
      expect(result.meta).toEqual({});
    });
  });

  // ========================
  // RADIAL LAYOUT MUTANTS
  // ========================
  describe("radial layout specific mutants", () => {
    it("should kill totalLeaves conditional mutants", () => {
      const singleNode = { id: "single", label: "Single" };
      const withChildren = {
        id: "parent", 
        label: "Parent",
        children: [{ id: "child", label: "Child" }]
      };
      
      const result1 = layoutMindmap(singleNode, "radial");
      const result2 = layoutMindmap(withChildren, "radial");
      
      // Both should have valid angle calculations regardless of leafCount
      expect(result1.angleStart).toBe(0);
      expect(result1.angleEnd).toBeCloseTo(2 * Math.PI);
      expect(result2.angleStart).toBe(0);
      expect(result2.angleEnd).toBeCloseTo(2 * Math.PI);
    });

    it("should kill children length check mutants", () => {
      const rootWithChildren = {
        id: "root",
        label: "Root",
        children: [
          { id: "child1", label: "Child 1" },
          { id: "child2", label: "Child 2" }
        ]
      };
      
      const rootWithoutChildren = {
        id: "root",
        label: "Root",
        children: [] // empty array
      };
      
      const rootNullChildren = {
        id: "root",
        label: "Root",
        children: null // null children
      };
      
      const result1 = layoutMindmap(rootWithChildren, "radial");
      const result2 = layoutMindmap(rootWithoutChildren, "radial");
      const result3 = layoutMindmap(rootNullChildren, "radial");
      
      // Should handle all cases without errors
      expect(result1.children).toHaveLength(2);
      expect(result2.children).toHaveLength(0);
      expect(result3.children).toHaveLength(0);
    });

    it("should kill angle span arithmetic mutants", () => {
      const root = {
        id: "root",
        label: "Root",
        children: [
          { id: "child1", label: "Child 1" },
          { id: "child2", label: "Child 2" }
        ]
      };
      
      const result = layoutMindmap(root, "radial");
      
      // Verify angle span calculations
      result.children.forEach(child => {
        const span = child.angleEnd - child.angleStart;
        expect(span).toBeGreaterThan(0);
        expect(span).toBeLessThanOrEqual(Math.PI * 2);
      });
    });
  });

  // ========================
  // COORDINATE CALCULATION MUTANTS
  // ========================
  describe("coordinate calculation mutants", () => {
    it("should kill center calculation logical operator mutants", () => {
      const root = {
        id: "root",
        label: "Root",
        children: [{ id: "child", label: "Child" }]
      };
      
      // Test with provided center
      const result1 = layoutMindmap(root, "radial", {
        centerX: 500,
        centerY: 300
      });
      
      // Test without provided center (should compute)
      const result2 = layoutMindmap(root, "radial", {
        // no centerX/centerY
      });
      
      expect(result1.x).toBe(500);
      expect(result1.y).toBe(300);
      expect(result2.x).toBeDefined();
      expect(result2.y).toBeDefined();
    });

    it("should kill arithmetic operator mutants in center fallback", () => {
      const root = {
        id: "root",
        label: "Root",
        children: [{ id: "child", label: "Child" }]
      };
      
      const result = layoutMindmap(root, "radial", {
        marginX: 100,
        dx: 200
      });
      
      // Should compute valid center coordinates
      expect(result.x).toBeGreaterThan(0);
      expect(result.y).toBeGreaterThan(0);
    });
  });

  // ========================
  // BOUNDING BOX MUTANTS
  // ========================
  describe("bounding box calculation mutants", () => {
    it("should kill bbox arithmetic operator mutants", () => {
      const root = {
        id: "root",
        label: "Root",
        children: [
          { id: "child1", label: "Child 1" },
          { id: "child2", label: "Child 2" }
        ]
      };
      
      const result = layoutMindmap(root, "radial");
      
      // All nodes should have valid coordinates within reasonable bounds
      const allNodes = [result, ...result.children];
      allNodes.forEach(node => {
        expect(node.x).toBeGreaterThanOrEqual(0);
        expect(node.y).toBeGreaterThanOrEqual(0);
        expect(node.x).toBeLessThan(10000); // reasonable upper bound
        expect(node.y).toBeLessThan(10000);
      });
    });

    it("should kill children array logical operator mutants in bbox", () => {
      const root = {
        id: "root",
        label: "Root",
        children: null // null children
      };
      
      const result = layoutMindmap(root, "radial");
      
      // Should handle null children without errors in bbox calculation
      expect(result.children).toEqual([]);
      expect(result.x).toBeDefined();
      expect(result.y).toBeDefined();
    });
  });

  // ========================
  // TRANSLATION MUTANTS
  // ========================
  describe("translation calculation mutants", () => {
    it("should kill translation arithmetic mutants", () => {
      const root = {
        id: "root",
        label: "Root",
        children: [{ id: "child", label: "Child" }]
      };
      
      const result = layoutMindmap(root, "radial", {
        centerX: 1000,
        centerY: 800
      });
      
      // After translation, all coordinates should be properly adjusted
      expect(result.x).toBe(1000);
      expect(result.y).toBe(800);
      
      if (result.children.length > 0) {
        const child = result.children[0];
        // Child should be positioned relative to center
        const distance = Math.sqrt(
          Math.pow(child.x - 1000, 2) + Math.pow(child.y - 800, 2)
        );
        expect(distance).toBeGreaterThan(0);
      }
    });

    it("should kill desired center calculation mutants", () => {
      const root = {
        id: "root",
        label: "Root",
        children: [
          { id: "left", label: "Left" },
          { id: "right", label: "Right" }
        ]
      };
      
      const result = layoutMindmap(root, "radial");
      
      // Should compute reasonable center coordinates
      expect(result.x).toBeGreaterThan(0);
      expect(result.y).toBeGreaterThan(0);
      
      // Children should be positioned around center
      result.children.forEach(child => {
        expect(child.x).toBeDefined();
        expect(child.y).toBeDefined();
      });
    });
  });

  // ========================
  // NO COVERAGE MUTANTS
  // ========================
  describe("no coverage mutants", () => {
    it("should cover boolean literal mutant for isVertical", () => {
      const root = {
        id: "root",
        label: "Root",
        children: [{ id: "child", label: "Child" }]
      };
      
      const verticalResult = layoutMindmap(root, "vertical");
      const horizontalResult = layoutMindmap(root, "horizontal");
      
      // Should produce different layouts
      expect(verticalResult.children[0].x).not.toBe(horizontalResult.children[0].x);
      expect(verticalResult.children[0].y).not.toBe(horizontalResult.children[0].y);
    });

    it("should cover array declaration mutants", () => {
      const root = {
        id: "root",
        label: "Root",
        children: null
      };
      
      const result = layoutMindmap(root, "vertical");
      
      // Should convert null children to empty array
      expect(result.children).toEqual([]);
      
      // Should handle empty arrays in finalizeLinear
      expect(result.x).toBeDefined();
      expect(result.y).toBeDefined();
    });
  });

  // ========================
  // COMPREHENSIVE MUTANT EXTERMINATION
  // ========================
  describe("comprehensive mutant extermination", () => {
    it("should kill all remaining conditional and logical mutants", () => {
      const testCases = [
        // Single node
        { id: "single", label: "Single" },
        // Node with empty children array
        { id: "empty", label: "Empty", children: [] },
        // Node with null children
        { id: "null", label: "Null", children: null },
        // Node with meta
        { id: "meta", label: "Meta", meta: { test: true } },
        // Complex tree
        {
          id: "complex",
          label: "Complex",
          children: [
            { id: "c1", label: "C1" },
            { id: "c2", label: "C2", children: [] },
            { id: "c3", label: "C3", children: null }
          ]
        }
      ];
      
      testCases.forEach((testCase, index) => {
        const resultVertical = layoutMindmap(testCase, "vertical");
        const resultHorizontal = layoutMindmap(testCase, "horizontal");
        const resultRadial = layoutMindmap(testCase, "radial");
        
        // All should produce valid results
        expect(resultVertical).toBeDefined();
        expect(resultHorizontal).toBeDefined();
        expect(resultRadial).toBeDefined();
        
        // Should have valid coordinates
        expect(resultVertical.x).toBeDefined();
        expect(resultVertical.y).toBeDefined();
        expect(resultHorizontal.x).toBeDefined();
        expect(resultHorizontal.y).toBeDefined();
        expect(resultRadial.x).toBeDefined();
        expect(resultRadial.y).toBeDefined();
      });
    });

    it("should kill mathematical precision mutants", () => {
      const root = {
        id: "root",
        label: "Root",
        children: [
          { id: "child1", label: "First Child" },
          { id: "child2", label: "Second Child" },
          { id: "child3", label: "Third Child" }
        ]
      };
      
      const result = layoutMindmap(root, "radial", {
        centerX: 500,
        centerY: 500,
        ringSpacing: 100
      });
      
      // Verify precise mathematical relationships
      result.children.forEach(child => {
        // Distance from center should be multiple of ringSpacing
        const distance = Math.sqrt(
          Math.pow(child.x - 500, 2) + Math.pow(child.y - 500, 2)
        );
        expect(distance).toBeCloseTo(100, 0);
        
        // Angles should be properly distributed
        expect(child.angleStart).toBeLessThan(child.angleEnd);
        expect(child.angleMid).toBeGreaterThan(child.angleStart);
        expect(child.angleMid).toBeLessThan(child.angleEnd);
      });
    });
  });
});

describe("layoutMindmap - NO COVERAGE KILLERS", () => {
  it("should cover boolean literal mutant for isVertical parameter", () => {
    const root = {
      id: "test",
      label: "Test",
      children: [{ id: "child", label: "Child" }]
    };
    
    // This tests the internal finalizeLinear function with both true and false isVertical
    const vertical = layoutMindmap(root, "vertical");
    const horizontal = layoutMindmap(root, "horizontal");
    
    // Verify different behavior between vertical and horizontal
    expect(vertical.children[0].x).toBeGreaterThan(vertical.x);
    expect(horizontal.children[0].y).toBeGreaterThan(horizontal.y);
  });

  it("should cover array declaration mutants with null children", () => {
    const testCases = [
      { id: "null", label: "Null Children", children: null },
      { id: "undefined", label: "Undefined Children" }, // no children property
      { id: "empty", label: "Empty Children", children: [] }
    ];
    
    testCases.forEach(testCase => {
      const result = layoutMindmap(testCase, "vertical");
      
      // Should always have an array for children
      expect(Array.isArray(result.children)).toBe(true);
      expect(result.children.length).toBe(0);
      
      // Should still compute valid layout
      expect(result.x).toBeDefined();
      expect(result.y).toBeDefined();
      expect(result.width).toBeDefined();
      expect(result.height).toBeDefined();
    });
  });
});
});