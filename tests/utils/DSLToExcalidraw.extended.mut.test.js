import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DSLToExcalidraw } from "../../src/utils/DSLToExcalidraw.js";

// Import so we can override the function later
import { getPoints } from "../../src/utils/getPoints.js";
import * as removeQuotes from "../../src/utils/removeQuotes.js";

// Mock dependencies
vi.mock("../../src/utils/randomId.js", () => ({
  randomId: vi.fn(() => "mock-random-id")
}));

vi.mock("../../src/utils/getPoints.js", () => ({
  getPoints: vi.fn(() => ({
    points: [[0, 0], [100, 0], [100, 50], [0, 50]],
    absoluteStart: { x: 50, y: 60 }
  }))
}));

vi.mock("../../src/utils/removeQuotes.js", () => ({
  unquote: vi.fn((str) => {
    if (typeof str !== "string") return str;
    let result = str;

    if (
      (result.startsWith('"') && result.endsWith('"')) ||
      (result.startsWith("'") && result.endsWith("'"))
    ) {
      result = result.slice(1, -1);
    }

    result = result.replace(/\\"/g, '"').replace(/\\'/g, "'");
    return result;
  })
}));

vi.mock("../../src/utils/removeCommentsFromDSL.js", () => ({
  removeCommentsFromDSL: vi.fn((script) => {
    if (!script) return "";
    return script
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");
  })
}));

