// tests/utils/elementsToDSL.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";

// ---- Mock randomId BEFORE importing the module ----
vi.mock("../../src/utils/randomId.js", () => ({
  randomId: vi.fn(() => "mock-id-123"),
}));

// ---- Import after mocks ----
import { elementsToDSL } from "../../src/utils/elementsToDSL.js";
import { randomId } from "../../src/utils/randomId.js";

describe("elementsToDSL", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("handles Node without bound label text (uses empty label object)", () => {
    const rect = {
      id: "rect-3",
      type: "diamond",
      x: 5,
      y: 5,
      height: 30,
      width: 40,
      roundness: { type: 1 },
      backgroundColor: "#cccccc",
      strokeColor: "#333333",
      strokeStyle: "solid",
      fillStyle: "cross-hatch",
      strokeWidth: 3,
      boundElements: [], // no text bound
      customData: { persistentId: "node-no-label" },
    };

    const script = elementsToDSL([rect]);

    expect(script).toContain('Node "node-no-label" {');
    // label.originalText is "" in this branch
    expect(script).toContain('label: "",');
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

  it("skips arrow when source node cannot be found", () => {
    const arrow = {
      id: "arrow-2",
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
      startBinding: { elementId: "missing-node" },
      endBinding: { elementId: "node-B" },
      boundElements: [],
      customData: { persistentId: "conn-2" },
    };

    const nodeB = {
      id: "node-B",
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
      customData: { persistentId: "node-b" },
    };

    const script = elementsToDSL([arrow, nodeB]);

    expect(script).not.toContain("Connection");
  });

  it("skips arrow when targetId (endBinding.elementId) is null", () => {
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

    const arrow = {
      id: "arrow-3",
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
      startBinding: { elementId: "node-A" },
      endBinding: { elementId: null },
      boundElements: [],
      customData: { persistentId: "conn-3" },
    };

    const script = elementsToDSL([nodeA, arrow]);

    expect(script).not.toContain("Connection");
  });

  it("skips arrow when target node cannot be found", () => {
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

    const arrow = {
      id: "arrow-4",
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
      startBinding: { elementId: "node-A" },
      endBinding: { elementId: "missing-node" },
      boundElements: [],
      customData: { persistentId: "conn-4" },
    };

    const script = elementsToDSL([nodeA, arrow]);

    expect(script).not.toContain("Connection");
  });

  it("generates Connection DSL with default label when no label bound", () => {
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

    const arrow = {
      id: "arrow-5",
      type: "arrow",
      x: 5,
      y: 6,
      strokeColor: "#123456",
      strokeStyle: "dotted",
      startArrowhead: "dot",
      endArrowhead: "arrow",
      points: [
        [0, 0],
        [10.1234, 20.5678],
      ],
      startBinding: { elementId: "node-A" },
      endBinding: { elementId: "node-B" },
      boundElements: [], // no label bound
      customData: { persistentId: "conn-5" },
    };

    const script = elementsToDSL([nodeA, nodeB, arrow]);

    expect(script).toContain('Connection "conn-5" {');
    expect(script).toContain('source: "node-a",');
    expect(script).toContain('target: "node-b",');
    // default labelElement: originalText: "" and fontSize: 20
    expect(script).toContain('relation: "",');
    expect(script).toContain("fontSize: 20,");
    // points rounded to 2 decimals
    expect(script).toContain('points: [[0,0],[10.12,20.57]]');
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
});
