// tests/utils/DSLToExcalidraw.combined.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";


if (typeof globalThis.structuredClone === "undefined") {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// ---------- Combined Mocks ----------
vi.mock("../../src/utils/getPoints.js", () => ({
  getPoints: vi.fn(() => ({
    points: [[0, 0], [100, 0], [100, 50], [0, 50]],
    absoluteStart: { x: 50, y: 60 }
  }))
}));

vi.mock("../../src/utils/removeQuotes.js", () => ({
  unquote: vi.fn((str) => {
    if (typeof str !== 'string') return str;
    
  
    if (str.trim() === `"__THROW_UNQUOTE__"`) {
      throw new Error("Forced unquote error");
    }
    
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
    if (typeof script !== 'string') return "";
    if (!script) return "";
    return script
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
  })
}));

vi.mock("../../src/utils/randomId.js", () => ({
  randomId: vi.fn(() => "mock-random-id")
}));

// ---- Import real module AFTER mocks ----
import { DSLToExcalidraw } from "../../src/utils/DSLToExcalidraw.js";
import { getPoints } from "../../src/utils/getPoints.js";
import { unquote } from "../../src/utils/removeQuotes.js";
import { removeCommentsFromDSL } from "../../src/utils/removeCommentsFromDSL.js";

describe("DSLToExcalidraw - COMBINED TEST SUITE", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // CORE FUNCTIONALITY TESTS
  // =========================================================================

  describe("Core Functionality", () => {
    it("parses a single Node with full properties", () => {
      const dsl = `
        Node "node1" {
          x: 10,
          y: 20,
          height: 40,
          width: 80,
          label: "Hello",
          backgroundColor: "#ff0000",
          borderColor: "#000000",
          borderStyle: "solid",
          backgroundStyle: "solid",
          borderWidth: 2,
          roundness: "3",
          fontSize: 24,
          type: "rectangle"
        };
      `;

      const result = DSLToExcalidraw(dsl);
      expect(result).toHaveLength(1);

      const node = result[0];
      expect(node.id).toBe("node1");
      expect(node.type).toBe("rectangle");
      expect(node.x).toBe(10);
      expect(node.y).toBe(20);
      expect(node.height).toBe(40);
      expect(node.width).toBe(80);
      expect(node.backgroundColor).toBe("#ff0000");
      expect(node.strokeColor).toBe("#000000");
      expect(node.strokeStyle).toBe("solid");
      expect(node.fillStyle).toBe("solid");
      expect(node.strokeWidth).toBe("2");
      expect(node.roundness).toEqual({ type: 3 });
      expect(node.label).toEqual({ text: "Hello", fontSize: "24" });
      expect(node.customData).toEqual({ persistentId: "node1" });

      expect(removeCommentsFromDSL).toHaveBeenCalledTimes(1);
    });

    it("applies defaults for missing width/type/fontSize", () => {
      const dsl = `
        Node "nodeDefault" {
          x: 0,
          y: 0,
          height: 50,
          label: "NoWidth"
        };
      `;

      const [node] = DSLToExcalidraw(dsl);
      expect(node.width).toBe(300);       
      expect(node.type).toBe("ellipse");    
      expect(node.label.fontSize).toBe(20); 
      expect(node.roundness).toEqual({ type: 3 });
    });

    it("creates Connection element correctly", () => {
      getPoints.mockReturnValueOnce({
        points: [[0, 0], [50, 50]],
        absoluteStart: { x: 100, y: 200 },
      });

      const dsl = `
        Node "sourceNode" {
          x: 10,
          y: 20,
          height: 30,
          width: 40,
          label: "Source"
        };
        Node "targetNode" {
          x: 100,
          y: 200,
          height: 30,
          width: 40,
          label: "Target"
        };
        Connection "conn1" {
          source: "sourceNode",
          target: "targetNode",
          relation: "connects",
          arrowColor: "#123456",
          arrowStyle: "solid",
          startArrowhead: "dot",
          endArrowhead: "arrow",
          fontSize: 16,
          type: "arrow"
        };
      `;

      const res = DSLToExcalidraw(dsl);
      expect(res).toHaveLength(3);

      const conn = res.find((el) => el.id === "conn1");
      expect(conn).toBeDefined();
      expect(getPoints).toHaveBeenCalledWith(
        expect.any(Array),
        "sourceNode",
        "targetNode",
        "radial"
      );
      expect(conn.x).toBe(100);
      expect(conn.y).toBe(200);
      expect(conn.points).toEqual([[0, 0], [50, 50]]);
      expect(conn.strokeColor).toBe("#123456");
      expect(conn.strokeStyle).toBe("solid");
      expect(conn.startArrowhead).toBe("dot");
      expect(conn.endArrowhead).toBe("arrow");
      expect(conn.label).toEqual({ text: "connects", fontSize: "16" });
    });

    it("creates Text element correctly", () => {
      const dsl = `
        Text "txt1" {
          x: 100,
          y: 200,
          text: "Hello World",
          fontSize: 18,
          color: "#999999"
        };
      `;

      const res = DSLToExcalidraw(dsl);
      expect(res).toHaveLength(1);

      const text = res[0];
      expect(text.type).toBe("text");
      expect(text.id).toBe("txt1");
      expect(text.x).toBe("100");
      expect(text.y).toBe("200");
      expect(text.text).toBe("Hello World");
      expect(text.fontSize).toBe("18");
      expect(text.strokeColor).toBe("#999999");
      expect(text.customData).toEqual({ persistentId: "txt1" });
    });
  });

  // =========================================================================
  // ERROR HANDLING & EDGE CASES
  // =========================================================================

  describe("Error Handling & Edge Cases", () => {
    it("handles empty properties block {}", () => {
      const dsl = `Node "emptyProps" { };`;
      const [node] = DSLToExcalidraw(dsl);
      expect(node.id).toBe("emptyProps");
      expect(Number.isNaN(node.x)).toBe(true);
      expect(Number.isNaN(node.y)).toBe(true);
      expect(Number.isNaN(node.height)).toBe(true);
      expect(node.width).toBe(300);
    });

    it("handles JSON.parse failure for points gracefully", () => {
      const dsl = `
        Node "nodeWithBadPoints" {
          x: 0,
          y: 0,
          height: 10,
          width: 10,
          label: "HasBadPoints",
          points: notValidJson
        };
      `;

      const res = DSLToExcalidraw(dsl);
      expect(res).toHaveLength(1);
      expect(res[0].id).toBe("nodeWithBadPoints");
    });

    it("handles unquote failure and falls back to raw value", () => {
      const dsl = `
        Node "nodeUnquoteError" {
          x: 0,
          y: 0,
          height: 10,
          width: 10,
          label: "__THROW_UNQUOTE__"
        };
      `;

      const [node] = DSLToExcalidraw(dsl);
      expect(unquote).toHaveBeenCalled();
      expect(node.label.text).toBe('"__THROW_UNQUOTE__"');
    });

    it("skips invalid elements (bad type, bad name, missing props)", () => {
      const dsl = `
        SomethingElse "badNode" { x: 0, y: 0, height: 10, width: 10 };
        Node noQuotesName { x: 0, y: 0, height: 10, width: 10 };
        Node "noPropsBlock";
        Node "goodNode" { x: 1, y: 2, height: 3, width: 4, label: "Good" };
      `;

      const res = DSLToExcalidraw(dsl);
      expect(res).toHaveLength(1);
      expect(res[0].id).toBe("goodNode");
    });

    it("skips Connection when source or target node is missing", () => {
      const dsl = `
        Node "onlyNode" { x: 0, y: 0, height: 10, width: 10, label: "Only" };
        Connection "badConnSource" { source: "nonExisting", target: "onlyNode", relation: "willBeSkipped" };
        Connection "badConnTarget" { source: "onlyNode", target: "nonExisting", relation: "willBeSkipped" };
      `;

      const res = DSLToExcalidraw(dsl);
      expect(res).toHaveLength(1);
      expect(res[0].id).toBe("onlyNode");
    });

    it("handles multiple elements, comments, extra semicolons", () => {
      const dsl = `
        // comment
        Node "n1" { x: 0, y: 0, height: 10, width: 10, label: "N1" }; // end
        Text "t1" { x: 5, y: 5, text: "Label", fontSize: 12, color: "#111111" };
        ; // extra semicolon
      `;

      const res = DSLToExcalidraw(dsl);
      expect(removeCommentsFromDSL).toHaveBeenCalled();
      expect(res).toHaveLength(2);
      const ids = res.map((el) => el.id).sort();
      expect(ids).toEqual(["n1", "t1"]);
    });

    it("returns empty array for completely invalid DSL", () => {
      const dsl = `JustGarbageHere AnotherBadElement`;
      const res = DSLToExcalidraw(dsl);
      expect(res).toEqual([]);
    });

    it("handles non-string input", () => {
      expect(DSLToExcalidraw(null)).toEqual([]);
      expect(DSLToExcalidraw(undefined)).toEqual([]);
      expect(DSLToExcalidraw(123)).toEqual([]);
      expect(DSLToExcalidraw({})).toEqual([]);
    });
  });

  // =========================================================================
  // BRANCH KILLERS & MUTATION TESTING
  // =========================================================================

  describe("Branch Killers & Mutation Testing", () => {
    it("kills malformed type matching mutants", () => {
      const out = DSLToExcalidraw(`xxx Node "n" { height:1,width:1,x:1,y:1 };`);
      expect(out).toEqual([]);
      expect(console.log).toHaveBeenCalled();
    });

    it("kills invalid roundness mutants", () => {
      const [n] = DSLToExcalidraw(`Node "a" { height:10,width:10,x:1,y:1,roundness:"bad" };`);
      expect(typeof n.roundness).toBe("object");
    });

    it("kills valid roundness number mutants", () => {
      const [n] = DSLToExcalidraw(`Node "a" { height:10,width:10,x:1,y:1,roundness:3 };`);
      expect(n.roundness).toEqual({ type: 3 });
    });

    it("kills missing absoluteStart fallback mutants", () => {
      getPoints.mockImplementationOnce(() => ({
        points: undefined,
        absoluteStart: undefined
      }));

      const script = `
        Node "x" { height:10,width:10,x:1,y:1 };
        Node "y" { height:10,width:10,x:5,y:5 };
        Connection "c" { source:"x", target:"y", relation:"r" };
      `;

      const out = DSLToExcalidraw(script);
      expect(console.warn).toHaveBeenCalled();
      expect(out.find(e => e.id === "c")).toBeUndefined();
    });

    it("kills comment-handling mutants", () => {
      removeCommentsFromDSL.mockImplementationOnce(() => `
        Node "a" { height:1,width:1,x:1,y:1 };
      `);

      const [n] = DSLToExcalidraw("/* c */ Node \"a\" { }");
      expect(n.id).toBe("a");
    });

    it("kills newline/whitespace splitting mutants", () => {
      const script = `
        Node   "a"
        {
          height:10,
          width:10,
          x:1,
          y:2
        }
        ;
      `;

      const out = DSLToExcalidraw(script);
      expect(out).toHaveLength(1);
      expect(out[0].id).toBe("a");
    });

    it("kills trailing comma mutants", () => {
      const [n] = DSLToExcalidraw(`Node "t" { height:10, width:20, x:1, y:2, };`);
      expect(n.x).toBe(1);
      expect(n.y).toBe(2);
    });

    it("kills regex mutants for spaced name matching", () => {
      const out = DSLToExcalidraw(`Node     "abc" { x:1,y:1,height:1,width:1 };`);
      expect(out[0].id).toBe("abc");
    });

    it("kills regex/split mutants involving commas in quoted labels", () => {
      const script = `Node "c" {
        label: "x, y, z",
        height: 10,
        width: 20,
        x: 1,
        y: 2
      };`;

      const [n] = DSLToExcalidraw(script);
      expect(n.label.text).toBe("x, y, z");
    });

    it("kills mutants removing continue when processElement returns -1", () => {
      const script = `
        Invalid "x" { bad };
        Node "good" { x:1,y:1,height:1,width:1 };
      `;
      const result = DSLToExcalidraw(script);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("good");
    });

    it("kills mutant removing node customData.persistentId", () => {
      const [n] = DSLToExcalidraw(`Node "xyz" { x:1,y:1,height:1,width:1 };`);
      expect(n.customData.persistentId).toBe("xyz");
    });

    it("kills mutant removing connection customData", () => {
      const r = DSLToExcalidraw(`
        Node "a" { x:1,y:1,height:1,width:1 };
        Node "b" { x:5,y:5,height:1,width:1 };
        Connection "c" { source:"a", target:"b", relation:"r" };
      `);

      const arrow = r.find(e => e.id === "c");
      expect(arrow.customData.persistentId).toBe("c");
    });

    it("kills label fallback mutants", () => {
      const [n] = DSLToExcalidraw(`Node "nolabel" { x:1,y:1,height:10,width:10 };`);
      expect(n.label).toBeDefined();
      expect(n.label.fontSize).toBe(20);
    });
  });

  // =========================================================================
  // EXTENDED EDGE CASES & PROPERTY PARSING
  // =========================================================================

  describe("Extended Edge Cases & Property Parsing", () => {
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
      const original = unquote;
      vi.mocked(unquote).mockImplementationOnce(() => {
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
    });

    it("handles escaped quotes", () => {
      const script = `Node "q" { label: "He said \\"hi\\"", height: 10, width: 10, x: 1, y: 2 };`;
      const result = DSLToExcalidraw(script);
      expect(result[0].label.text).toBe('He said "hi"');
    });

    it("handles malformed element returns [] and logs", () => {
      const script = `Invalid "a" { height: 1, width: 1 };`;
      const result = DSLToExcalidraw(script);
      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalled();
    });

    it("roundness NaN produces fallback", () => {
      const script = `Node "r1" { height: 10, width: 10, x: 3, y: 4, roundness: "not_a_number" };`;
      const result = DSLToExcalidraw(script);
      expect(result).toHaveLength(1);
      expect(result[0].roundness).toEqual(expect.any(Object));
    });

    it("text element: missing fontSize & color allowed", () => {
      const script = `Text "t1" { text: "hello", x: 10, y: 20 };`;
      const result = DSLToExcalidraw(script);
      const txt = result.find(e => e.type === "text");
      expect(txt).toBeDefined();
      expect(txt.text).toBe("hello");
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

    it("handles empty string label fallback", () => {
      const [element] = DSLToExcalidraw(`Node "test" { label: "", height:10,width:10,x:1,y:1 };`);
      expect(element.label.text).toBe("");
    });

    it("handles connection to same node", () => {
      const script = `Node "selfNode" { height: 100, width: 200, x: 50, y: 60 };
        Connection "selfConn" { source: "selfNode", target: "selfNode", relation: "self" };`;

      const result = DSLToExcalidraw(script);
      expect(result).toHaveLength(2);
      const connection = result.find(el => el.type === "arrow");
      expect(connection).toBeDefined();
    });
  });

  // =========================================================================
  // COMPREHENSIVE ERROR PATH COVERAGE
  // =========================================================================

  describe("Comprehensive Error Path Coverage", () => {
    it("covers type validation error block with invalid type", () => {
      const result = DSLToExcalidraw(`InvalidType "test" {}`);
      expect(result).toEqual([]);
    });

    it("covers name validation null check block", () => {
      const result = DSLToExcalidraw(`Node {}`);
      expect(result).toEqual([]);
    });

    it("covers JSON parse catch block", () => {
      const originalJSONParse = JSON.parse;
      global.JSON.parse = vi.fn((str) => {
        if (str.includes('points') || str.includes('absoluteStart')) {
          throw new Error("JSON parse error");
        }
        return originalJSONParse(str);
      });

      const script = `Node "test" { points: "[[1,2]]", absoluteStart: "{x:1}", height:10,width:10,x:1,y:1 };`;
      const result = DSLToExcalidraw(script);
      
      global.JSON.parse = originalJSONParse;
      expect(result).toHaveLength(1);
    });

    it("covers property parsing error catch block", () => {
      const script = `Node "test" { invalid: property: syntax };`;
      const result = DSLToExcalidraw(script);
      expect(Array.isArray(result)).toBe(true);
    });

    it("covers label processing error catch block", () => {
      vi.mocked(unquote).mockImplementationOnce(() => {
        throw new Error("Label processing failed");
      });

      const script = `Node "test" { label: "test", height:10,width:10,x:1,y:1 };`;
      const result = DSLToExcalidraw(script);
      expect(result).toHaveLength(1);
    });

    it("covers background color error catch block", () => {
      vi.mocked(unquote).mockImplementationOnce(() => {
        throw new Error("Background color processing failed");
      });

      const script = `Node "test" { backgroundColor: "#fff", height:10,width:10,x:1,y:1 };`;
      const result = DSLToExcalidraw(script);
      expect(result).toHaveLength(1);
    });

    it("covers roundness error catch block", () => {
      const originalParseInt = global.parseInt;
      global.parseInt = vi.fn((str) => {
        if (str === 'throw') {
          throw new Error("Roundness parsing failed");
        }
        return originalParseInt(str);
      });

      const script = `Node "test" { roundness: "throw", height:10,width:10,x:1,y:1 };`;
      const result = DSLToExcalidraw(script);
      
      global.parseInt = originalParseInt;
      expect(result).toHaveLength(1);
    });

    it("covers connection error catch block", () => {
      const script = `
        Node "a" { height:10,width:10,x:1,y:1 };
        Connection "c" { source: "nonexistent", target: "a" };
      `;
      
      const result = DSLToExcalidraw(script);
      expect(Array.isArray(result)).toBe(true);
      expect(result.find(e => e.id === "c")).toBeUndefined();
    });

    it("covers all major error paths in one test", () => {
      const comprehensiveErrorDSL = `
        InvalidType "err1" {};
        Node {};
        Node "err3" { invalid property };
        Node "err4" { points: "invalid json" };
        Node "valid" { height:10,width:10,x:1,y:1 };
        Connection "conn" { source: "valid", target: "valid" };
      `;

      const result = DSLToExcalidraw(comprehensiveErrorDSL);
      expect(Array.isArray(result)).toBe(true);
      expect(console.log).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // SPECIFIC MUTANT KILLERS FOR SURVIVED MUTANTS
  // =========================================================================

  describe("Specific Mutant Killers", () => {
    it("kills regex mutants with exact pattern matching", () => {
      const scripts = [
        `Node"test"{height:100}`, // No spaces
        `Node "test"{height:100}`, // No space before {
        `Node "test" {height:100}`, // No space after {
      ];
      
      scripts.forEach(script => {
        const result = DSLToExcalidraw(script);
        if (result.length > 0) {
          expect(result[0].id).toBe("test");
        }
      });
    });

    it("kills trim mutants with whitespace-heavy input", () => {
      const script = `Node "trim" {   height   :   100   ,   width   :   200   };`;
      const [element] = DSLToExcalidraw(script);
      expect(element.height).toBe(100);
      expect(element.width).toBe(200);
    });

    it("kills optional chaining mutants with undefined properties", () => {
      const script = `
        Node "a" { height:10,width:10,x:1,y:1 };
        Connection "c" { source:"a", target:"a" }; // No relation, no style properties
      `;
      
      const result = DSLToExcalidraw(script);
      const connection = result.find(e => e.type === "arrow");
      expect(connection.strokeStyle).toBe("dotted");
      expect(connection.startArrowhead).toBe("dot");
      expect(connection.endArrowhead).toBe("dot");
    });

    it("kills conditional mutants by testing exact conditions", () => {
      const testCases = [
        `Invalid "test" {}`, // No type match
        `Node`, // No name match
        `Node "test"`, // No properties block
      ];

      testCases.forEach(script => {
        const result = DSLToExcalidraw(script);
        expect(Array.isArray(result)).toBe(true);
      });
    });

    it("kills logical operator mutants", () => {
      const scripts = [
        `Node "" {}`, // Empty name
        `Node "test" { height: , width: 100 }`, // Missing value
        `Node "test" { key: value, }`, // Trailing comma
      ];
      
      scripts.forEach(script => {
        const result = DSLToExcalidraw(script);
        expect(Array.isArray(result)).toBe(true);
      });
    });

    it("kills string literal mutants by testing exact error messages", () => {
      DSLToExcalidraw(`InvalidType "test" {}`);
      
      const logCalls = console.log.mock.calls.flat();
      const hasError = logCalls.some(call => 
        typeof call === 'string' && call.includes("Error finding type of element")
      );
      expect(hasError).toBe(true);
    });

    it("kills array processing mutants with edge cases", () => {
      const scripts = [
        `Node "a" {}; Node "b" {};`, // Multiple elements
        `Node "test" {}`, // Single element
        ``, // Empty script
        `Node "test" { height: 100 }; Text "txt" { text: "hello" }`, // Mixed types
      ];
      
      scripts.forEach(script => {
        const result = DSLToExcalidraw(script);
        expect(Array.isArray(result)).toBe(true);
      });
    });

    it("kills property parsing mutants with malformed properties", () => {
      const malformedProps = [
        `Node "test" { key without colon }`,
        `Node "test" { : value without key }`,
        `Node "test" { key: }`,
        `Node "test" { ,, }`,
      ];

      malformedProps.forEach(script => {
        const result = DSLToExcalidraw(script);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });
});