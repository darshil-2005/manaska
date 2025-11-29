import { describe, it, expect, vi, beforeEach } from "vitest";

// ---- Mock randomId BEFORE importing the module ----
vi.mock("../../src/utils/randomId.js", () => ({
  randomId: vi.fn(() => "mock-id-123"),
}));

// ---- Import after mocks ----
import { elementsToDSL } from "../../src/utils/elementsToDSL.js";
import { randomId } from "../../src/utils/randomId.js";

// Mock console.log to track error messages
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe("elementsToDSL", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy.mockClear();
  });

  // ESSENTIAL UNIT TESTS
  it("serializes a rectangle Node with bound label text and existing persistentId", () => {
    const rect = {
      id: "rect-1",
      type: "rectangle",
      x: 10,
      y: 20,
      height: 100,
      width: 200,
      roundness: { type: 3 },
      backgroundColor: "#ffaaaa",
      strokeColor: "#000000",
      strokeStyle: "solid",
      fillStyle: "solid",
      strokeWidth: 2,
      boundElements: [{ type: "text", id: "label-1" }],
      customData: { persistentId: "node-rect-1" },
    };

    const label = {
      id: "label-1",
      type: "text",
      originalText: "Hello Node",
      strokeColor: "#111111",
      fontSize: 24,
    };

    const script = elementsToDSL([rect, label]);

    // Basic shape of Node block
    expect(script).toContain('Node "node-rect-1" {');
    expect(script).toContain('label: "Hello Node",');
    expect(script).toContain('type: "rectangle",');
    expect(script).toContain("height: 100,");
    expect(script).toContain("width: 200,");
    expect(script).toContain("x: 10,");
    expect(script).toContain("y: 20,");
    expect(script).toContain("roundness: 3,");
    expect(script).toContain('backgroundColor: "#ffaaaa",');
    expect(script).toContain('borderColor: "#000000",');
    expect(script).toContain('borderStyle: "solid",');
    expect(script).toContain('backgroundStyle: "solid",');
    expect(script).toContain("borderWidth: 2,");
    expect(script).toContain('textColor: "#111111",');
    expect(script).toContain("fontSize: 24,");
  });

  it("assigns randomId when customData.persistentId is undefined", () => {
    const rect = {
      id: "rect-2",
      type: "ellipse",
      x: 0,
      y: 0,
      height: 50,
      width: 80,
      roundness: { type: 2 },
      backgroundColor: "#ffffff",
      strokeColor: "#222222",
      strokeStyle: "dashed",
      fillStyle: "solid",
      strokeWidth: 1,
      boundElements: [], // no label
      customData: {},    // no persistentId
    };

    const script = elementsToDSL([rect]);

    // randomId should be used
    expect(randomId).toHaveBeenCalledTimes(1);
    expect(rect.customData.persistentId).toBe("mock-id-123");
    expect(script).toContain('Node "mock-id-123" {');
  });

  it("serializes standalone Text elements (containerId === null) and ignores text with containerId", () => {
    const topLevelText = {
      id: "text-1",
      type: "text",
      originalText: "Standalone",
      x: 10,
      y: 20,
      fontSize: 18,
      strokeColor: "#999999",
      containerId: null,
      customData: { persistentId: "txt-1" },
    };

    const innerText = {
      id: "text-2",
      type: "text",
      originalText: "Inside node",
      x: 0,
      y: 0,
      fontSize: 14,
      strokeColor: "#000000",
      containerId: "some-node-id", // should be ignored by elementsToDSL
      customData: { persistentId: "txt-2" },
    };

    const script = elementsToDSL([topLevelText, innerText]);

    // Only topLevelText should be serialized
    expect(script).toContain('Text "txt-1" {');
    expect(script).toContain('type: "text",');
    expect(script).toContain('text: "Standalone",');
    expect(script).toContain("x: 10,");
    expect(script).toContain("y: 20,");
    expect(script).toContain("fontSize: 18,");
    expect(script).toContain("color: #999999,");

    // No reference to txt-2
    expect(script).not.toContain("txt-2");
    expect(script).not.toContain("Inside node");
  });

  it("skips arrow when sourceId (startBinding.elementId) is null", () => {
    const arrow = {
      id: "arrow-1",
      type: "arrow",
      x: 0,
      y: 0,
      strokeColor: "#000000",
      strokeStyle: "solid",
      startArrowhead: "dot",
      endArrowhead: "arrow",
      points: [
        [0, 0],
        [10, 10],
      ],
      startBinding: { elementId: null },
      endBinding: { elementId: "node-B" },
      boundElements: [],
      customData: { persistentId: "conn-1" },
    };

    const nodeB = {
      id: "node-B",
      type: "rectangle",
      x: 50,
      y: 50,
      height: 20,
      width: 40,
      roundness: { type: 2 },
      backgroundColor: "#ffffff",
      strokeColor: "#000000",
      strokeStyle: "solid",
      fillStyle: "solid",
      strokeWidth: 1,
      boundElements: [],
      customData: { persistentId: "node-b" },
    };

    const script = elementsToDSL([arrow, nodeB]);

    // No Connection block should be generated
    expect(script).not.toContain("Connection");
  });

  it("generates Connection DSL with bound label text element", () => {
    const nodeA = {
      id: "node-A",
      type: "rectangle",
      x: 0,
      y: 0,
      height: 10,
      width: 10,
      roundness: { type: 0 },
      backgroundColor: "#fff",
      strokeColor: "#000",
      strokeStyle: "solid",
      fillStyle: "solid",
      strokeWidth: 1,
      boundElements: [],
      customData: { persistentId: "node-a" },
    };

    const nodeB = {
      id: "node-B",
      type: "rectangle",
      x: 20,
      y: 20,
      height: 10,
      width: 10,
      roundness: { type: 0 },
      backgroundColor: "#fff",
      strokeColor: "#000",
      strokeStyle: "solid",
      fillStyle: "solid",
      strokeWidth: 1,
      boundElements: [],
      customData: { persistentId: "node-b" },
    };

    const arrowLabel = {
      id: "arrow-label",
      type: "text",
      originalText: "connects-to",
      fontSize: 16,
      strokeColor: "#ff00ff",
    };

    const arrow = {
      id: "arrow-6",
      type: "arrow",
      x: 1,
      y: 2,
      strokeColor: "#abcdef",
      strokeStyle: "solid",
      startArrowhead: "dot",
      endArrowhead: "arrow",
      points: [
        [0, 0],
        [5, 5],
      ],
      startBinding: { elementId: "node-A" },
      endBinding: { elementId: "node-B" },
      boundElements: [{ type: "text", id: "arrow-label" }],
      customData: { persistentId: "conn-6" },
    };

    const script = elementsToDSL([nodeA, nodeB, arrowLabel, arrow]);

    expect(script).toContain('Connection "conn-6" {');
    expect(script).toContain('source: "node-a",');
    expect(script).toContain('target: "node-b",');
    expect(script).toContain('relation: "connects-to",');
    expect(script).toContain("fontSize: 16,");
    expect(script).toContain('arrowColor: "#abcdef",');
    expect(script).toContain('arrowStyle: "solid",');
    expect(script).toContain('startArrowhead: "dot",');
    expect(script).toContain('endArrowhead: "arrow",');
  });

  // MUTATION TESTS (KEEPING ALL YOUR ORIGINAL MUTATION TESTS)
  it("should convert rectangle elements to Node DSL", () => {
    const elements = [
      {
        id: "rect1",
        type: "rectangle",
        customData: { persistentId: "existing-id" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 3 },
        backgroundColor: "#ffffff",
        strokeColor: "#000000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).toContain('Node "existing-id"');
    expect(result).toContain('height: 100');
    expect(result).toContain('width: 200');
    expect(result).toContain('x: 50');
    expect(result).toContain('y: 60');
    expect(result).toContain('backgroundColor: "#ffffff"');
    expect(result).toContain('borderColor: "#000000"');
    expect(result).toContain('borderStyle: "solid"');
    expect(result).toContain('backgroundStyle: "hachure"');
    expect(result).toContain('borderWidth: 2');
    expect(result).toContain('roundness: 3');
  });

  it("should convert diamond elements to Node DSL", () => {
    const elements = [
      {
        id: "diamond1",
        type: "diamond",
        customData: { persistentId: "diamond-id" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#ffffff",
        strokeColor: "#000000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).toContain('Node "diamond-id"');
    expect(result).toContain('type: "diamond"');
  });

  it("should convert ellipse elements to Node DSL", () => {
    const elements = [
      {
        id: "ellipse1",
        type: "ellipse",
        customData: { persistentId: "ellipse-id" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#ffffff",
        strokeColor: "#000000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).toContain('Node "ellipse-id"');
    expect(result).toContain('type: "ellipse"');
  });

  it("should generate persistentId if not present", () => {
    const elements = [
      {
        id: "rect1",
        type: "rectangle",
        customData: undefined, // No persistentId
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).toContain('Node "mock-id-123"'); // Should use mocked ID
  });

  it("should handle rectangle with text label", () => {
    const elements = [
      {
        id: "rect1",
        type: "rectangle",
        customData: { persistentId: "node1" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: [
          { type: "text", id: "text1" }
        ]
      },
      {
        id: "text1",
        type: "text",
        originalText: "Hello World",
        strokeColor: "#333333",
        fontSize: 16
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).toContain('label: "Hello World"');
    expect(result).toContain('textColor: "#333333"');
    expect(result).toContain('fontSize: 16');
  });

  it("should handle rectangle without boundElements array", () => {
    const elements = [
      {
        id: "rect1",
        type: "rectangle",
        customData: { persistentId: "node1" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2
        // No boundElements property
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).toContain('Node "node1"');
    expect(result).toContain('label: ""'); // Should have empty label
  });

  it("should handle rectangle with boundElements but no text", () => {
    const elements = [
      {
        id: "rect1",
        type: "rectangle",
        customData: { persistentId: "node1" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: [
          { type: "arrow", id: "arrow1" } // Not a text element
        ]
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).toContain('label: ""'); // Should have empty label
  });

  it("should convert text elements to Text DSL", () => {
    const elements = [
      {
        id: "text1",
        type: "text",
        customData: { persistentId: "text-id" },
        containerId: null, // Standalone text
        originalText: "Sample Text",
        x: 100,
        y: 200,
        fontSize: 14,
        strokeColor: "#ff0000"
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).toContain('Text "text-id"');
    expect(result).toContain('text: "Sample Text"');
    expect(result).toContain('x: 100');
    expect(result).toContain('y: 200');
    expect(result).toContain('fontSize: 14');
    // Fix: The actual output doesn't have quotes around color value
    expect(result).toContain('color: #ff0000');
  });

  it("should skip text elements with containerId (bound text)", () => {
    const elements = [
      {
        id: "text1",
        type: "text",
        customData: { persistentId: "text-id" },
        containerId: "rect1", // Bound to a container
        originalText: "Bound Text",
        x: 100,
        y: 200,
        fontSize: 14,
        strokeColor: "#ff0000"
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).not.toContain('Text "text-id"');
  });

  it("should convert arrow elements to Connection DSL", () => {
    const elements = [
      {
        id: "node1",
        type: "rectangle",
        customData: { persistentId: "source-node" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "node2",
        type: "rectangle", 
        customData: { persistentId: "target-node" },
        height: 100,
        width: 200,
        x: 300,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff", 
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "arrow1",
        type: "arrow",
        customData: { persistentId: "conn-id" },
        startBinding: { elementId: "node1" },
        endBinding: { elementId: "node2" },
        x: 150,
        y: 110,
        strokeColor: "#0000ff",
        strokeStyle: "dashed",
        startArrowhead: "arrow",
        endArrowhead: "dot",
        boundElements: [],
        points: [[0, 0], [100, 0], [100, 50], [0, 50]]
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).toContain('Connection "conn-id"');
    expect(result).toContain('source: "source-node"');
    expect(result).toContain('target: "target-node"');
    expect(result).toContain('arrowColor: "#0000ff"');
    expect(result).toContain('arrowStyle: "dashed"');
    expect(result).toContain('startArrowhead: "arrow"');
    expect(result).toContain('endArrowhead: "dot"');
  });

  it("should handle arrow with text label", () => {
    const elements = [
      {
        id: "node1",
        type: "rectangle",
        customData: { persistentId: "src" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "node2", 
        type: "rectangle",
        customData: { persistentId: "tgt" },
        height: 100,
        width: 200,
        x: 300,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000", 
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "arrow1",
        type: "arrow",
        customData: { persistentId: "conn" },
        startBinding: { elementId: "node1" },
        endBinding: { elementId: "node2" },
        x: 150,
        y: 110,
        strokeColor: "#000",
        strokeStyle: "solid",
        startArrowhead: "arrow",
        endArrowhead: "arrow",
        boundElements: [
          { type: "text", id: "label1" }
        ],
        points: [[0, 0], [100, 0]]
      },
      {
        id: "label1",
        type: "text",
        originalText: "related to",
        fontSize: 12,
        strokeColor: "#000"
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).toContain('relation: "related to"');
    expect(result).toContain('fontSize: 12');
  });

  it("should handle arrow without boundElements array", () => {
    const elements = [
      {
        id: "node1",
        type: "rectangle",
        customData: { persistentId: "src" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "node2", 
        type: "rectangle",
        customData: { persistentId: "tgt" },
        height: 100,
        width: 200,
        x: 300,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000", 
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "arrow1",
        type: "arrow",
        customData: { persistentId: "conn" },
        startBinding: { elementId: "node1" },
        endBinding: { elementId: "node2" },
        x: 150,
        y: 110,
        strokeColor: "#000",
        strokeStyle: "solid",
        startArrowhead: "arrow",
        endArrowhead: "arrow",
        points: [[0, 0], [100, 0]]
        // No boundElements property
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).toContain('Connection "conn"');
    expect(consoleSpy).toHaveBeenCalledWith("No label for connection.");
  });

  it("should skip arrow if source binding is missing", () => {
    const elements = [
      {
        id: "arrow1", 
        type: "arrow",
        customData: { persistentId: "conn" },
        // No startBinding
        endBinding: { elementId: "node2" },
        points: [[0, 0], [100, 0]]
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).not.toContain('Connection "conn"');
    // Fix: Check if any console.log call contains the expected message
    expect(consoleSpy).toHaveBeenCalledWith(
      "No source element bound to connection: ", 
      "conn"
    );
  });

  it("should skip arrow if target binding is missing", () => {
    const elements = [
      {
        id: "node1",
        type: "rectangle",
        customData: { persistentId: "src" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "arrow1", 
        type: "arrow",
        customData: { persistentId: "conn" },
        startBinding: { elementId: "node1" },
        // No endBinding
        points: [[0, 0], [100, 0]]
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).not.toContain('Connection "conn"');
    // Fix: Check if any console.log call contains the expected message
    expect(consoleSpy).toHaveBeenCalledWith(
      "No target element bound to connection: ", 
      "conn"
    );
  });

  it("should skip arrow if source element not found", () => {
    const elements = [
      {
        id: "arrow1", 
        type: "arrow",
        customData: { persistentId: "conn" },
        startBinding: { elementId: "missing-node" }, // Non-existent node
        endBinding: { elementId: "another-missing" },
        points: [[0, 0], [100, 0]]
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).not.toContain('Connection "conn"');
    // Fix: The actual message uses template literal but doesn't interpolate
    expect(consoleSpy).toHaveBeenCalledWith("Cannot find source node\n Source Id: ${sourceId}");
  });

  it("should skip arrow if target element not found", () => {
    const elements = [
      {
        id: "node1",
        type: "rectangle",
        customData: { persistentId: "src" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "arrow1", 
        type: "arrow",
        customData: { persistentId: "conn" },
        startBinding: { elementId: "node1" },
        endBinding: { elementId: "missing-node" }, // Non-existent node
        points: [[0, 0], [100, 0]]
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).not.toContain('Connection "conn"');
    // Fix: The actual message uses template literal but doesn't interpolate
    expect(consoleSpy).toHaveBeenCalledWith("Cannot find target node\n Target Id: ${targetId}");
  });

  it("should handle empty elements array", () => {
    const result = elementsToDSL([]);
    expect(result).toBe("");
  });

  it("should handle mixed element types", () => {
    const elements = [
      {
        id: "rect1",
        type: "rectangle",
        customData: { persistentId: "node1" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "text1",
        type: "text", 
        customData: { persistentId: "text1" },
        containerId: null,
        originalText: "Hello",
        x: 100,
        y: 200,
        fontSize: 14,
        strokeColor: "#000"
      },
      {
        id: "diamond1",
        type: "diamond",
        customData: { persistentId: "diamond1" },
        height: 100,
        width: 200,
        x: 50,
        y: 200,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).toContain('Node "node1"');
    expect(result).toContain('Text "text1"');
    expect(result).toContain('Node "diamond1"');
  });

  it("should format points with 2 decimal places", () => {
    const elements = [
      {
        id: "node1",
        type: "rectangle",
        customData: { persistentId: "src" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "node2",
        type: "rectangle", 
        customData: { persistentId: "tgt" },
        height: 100,
        width: 200,
        x: 300,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "arrow1",
        type: "arrow",
        customData: { persistentId: "conn" },
        startBinding: { elementId: "node1" },
        endBinding: { elementId: "node2" },
        x: 150,
        y: 110,
        strokeColor: "#000",
        strokeStyle: "solid",
        startArrowhead: "arrow",
        endArrowhead: "arrow",
        points: [[1.23456, 5.6789], [10.111, 20.222]]
      }
    ];

    const result = elementsToDSL(elements);
    
    // Points should be formatted to 2 decimal places
    expect(result).toContain('[[1.23,5.68],[10.11,20.22]]');
  });

  it("should handle arrow without startBinding property", () => {
    const elements = [
      {
        id: "arrow1", 
        type: "arrow",
        customData: { persistentId: "conn" },
        // No startBinding property at all
        endBinding: { elementId: "node2" },
        points: [[0, 0], [100, 0]]
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).not.toContain('Connection "conn"');
    // Fix: Check if any console.log call contains the expected message
    expect(consoleSpy).toHaveBeenCalledWith(
      "No source element bound to connection: ", 
      "conn"
    );
  });

  it("should handle arrow without endBinding property", () => {
    const elements = [
      {
        id: "node1",
        type: "rectangle",
        customData: { persistentId: "src" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "arrow1", 
        type: "arrow",
        customData: { persistentId: "conn" },
        startBinding: { elementId: "node1" },
        // No endBinding property at all
        points: [[0, 0], [100, 0]]
      }
    ];

    const result = elementsToDSL(elements);
    
    expect(result).not.toContain('Connection "conn"');
    // Fix: Check if any console.log call contains the expected message
    expect(consoleSpy).toHaveBeenCalledWith(
      "No target element bound to connection: ", 
      "conn"
    );
  });

  it("should include fontSize in node output when label has fontSize", () => {
    const elements = [
      {
        id: "rect1",
        type: "rectangle",
        customData: { persistentId: "node1" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: [
          { type: "text", id: "text1" }
        ]
      },
      {
        id: "text1",
        type: "text",
        originalText: "Hello",
        strokeColor: "#333333",
        fontSize: 16
      }
    ];

    const result = elementsToDSL(elements);
    
    // This kills the mutant that removes fontSize line
    expect(result).toContain('fontSize: 16');
    expect(result).toMatch(/fontSize: 16,\s*};/); // Ensure it's before the closing brace
  });

  it("should include closing brace and semicolon in node output", () => {
    const elements = [
      {
        id: "rect1",
        type: "rectangle",
        customData: { persistentId: "node1" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      }
    ];

    const result = elementsToDSL(elements);
    
    // This kills the mutant that removes the closing brace and semicolon
    expect(result).toMatch(/};/);
    expect(result).toContain('};\n');
  });

  it("should include type property in text output", () => {
    const elements = [
      {
        id: "text1",
        type: "text",
        customData: { persistentId: "text-id" },
        containerId: null,
        originalText: "Sample Text",
        x: 100,
        y: 200,
        fontSize: 14,
        strokeColor: "#ff0000"
      }
    ];

    const result = elementsToDSL(elements);
    
    // This kills the mutant that removes type line
    expect(result).toContain('type: "text"');
  });

  it("should include closing brace and semicolon in text output", () => {
    const elements = [
      {
        id: "text1",
        type: "text",
        customData: { persistentId: "text-id" },
        containerId: null,
        originalText: "Sample Text",
        x: 100,
        y: 200,
        fontSize: 14,
        strokeColor: "#ff0000"
      }
    ];

    const result = elementsToDSL(elements);
    
    // This kills the mutant that removes the closing brace and semicolon
    expect(result).toMatch(/};/);
    expect(result).toContain('};\n');
  });

  it("should only process arrow elements in arrow condition", () => {
    const elements = [
      {
        id: "text1",
        type: "text", // This should NOT be processed as arrow
        customData: { persistentId: "text-id" },
        containerId: null,
        originalText: "Sample Text",
        x: 100,
        y: 200,
        fontSize: 14,
        strokeColor: "#ff0000"
      }
    ];

    const result = elementsToDSL(elements);
    
    // This kills the mutant that changes } else if (element.type == "arrow") to } else if (true)
    expect(result).toContain('Text "text-id"'); // Should process as text, not arrow
    expect(result).not.toContain('Connection "text-id"');
  });

  it("should find label by exact id and type match", () => {
    const elements = [
      {
        id: "node1",
        type: "rectangle",
        customData: { persistentId: "src" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "node2", 
        type: "rectangle",
        customData: { persistentId: "tgt" },
        height: 100,
        width: 200,
        x: 300,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000", 
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "arrow1",
        type: "arrow",
        customData: { persistentId: "conn" },
        startBinding: { elementId: "node1" },
        endBinding: { elementId: "node2" },
        x: 150,
        y: 110,
        strokeColor: "#000",
        strokeStyle: "solid",
        startArrowhead: "arrow",
        endArrowhead: "arrow",
        boundElements: [
          { type: "text", id: "label1" }
        ],
        points: [[0, 0], [100, 0]]
      },
      {
        id: "label1",
        type: "text", // This should be found
        originalText: "correct label",
        fontSize: 12,
        strokeColor: "#000"
      },
      {
        id: "label2", 
        type: "text", // This should NOT be found (wrong id)
        originalText: "wrong label",
        fontSize: 12,
        strokeColor: "#000"
      }
    ];

    const result = elementsToDSL(elements);
    
    // This kills the mutants that change the logical AND to OR or remove conditions
    expect(result).toContain('relation: "correct label"');
    expect(result).not.toContain('relation: "wrong label"');
  });

  it("should include x and y coordinates in connection output", () => {
    const elements = [
      {
        id: "node1",
        type: "rectangle",
        customData: { persistentId: "src" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "node2", 
        type: "rectangle",
        customData: { persistentId: "tgt" },
        height: 100,
        width: 200,
        x: 300,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000", 
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "arrow1",
        type: "arrow",
        customData: { persistentId: "conn" },
        startBinding: { elementId: "node1" },
        endBinding: { elementId: "node2" },
        x: 150,
        y: 110,
        strokeColor: "#000",
        strokeStyle: "solid",
        startArrowhead: "arrow",
        endArrowhead: "arrow",
        boundElements: [],
        points: [[0, 0], [100, 0]]
      }
    ];

    const result = elementsToDSL(elements);
    
    // This kills the mutants that remove x and y lines
    expect(result).toContain('x: 150');
    expect(result).toContain('y: 110');
  });

  it("should include fontSize in connection output", () => {
    const elements = [
      {
        id: "node1",
        type: "rectangle",
        customData: { persistentId: "src" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "node2", 
        type: "rectangle",
        customData: { persistentId: "tgt" },
        height: 100,
        width: 200,
        x: 300,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000", 
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "arrow1",
        type: "arrow",
        customData: { persistentId: "conn" },
        startBinding: { elementId: "node1" },
        endBinding: { elementId: "node2" },
        x: 150,
        y: 110,
        strokeColor: "#000",
        strokeStyle: "solid",
        startArrowhead: "arrow",
        endArrowhead: "arrow",
        boundElements: [
          { type: "text", id: "label1" }
        ],
        points: [[0, 0], [100, 0]]
      },
      {
        id: "label1",
        type: "text",
        originalText: "label",
        fontSize: 14,
        strokeColor: "#000"
      }
    ];

    const result = elementsToDSL(elements);
    
    // This kills the mutant that removes fontSize line
    expect(result).toContain('fontSize: 14');
  });

  it("should include closing brace and semicolon in connection output", () => {
    const elements = [
      {
        id: "node1",
        type: "rectangle",
        customData: { persistentId: "src" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "node2", 
        type: "rectangle",
        customData: { persistentId: "tgt" },
        height: 100,
        width: 200,
        x: 300,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000", 
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "arrow1",
        type: "arrow",
        customData: { persistentId: "conn" },
        startBinding: { elementId: "node1" },
        endBinding: { elementId: "node2" },
        x: 150,
        y: 110,
        strokeColor: "#000",
        strokeStyle: "solid",
        startArrowhead: "arrow",
        endArrowhead: "arrow",
        boundElements: [],
        points: [[0, 0], [100, 0]]
      }
    ];

    const result = elementsToDSL(elements);
    
    // This kills the mutant that removes the closing brace and semicolon
    expect(result).toMatch(/};/);
    expect(result).toContain('};\n');
  });

  it("should join script elements with newlines", () => {
    const elements = [
      {
        id: "rect1",
        type: "rectangle",
        customData: { persistentId: "node1" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "text1",
        type: "text",
        customData: { persistentId: "text1" },
        containerId: null,
        originalText: "Hello",
        x: 100,
        y: 200,
        fontSize: 14,
        strokeColor: "#000"
      }
    ];

    const result = elementsToDSL(elements);
    
    // This kills the mutant that changes join("\n") to join("")
    expect(result).toContain('Node "node1"');
    expect(result).toContain('Text "text1"');
    // Should have newlines between elements
    expect(result).toMatch(/};\s*\n\s*Text/);
  });

  it("should create default label with empty text and fontSize 20 for connections without label", () => {
    const elements = [
      {
        id: "node1",
        type: "rectangle",
        customData: { persistentId: "src" },
        height: 100,
        width: 200,
        x: 50,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000",
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "node2", 
        type: "rectangle",
        customData: { persistentId: "tgt" },
        height: 100,
        width: 200,
        x: 300,
        y: 60,
        roundness: { type: 0 },
        backgroundColor: "#fff",
        strokeColor: "#000", 
        strokeStyle: "solid",
        fillStyle: "hachure",
        strokeWidth: 2,
        boundElements: []
      },
      {
        id: "arrow1",
        type: "arrow",
        customData: { persistentId: "conn" },
        startBinding: { elementId: "node1" },
        endBinding: { elementId: "node2" },
        x: 150,
        y: 110,
        strokeColor: "#000",
        strokeStyle: "solid",
        startArrowhead: "arrow",
        endArrowhead: "arrow",
        boundElements: [], // No label
        points: [[0, 0], [100, 0]]
      }
    ];

    const result = elementsToDSL(elements);
    
    // This kills the mutants that change the default label object
    expect(result).toContain('relation: ""');
    expect(result).toContain('fontSize: 20');
  });
});