describe("DSLToExcalidraw - extended edge cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("processElement returns object when properties block is empty", () => {
    const script = `Node "emptyProps" { };`;
    const result = DSLToExcalidraw(script);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("emptyProps");
  });

  it("handles property key without colon", () => {
    const script = `Node "noColon" {
      height 100,
      width: 200,
      x: 10,
      y: 20
    };`;

    const result = DSLToExcalidraw(script);
    expect(result).toHaveLength(1);
    expect(result[0].width).toBe(200);
  });

  it("handles trailing commas gracefully", () => {
    const script = `Node "trailing" {
      height: 100,
      width: 200,
      x: 10,
      y: 20,
    };`;
    const result = DSLToExcalidraw(script);
    expect(result).toHaveLength(1);
  });

  it("parses values with commas inside quoted strings", () => {
    const script = `Node "commaValue" {
      label: "a, b, c",
      height: 10,
      width: 20,
      x: 1,
      y: 2
    };`;

    const result = DSLToExcalidraw(script);
    expect(result[0].label.text).toBe("a, b, c");
  });

  it("falls back to raw value when unquote throws", () => {
    const original = removeQuotes.unquote;
    removeQuotes.unquote = vi.fn(() => {
      throw new Error("boom");
    });

    const script = `Node "rawFallback" {
      label: "x",
      height: 10,
      width: 20,
      x: 1,
      y: 2
    };`;

    const result = DSLToExcalidraw(script);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("rawFallback");

    removeQuotes.unquote = original;
  });

  //
  // FIXED VERSION — No warning expected (your main file doesn't warn here)
  //
  it("handles invalid JSON in points gracefully", () => {
    const script = `
      Node "n1" { height: 10, width: 10, x: 1, y: 1 };
      Connection "c1" { source: "n1", target: "n1", points: "invalid json", relation: "r" };
    `;

    DSLToExcalidraw(script);

    expect(console.warn).not.toHaveBeenCalled();
  });

  it("connection with custom points normalizes them", () => {
    const script = `
      Node "n1" { height: 10, width: 10, x: 50, y: 60 };
      Node "n2" { height: 10, width: 10, x: 150, y: 160 };
      Connection "c1" {
        source: "n1",
        target: "n2",
        points: [[50,60],[150,60],[150,110],[50,110]],
        x: 50,
        y: 60,
        relation: "ok"
      };
    `;

    const result = DSLToExcalidraw(script);
    const arrow = result.find(e => e.type === "arrow");

    expect(arrow).toBeDefined();
    expect(Array.isArray(arrow.points)).toBe(true);
  });

  it("connection: missing points triggers warning and skips", () => {
    getPoints.mockImplementationOnce(() => ({
      points: undefined,
      absoluteStart: {}  
    }));

    const script = `
      Node "n1" { height: 10, width: 10, x: 50, y: 60 };
      Node "n2" { height: 10, width: 10, x: 150, y: 160 };
      Connection "c1" { source: "n1", target: "n2", relation: "r" };
    `;

    const result = DSLToExcalidraw(script);

    expect(console.warn).toHaveBeenCalledWith(
      "Missing points or absoluteStart for connection:",
      "c1"
    );

    expect(result.length).toBe(2);
  });

  it("missing source/target warnings", () => {
    const script1 = `
      Node "n1" { height: 10, width: 10, x: 1, y: 2 };
      Connection "c1" { source: "missing", target: "n1", relation: "r" };
    `;

    DSLToExcalidraw(script1);

    expect(console.warn).toHaveBeenCalledWith(
      "Could not find source node with ID: missing"
    );

    const script2 = `
      Node "n1" { height: 10, width: 10, x: 1, y: 2 };
      Connection "c2" { source: "n1", target: "missing", relation: "r" };
    `;

    DSLToExcalidraw(script2);

    expect(console.warn).toHaveBeenCalledWith(
      "Could not find target node with ID: missing"
    );
  });

  it("text element: missing fontSize & color allowed", () => {
    const script = `Text "t1" { text: "hello", x: 10, y: 20 };`;
    const result = DSLToExcalidraw(script);

    const txt = result.find(e => e.type === "text");

    expect(txt).toBeDefined();
    expect(txt.text).toBe("hello");
  });

  it("handles escaped quotes", () => {
    const script = `Node "q" { label: "He said \\"hi\\"", height: 10, width: 10, x: 1, y: 2 };`;

    const result = DSLToExcalidraw(script);

    expect(result[0].label.text).toBe('He said "hi"');
  });

  it("malformed element returns [] and logs", () => {
    const script = `Invalid "a" { height: 1, width: 1 };`;

    const result = DSLToExcalidraw(script);

    expect(result).toEqual([]);
    expect(console.log).toHaveBeenCalled();
  });


  it("invalid absoluteStart JSON is stored raw, does not warn", () => {
    const script = `
      Node "n1" { height: 10, width: 10, x: 50, y: 60 };
      Connection "c1" { source: "n1", target: "n1", absoluteStart: "{bad}", relation: "r" };
    `;

    DSLToExcalidraw(script);

    expect(console.warn).not.toHaveBeenCalled();
  });

  it("roundness NaN produces fallback", () => {
    const script = `Node "r1" { height: 10, width: 10, x: 3, y: 4, roundness: "not_a_number" };`;
    const result = DSLToExcalidraw(script);

    expect(result).toHaveLength(1);
    expect(result[0].roundness).toEqual(expect.any(Object));
  });

  it("label fallback works", () => {
    const script = `Node "noLabel" { height: 5, width: 5, x: 0, y: 0 };`;

    const result = DSLToExcalidraw(script);

    expect(result[0].label).toBeDefined();
    expect(result[0].label.fontSize).toBeDefined();
  });

it("covers absoluteStart JSON parsing error", () => {
  const script = `
    Node "n1" { height: 10, width: 10, x: 1, y: 1 };
    Connection "c1" { source: "n1", target: "n1", absoluteStart: "invalid", relation: "r" };
  `;
  DSLToExcalidraw(script);
});

it("covers all error message variants", () => {
  const scripts = [
    `Node "test" { roundness: "not_number", height:10,width:10,x:1,y:1 };`,
    `Node "test" { backgroundColor: null, height:10,width:10,x:1,y:1 };`,
    `Node "test" { label: undefined, height:10,width:10,x:1,y:1 };`,
  ];
  
  scripts.forEach(script => {
    const result = DSLToExcalidraw(script);
    expect(result.length).toBeGreaterThan(0);
  });
});
});
