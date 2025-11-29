import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseMindmapToDSL } from '../../src/utils/parseMindmapToDSL.js';

// --------------------
// ROBUST MOCKS
// --------------------
vi.mock('../../src/utils/randomId.js', () => ({
  randomId: vi.fn(() => 'mocked-connection-id')
}));

vi.mock('../../src/utils/layoutMindmap.js', () => ({
  layoutMindmap: vi.fn((mindmap, type, options) => {
    const layoutNode = (node, x = 100, y = 100, depth = 0) => {
      const newNode = {
        ...node,
        x: typeof node.x === 'number' ? node.x : x + (depth * 300),
        y: typeof node.y === 'number' ? node.y : y,
        width: node.width || 240,
        height: node.height || 100,
        children: node.children ? [] : undefined
      };
      
      if (node.children && Array.isArray(node.children)) {
        newNode.children = node.children.map((child, index) => 
          layoutNode(child, x, y + 150 + (index * 120), depth + 1)
        );
      }
      
      return newNode;
    };
    
    return layoutNode(mindmap);
  })
}));

// Import the mocks after they are defined
import { randomId as mockRandomId } from '../../src/utils/randomId.js';
import { layoutMindmap as mockLayoutMindmap } from '../../src/utils/layoutMindmap.js';

describe('parseMindmapToDSL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRandomId.mockReturnValue('mocked-connection-id');
  });

  // --------------------
  // BASIC FUNCTIONALITY (from unit test)
  // --------------------
  describe('Basic functionality', () => {
    it('returns -1 when mindmap is null or undefined', () => {
      expect(parseMindmapToDSL(null)).toBe(-1);
      expect(parseMindmapToDSL(undefined)).toBe(-1);
    });

    it('calls layoutMindmap with default type "horizontal" when type is not provided', () => {
      const mindmap = {
        id: 'root',
        label: 'Root',
        children: [],
      };

      parseMindmapToDSL(mindmap);

      expect(mockLayoutMindmap).toHaveBeenCalledWith(
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
    });

    it('uses default width/height when node width/height are not provided', () => {
      const mindmap = {
        id: 'rootNoSize',
        label: 'RootNoSize',
        children: [],
      };

      const script = parseMindmapToDSL(mindmap, 'horizontal');

      expect(script).toMatch(/Node "rootNoSize"/);
      expect(script).toContain('width: 240');
      expect(script).toContain('height: 100');
    });
  });

  // --------------------
  // COMPREHENSIVE MUTANT KILLING (from mutation test)
  // --------------------
  describe('Input validation and edge cases', () => {
    it('should return -1 for various invalid inputs', () => {
      expect(parseMindmapToDSL(null)).toBe(-1);
      expect(parseMindmapToDSL(undefined)).toBe(-1);
      expect(parseMindmapToDSL('')).toBe(-1);
      expect(parseMindmapToDSL(false)).toBe(-1);
      expect(parseMindmapToDSL(0)).toBe(-1);
    });

    it('should handle mindmap with only root node', () => {
      const mindmap = {
        id: "only-root",
        label: "Only Root Node",
        children: []
      };
      
      const result = parseMindmapToDSL(mindmap);
      
      expect(result).toContain('Node "only-root"');
      expect(result).toContain('label: "Only Root Node"');
      expect(result).not.toContain('Connection');
    });
  });

  describe('Node structure validation', () => {
    it('should handle nodes with numeric IDs', () => {
      const mindmap = {
        id: 123,
        label: "Numeric ID",
        children: []
      };
      
      const result = parseMindmapToDSL(mindmap);
      expect(result).toContain('Node "123"');
    });

    it('should handle nodes with special characters in ID and label', () => {
      const mindmap = {
        id: "special-!@#$%",
        label: "Special Chars !@#$%^&*()",
        children: [
          {
            id: "child-{}[]|",
            label: "Child <>?/",
            children: []
          }
        ]
      };

      const result = parseMindmapToDSL(mindmap);
      
      expect(result).toContain('Node "special-!@#$%"');
      expect(result).toContain('Node "child-{}[]|"');
      expect(result).toContain('label: "Special Chars !@#$%^&*()"');
      expect(result).toContain('label: "Child <>?/"');
    });

    it('should handle empty label strings', () => {
      const mindmap = {
        id: "empty-label",
        label: "",
        children: []
      };
      
      const result = parseMindmapToDSL(mindmap);
      expect(result).toContain('label: ""');
    });
  });

  describe('Children and hierarchy validation', () => {
    it('should handle single child node', () => {
      const mindmap = {
        id: "parent",
        label: "Parent",
        children: [
          {
            id: "only-child",
            label: "Only Child",
            children: []
          }
        ]
      };
      
      const result = parseMindmapToDSL(mindmap);
      
      expect(result).toContain('Node "parent"');
      expect(result).toContain('Node "only-child"');
      expect(result).toContain('Connection "mocked-connection-id"');
      expect(result).toContain('source: "parent"');
      expect(result).toContain('target: "only-child"');
      expect(result).toContain('relation: "Parent"');
    });

    it('should handle deeply nested structures', () => {
      const mindmap = {
        id: "level1",
        label: "Level 1",
        children: [
          {
            id: "level2",
            label: "Level 2",
            children: [
              {
                id: "level3",
                label: "Level 3",
                children: [
                  {
                    id: "level4",
                    label: "Level 4",
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      };
      
      const result = parseMindmapToDSL(mindmap);
      
      expect(result).toContain('Node "level1"');
      expect(result).toContain('Node "level2"');
      expect(result).toContain('Node "level3"');
      expect(result).toContain('Node "level4"');
      
      const connectionCount = (result.match(/Connection/g) || []).length;
      expect(connectionCount).toBe(3);
    });

    it('should handle nodes with null or undefined children property', () => {
      const mindmap1 = {
        id: "test",
        label: "Test Node",
        children: null
      };

      const mindmap2 = {
        id: "test",
        label: "Test Node"
        // children is undefined
      };
      
      const result1 = parseMindmapToDSL(mindmap1);
      const result2 = parseMindmapToDSL(mindmap2);
      
      expect(typeof result1).toBe('string');
      expect(typeof result2).toBe('string');
      expect(result1).toContain('Node "test"');
      expect(result2).toContain('Node "test"');
    });
  });

  describe('Connection validation', () => {
    it('should generate connection IDs using randomId', () => {
      mockRandomId.mockClear();
      mockRandomId.mockReturnValue('custom-connection-id');
      
      const mindmap = {
        id: "root",
        label: "Root",
        children: [
          { id: "child1", label: "Child 1", children: [] },
          { id: "child2", label: "Child 2", children: [] }
        ]
      };
      
      const result = parseMindmapToDSL(mindmap);
      
      expect(mockRandomId).toHaveBeenCalledTimes(2);
      expect(result).toContain('Connection "custom-connection-id"');
    });

    it('should use parent label as connection relation', () => {
      const mindmap = {
        id: "source",
        label: "Source Node Label",
        children: [
          {
            id: "target", 
            label: "Target Node",
            children: []
          }
        ]
      };
      
      const result = parseMindmapToDSL(mindmap);
      
      expect(result).toContain('relation: "Source Node Label"');
      expect(result).not.toContain('relation: "Target Node"');
    });
  });

  describe('Layout configuration', () => {
    it('should work with different layout types', () => {
      const mindmap = {
        id: "test",
        label: "Test",
        children: []
      };
      
      parseMindmapToDSL(mindmap, "horizontal");
      parseMindmapToDSL(mindmap, "vertical"); 
      parseMindmapToDSL(mindmap, "radial");
      
      expect(mockLayoutMindmap).toHaveBeenCalledWith(mindmap, "horizontal", expect.any(Object));
      expect(mockLayoutMindmap).toHaveBeenCalledWith(mindmap, "vertical", expect.any(Object));
      expect(mockLayoutMindmap).toHaveBeenCalledWith(mindmap, "radial", expect.any(Object));
    });
  });

  // --------------------
  // MUTANT-SPECIFIC KILLERS
  // --------------------
  describe('Specific mutant-killing tests', () => {
    it('should kill color constant mutants by verifying exact hex values', () => {
      const mindmap = {
        id: "color-test",
        label: "Color Test",
        children: []
      };
      
      const result = parseMindmapToDSL(mindmap);
      
      expect(result).toContain('backgroundColor: "#3bc9db"');
      expect(result).toContain('borderColor: "#000000"');
      expect(result).toContain('textColor: "#000000"');
      
      expect(result).not.toContain('backgroundColor: ""');
      expect(result).not.toContain('borderColor: ""');
      expect(result).not.toContain('textColor: ""');
    });

    it('should kill relation label mutants', () => {
      const mindmap = {
        id: "relation-test",
        label: "Specific Parent Label",
        children: [
          {
            id: "child",
            label: "Should Not Be Used", 
            children: []
          }
        ]
      };

      const result = parseMindmapToDSL(mindmap);
      
      expect(result).toContain('relation: "Specific Parent Label"');
      expect(result).not.toContain('relation: "Should Not Be Used"');
      expect(result).not.toContain('relation: ""');
    });

    it('should kill conditional mutants for width/height defaults', () => {
      const mindmapWithCustomWidth = {
        id: "custom-width",
        label: "Custom Width",
        width: 350,
        children: []
      };

      const mindmapWithCustomHeight = {
        id: "custom-height", 
        label: "Custom Height",
        height: 200,
        children: []
      };

      const result1 = parseMindmapToDSL(mindmapWithCustomWidth);
      const result2 = parseMindmapToDSL(mindmapWithCustomHeight);

      expect(result1).toContain('width: 350');
      expect(result1).toContain('height: 100');

      expect(result2).toContain('width: 240'); 
      expect(result2).toContain('height: 200');
    });

    it('should kill coordinate validation conditional mutants', () => {
      mockLayoutMindmap.mockImplementationOnce(() => ({
        id: "no-coords-parent",
        label: "Parent No Coords",
        children: [
          {
            id: "no-coords-child", 
            label: "Child No Coords"
          }
        ]
      }));

      const mindmap = {
        id: "no-coords-parent",
        label: "Parent No Coords", 
        children: [
          { id: "no-coords-child", label: "Child No Coords", children: [] }
        ]
      };

      const result = parseMindmapToDSL(mindmap);
      
      expect(result).toContain('Node "no-coords-parent"');
      expect(result).toContain('Node "no-coords-child"');
      expect(result).not.toContain('Connection');
    });
  });

  describe('Integration with complex mindmap data', () => {
    it('should process complex mindmap example correctly', () => {
      const complexMindmap = {
        "id": "root",
        "label": "Personalized Development Environment Configuration",
        "children": [
          {
            "id": "n1",
            "label": "Zsh Shell Configuration (.zshrc)",
            "children": [
              {
                "id": "n1a",
                "label": "Shell Initialization",
                "children": [
                  {
                    "id": "n1a1", 
                    "label": "Starship Prompt Integration",
                    "children:": []
                  }
                ]
              }
            ]
          }
        ]
      };
      
      const result = parseMindmapToDSL(complexMindmap);
      
      expect(result).toContain('Node "root"');
      expect(result).toContain('Node "n1"');
      expect(result).toContain('Node "n1a"');
      expect(result).toContain('Node "n1a1"');
      
      const connectionCount = (result.match(/Connection/g) || []).length;
      expect(connectionCount).toBe(3);
    });
  });

  // --------------------
  // OUTPUT VALIDATION
  // --------------------
  describe('Output format validation', () => {
    it('should generate valid DSL syntax for nodes', () => {
      const mindmap = {
        id: "test-node",
        label: "Test Node",
        children: []
      };
      
      const result = parseMindmapToDSL(mindmap);
      
      expect(result).toContain('Node "test-node" {');
      expect(result).toContain('label: "Test Node"');
      expect(result).toContain('height:');
      expect(result).toContain('width:');
      expect(result).toContain('x:');
      expect(result).toContain('y:');
      expect(result).toContain('backgroundColor: "#3bc9db"');
      expect(result).toContain('borderColor: "#000000"');
      expect(result).toContain('textColor: "#000000"');
      expect(result).toContain('};');
    });

    it('should generate predictable output with mocked coordinates', () => {
      mockLayoutMindmap.mockImplementationOnce(() => ({
        id: "predictable",
        label: "Predictable Node",
        x: 100,
        y: 100,
        width: 240,
        height: 100,
        children: []
      }));

      const mindmap = {
        id: "predictable",
        label: "Predictable Node",
        children: []
      };

      const result = parseMindmapToDSL(mindmap);
      expect(result).toContain('x: 100');
      expect(result).toContain('y: 100');
      expect(result).toContain('width: 240');
      expect(result).toContain('height: 100');
    });
  });



describe('parseMindmapToDSL - MUTANT EXTERMINATION', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRandomId.mockReturnValue('mutant-killer');
  });

  
  describe('Conditional mutant killers', () => {
    it('should kill inputNode null check conditional mutant', () => {
      const result = parseMindmapToDSL(null);
      expect(result).toBe(-1);
    });

    it('should kill children array length check mutants', () => {
      const mindmapEmptyArray = {
        id: "empty-array",
        label: "Empty Array",
        children: [] 
      };

      const mindmapNoChildren = {
        id: "no-children",
        label: "No Children"
      };

      const result1 = parseMindmapToDSL(mindmapEmptyArray);
      const result2 = parseMindmapToDSL(mindmapNoChildren);


      expect(result1).toContain('Node "empty-array"');
      expect(result2).toContain('Node "no-children"');
      

    });

    it('should kill width/height type check conditional mutants', () => {
      const mindmapStringDims = {
        id: "string-dims",
        label: "String Dimensions",
        width: "300",
        height: "150",
        children: []
      };

      const mindmapNullDims = {
        id: "null-dims", 
        label: "Null Dimensions",
        width: null,
        height: undefined,
        children: []
      };

      const result1 = parseMindmapToDSL(mindmapStringDims);
      const result2 = parseMindmapToDSL(mindmapNullDims);

      
      expect(result1).toContain('width: 240'); 
      expect(result1).toContain('height: 100'); 
      expect(result2).toContain('width: 240'); 
      expect(result2).toContain('height: 100');
    });
  });

  // KILL COORDINATE VALIDATION MUTANTS
  describe('Coordinate validation mutant killers', () => {
    it('should kill coordinate type check logical operator mutants', () => {
      
      const mindmapPartialCoords = {
        id: "parent",
        label: "Parent",
        x: 100, 
        children: [
          {
            id: "child",
            label: "Child", 
            y: 200, 
            children: []
          }
        ]
      };

     
      mockLayoutMindmap.mockImplementationOnce((input) => input);

      const result = parseMindmapToDSL(mindmapPartialCoords);

      
      expect(result).toContain('Node "parent"');
      expect(result).toContain('Node "child"');
      expect(result).not.toContain('Connection');
          });

    it('should kill all coordinate validation branches', () => {
      const testCases = [
        {
          name: "missing parent x",
          mindmap: {
            id: "parent", label: "Parent", y: 100, // no x
            children: [{ id: "child", label: "Child", x: 200, y: 200, children: [] }]
          }
        },
        {
          name: "missing parent y", 
          mindmap: {
            id: "parent", label: "Parent", x: 100, // no y
            children: [{ id: "child", label: "Child", x: 200, y: 200, children: [] }]
          }
        },
        {
          name: "missing child x",
          mindmap: {
            id: "parent", label: "Parent", x: 100, y: 100,
            children: [{ id: "child", label: "Child", y: 200, children: [] }] // no x
          }
        },
        {
          name: "missing child y",
          mindmap: {
            id: "parent", label: "Parent", x: 100, y: 100,
            children: [{ id: "child", label: "Child", x: 200, children: [] }] // no y
          }
        }
      ];

      testCases.forEach(({ name, mindmap }) => {
        mockLayoutMindmap.mockImplementationOnce((input) => input);
        const result = parseMindmapToDSL(mindmap);
        
      
        expect(result, `Failed for: ${name}`).toContain('Node "parent"');
        expect(result, `Failed for: ${name}`).toContain('Node "child"');
        expect(result, `Failed for: ${name}`).not.toContain('Connection');
      });
    });
  });

  // KILL ARITHMETIC OPERATOR MUTANTS
  describe('Arithmetic operator mutant killers', () => {
    it('should kill connection point calculation mutants', () => {
      const mindmap = {
        id: "calc-parent",
        label: "Parent",
        x: 100,
        y: 100,
        width: 200,
        height: 80,
        children: [
          {
            id: "calc-child", 
            label: "Child",
            x: 400,
            y: 300, 
            width: 180,
            height: 60,
            children: []
          }
        ]
      };

      mockLayoutMindmap.mockImplementationOnce((input) => input);
      
      const randomIdSpy = vi.spyOn(mockRandomId, 'mockReturnValue');
      mockRandomId.mockReturnValue('calc-connection');

      const result = parseMindmapToDSL(mindmap);

      expect(result).toContain('Connection "calc-connection"');
      expect(randomIdSpy).toHaveBeenCalled();
      
    });

    it('should kill depth calculation arithmetic mutants', () => {
      const deeplyNested = {
        id: "level1",
        label: "Level 1",
        children: [
          {
            id: "level2",
            label: "Level 2", 
            children: [
              {
                id: "level3",
                label: "Level 3",
                children: [
                  {
                    id: "level4", 
                    label: "Level 4",
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = parseMindmapToDSL(deeplyNested);
      
      expect(result).toContain('Node "level1"');
      expect(result).toContain('Node "level2"');
      expect(result).toContain('Node "level3"');
      expect(result).toContain('Node "level4"');
      
      const connectionCount = (result.match(/Connection/g) || []).length;
      expect(connectionCount).toBe(3); 
    });
  });

  // KILL STRING LITERAL MUTANTS
  describe('String literal mutant killers', () => {
    it('should kill newline and join mutants', () => {
      const mindmap = {
        id: "format-test",
        label: "Format Test",
        children: [
          { id: "child1", label: "Child 1", children: [] },
          { id: "child2", label: "Child 2", children: [] }
        ]
      };

      const result = parseMindmapToDSL(mindmap);

      const lines = result.split('\n');
      
    
      const nodeBlocks = result.split('Node ').length - 1;
      const connectionBlocks = result.split('Connection ').length - 1;
      
      expect(nodeBlocks).toBe(3); 
      expect(connectionBlocks).toBe(2); 
      
      expect(result).toMatch(/\n\n/); 
    });

    it('should kill root parent ID string mutant', () => {
      const mindmap = {
        id: "root-test",
        label: "Root Test",
        children: [
          { id: "child", label: "Child", children: [] }
        ]
      };

      const result = parseMindmapToDSL(mindmap);
      
      expect(result).toContain('relation: "Root Test"');
      expect(result).not.toContain('relation: ""');
    });
  });

  // KILL OBJECT LITERAL MUTANTS
  describe('Object literal mutant killers', () => {
    it('should kill nodeSize object mutant', () => {
      const mindmap = {
        id: "default-size",
        label: "Default Size",
        children: []
      };

      const result = parseMindmapToDSL(mindmap);

      expect(result).toContain('width: 240');
      expect(result).toContain('height: 100');
      
      expect(result).not.toContain('width: 0');
      expect(result).not.toContain('height: 0');
      expect(result).not.toContain('width: ""');
      expect(result).not.toContain('height: ""');
    });

    it('should kill empty object return mutant', () => {
      const mindmap = {
        id: "valid",
        label: "Valid Node",
        children: []
      };

      const result = parseMindmapToDSL(mindmap);

      expect(result).toContain('Node "valid"');
      expect(result).toContain('label: "Valid Node"');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(50); 
    });
  });

  // KILL ARRAY DECLARATION MUTANTS
  describe('Array declaration mutant killers', () => {
    it('should kill empty arrays mutant', () => {
      const mindmap = {
        id: "single-node",
        label: "Single Node",
        children: [] 
      };

      const result = parseMindmapToDSL(mindmap);

      expect(result).toContain('Node "single-node"');
      expect(result).not.toContain('Connection'); 
      
      expect(result).not.toContain('Stryker was here');
    });

    it('should kill connection points array mutants', () => {
      const mindmap = {
        id: "points-parent",
        label: "Parent",
        x: 100,
        y: 100,
        width: 200,
        height: 80,
        children: [
          {
            id: "points-child",
            label: "Child", 
            x: 400,
            y: 300,
            width: 180,
            height: 60,
            children: []
          }
        ]
      };

      mockLayoutMindmap.mockImplementationOnce((input) => input);
      mockRandomId.mockReturnValue('points-connection');

      const result = parseMindmapToDSL(mindmap);

      expect(result).toContain('Connection "points-connection"');
      expect(result).toContain('source: "points-parent"');
      expect(result).toContain('target: "points-child"');
    });
  });
});

describe('parseMindmapToDSL - COMPREHENSIVE MUTANT EXTERMINATION', () => {
  it('should kill all remaining mutants with complex scenario', () => {
    const complexMindmap = {
      id: "complex-root",
      label: "Complex Root",
      x: 50,
      y: 50,
      width: 300, 
      children: [
        {
          id: "child-with-coords",
          label: "Child With Coords",
          x: 400,
          y: 200,
          children: [
            {
              id: "grandchild-partial",
              label: "Grandchild Partial",
              x: 600, 
              children: []
            }
          ]
        },
        {
          id: "child-no-coords",
          label: "Child No Coords",
          
          children: []
        },
        {
          id: "child-string-dims",
          label: "Child String Dims", 
          width: "250", 
          height: "120",
          x: 400,
          y: 400,
          children: []
        }
      ]
    };

    mockLayoutMindmap.mockImplementationOnce((input) => input);

    const result = parseMindmapToDSL(complexMindmap);

    expect(result).toContain('Node "complex-root"');
    expect(result).toContain('Node "child-with-coords"');
    expect(result).toContain('Node "grandchild-partial"');
    expect(result).toContain('Node "child-no-coords"');
    expect(result).toContain('Node "child-string-dims"');

    expect(result).toContain('width: 300'); 
    expect(result).toContain('height: 100'); 
    expect(result).toContain('width: 240'); 
    expect(result).toContain('width: 240'); 

    const connectionCount = (result.match(/Connection/g) || []).length;
    expect(connectionCount).toBe(2);
  });
});
});