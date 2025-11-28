// tests/utils/DSLToExcalidraw.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";

// Polyfill structuredClone for older Node versions
if (typeof globalThis.structuredClone === "undefined") {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// ---------- Mocks ----------
// Keep mocks simple – no external top-level variables used inside factories
vi.mock("../../src/utils/getPoints.js", () => ({
  getPoints: vi.fn(() => ({
    points: [
      [0, 0],
      [50, 50],
    ],
    absoluteStart: { x: 100, y: 200 },
  })),
}));

vi.mock("../../src/utils/removeQuotes.js", () => ({
  unquote: vi.fn((valueString) => {
    const trimmed = valueString.trim();
    // sentinel to force error path in one test
    if (trimmed === `"__THROW_UNQUOTE__"`) {
      throw new Error("Forced unquote error");
    }
    const m = trimmed.match(/^"(.*)"$/);
    if (m) return m[1];
    return trimmed;
  }),
}));

vi.mock("../../src/utils/removeCommentsFromDSL.js", () => ({
  removeCommentsFromDSL: vi.fn((src) =>
    src.replace(/\/\/.*$/gm, "")
  ),
}));

vi.mock("../../src/utils/randomId.js", () => ({
  randomId: vi.fn(() => "mock-id"),
}));

// ---- Import real module AFTER mocks ----
import { DSLToExcalidraw } from "../../src/utils/DSLToExcalidraw.js";
import { getPoints } from "../../src/utils/getPoints.js";
import { unquote } from "../../src/utils/removeQuotes.js";
import { removeCommentsFromDSL } from "../../src/utils/removeCommentsFromDSL.js";

describe("DSLToExcalidraw", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
                                                
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

  it("applies defaults for missing width/type/fontSize and roundness undefined", () => {
    const dsl = `
      Node "nodeDefault" {
        x: 0,
        y: 0,
        height: 50,
        label: "NoWidth"
      };
    `;

    const [node] = DSLToExcalidraw(dsl);

    expect(node.width).toBe(300);         // default
    expect(node.type).toBe("ellipse");    // default
    expect(node.label.fontSize).toBe(20); // default
    expect(node.roundness).toEqual({ type: 3 });
  });

  it("handles empty properties block {}", () => {
    const dsl = `
      Node "emptyProps" {
      };
    `;

    const [node] = DSLToExcalidraw(dsl);

    expect(node.id).toBe("emptyProps");
    expect(Number.isNaN(node.x)).toBe(true);
    expect(Number.isNaN(node.y)).toBe(true);
    expect(Number.isNaN(node.height)).toBe(true);
    expect(node.width).toBe(300);
  });

  it("covers JSON.parse failure for points and keeps node", () => {
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

  it("covers unquote failure path and falls back to raw valueString", () => {
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

  it("skips invalid elements (bad type, bad name, missing props block)", () => {
    const dsl = `
      SomethingElse "badNode" {
        x: 0,
        y: 0,
        height: 10,
        width: 10
      };

      Node noQuotesName {
        x: 0,
        y: 0,
        height: 10,
        width: 10
      };

      Node "noPropsBlock";

      Node "goodNode" {
        x: 1,
        y: 2,
        height: 3,
        width: 4,
        label: "Good"
      };
    `;

    const res = DSLToExcalidraw(dsl);
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe("goodNode");
  });

  it("uses getPoints when points/x/y are not provided for Connection", () => {
    // adjust first call explicitly (though default mock is same)
    getPoints.mockReturnValueOnce({
      points: [
        [0, 0],
        [50, 50],
      ],
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
    expect(conn.points).toEqual([
      [0, 0],
      [50, 50],
    ]);
    expect(conn.strokeColor).toBe("#123456");
    expect(conn.strokeStyle).toBe("solid");
    expect(conn.startArrowhead).toBe("dot");
    expect(conn.endArrowhead).toBe("arrow");
    expect(conn.label).toEqual({ text: "connects", fontSize: "16" });
  });

  it("creates Connection using explicit points and default styles", () => {
    const dsl = `
      Node "source" {
        x: 0,
        y: 0,
        height: 10,
        width: 10,
        label: "S"
      };
      Node "target" {
        x: 100,
        y: 100,
        height: 10,
        width: 10,
        label: "T"
      };
      Connection "connWithPoints" {
        source: "source",
        target: "target",
        relation: "explicit",
        x: 10,
        y: 20,
        points: [[10, 20], [30, 40], [50, 60]],
        arrowColor: "#abcdef"
      };
    `;

    const res = DSLToExcalidraw(dsl);
    const conn = res.find((el) => el.id === "connWithPoints");

    expect(conn).toBeDefined();
    expect(conn.x).toBe(10);
    expect(conn.y).toBe(20);
    expect(conn.points).toEqual([
      [0, 0],
      [20, 20],
      [40, 40],
    ]);
    expect(conn.strokeColor).toBe("#abcdef");
    expect(conn.strokeStyle).toBe("dotted"); // default
    expect(conn.startArrowhead).toBe("dot");
    expect(conn.endArrowhead).toBe("dot");
  });

  it("skips Connection when source node is missing", () => {
    const dsl = `
      Node "onlyNode" {
        x: 0,
        y: 0,
        height: 10,
        width: 10,
        label: "Only"
      };
      Connection "badConn" {
        source: "nonExisting",
        target: "onlyNode",
        relation: "willBeSkipped"
      };
    `;

    const res = DSLToExcalidraw(dsl);

    expect(res).toHaveLength(1);
    expect(res[0].id).toBe("onlyNode");
  });

 it("skips Connection when getPoints returns no geometry (points/x/y undefined)", () => {
  getPoints.mockReturnValueOnce({
    points: undefined,
    absoluteStart: { x: undefined, y: undefined },
  });

  const dsl = `
    Node "src" {
      x: 0,
      y: 0,
      height: 10,
      width: 10,
      label: "S"
    };
    Node "dst" {
      x: 10,
      y: 10,
      height: 10,
      width: 10,
      label: "D"
    };
    Connection "badPointsConn" {
      source: "src",
      target: "dst",
      relation: "Bad"
    };
  `;

  const result = DSLToExcalidraw(dsl);
  // only src + dst nodes; connection skipped due to missing geometry
  expect(result).toHaveLength(2);
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
    expect(text.x).toBe("100");  // raw DSL values (no parseFloat)
    expect(text.y).toBe("200");
    expect(text.text).toBe("Hello World");
    expect(text.fontSize).toBe("18");
    expect(text.strokeColor).toBe("#999999");
    expect(text.customData).toEqual({ persistentId: "txt1" });
  });

  it("handles multiple elements, comments, extra semicolons", () => {
    const dsl = `
      // comment
      Node "n1" {
        x: 0,
        y: 0,
        height: 10,
        width: 10,
        label: "N1"
      }; // end

      Text "t1" {
        x: 5,
        y: 5,
        text: "Label",
        fontSize: 12,
        color: "#111111"
      };

      // extra semicolon
      ;
    `;

    const res = DSLToExcalidraw(dsl);

    expect(removeCommentsFromDSL).toHaveBeenCalled();
    expect(res).toHaveLength(2);
    const ids = res.map((el) => el.id).sort();
    expect(ids).toEqual(["n1", "t1"]);
  });

  it("returns empty array for completely invalid DSL", () => {
    const dsl = `
      JustGarbageHere
      AnotherBadElement
    `;

    const res = DSLToExcalidraw(dsl);
    expect(res).toEqual([]);
  });
});
  // ---------------------------------------------------------------------------
  // EXTRA TESTS TO COVER DEFENSIVE BRANCHES
  // ---------------------------------------------------------------------------

  it('covers "type is not valid" branch in processElement via monkeypatch', () => {
    const originalMatch = String.prototype.match;

    try {
      String.prototype.match = function (regex) {
        // For the type regex, if the line contains "ForceInvalidType",
        // pretend a match with a bogus type name.
        if (
          regex &&
          regex.source === "^(\\s*)\\b(Node|Connection|Text)\\b" &&
          this.includes("ForceInvalidType")
        ) {
          return ["ForceInvalidType", "", "InvalidType"];
        }
        return originalMatch.call(this, regex);
      };

      const dsl = `
        ForceInvalidType "whatever" {
          x: 0,
          y: 0
        };
        Node "okNode" {
          x: 0,
          y: 0,
          height: 10,
          width: 10,
          label: "OK"
        };
      `;

      const res = DSLToExcalidraw(dsl);
      // First element skipped (invalid type), second kept
      expect(res).toHaveLength(1);
      expect(res[0].id).toBe("okNode");
    } finally {
      String.prototype.match = originalMatch;
    }
  });

  it('covers "name == null/undefined" branch in processElement via monkeypatch', () => {
    const originalMatch = String.prototype.match;

    try {
      String.prototype.match = function (regex) {
        // For the name regex on "NullNameNode" line, return a match
        // but with an undefined capture group.
        if (
            regex &&
            regex.source === '\\s{1,}"([^"]+)"' &&
            this.includes("NullNameNode")
        ) {
             return [' Node "NullNameNode"', undefined];
        }

        return originalMatch.call(this, regex);
      };

      const dsl = `
        Node "NullNameNode" {
          x: 0,
          y: 0,
          height: 10,
          width: 10
        };
        Node "validNode" {
          x: 1,
          y: 1,
          height: 10,
          width: 10,
          label: "OK"
        };
      `;

      const res = DSLToExcalidraw(dsl);
      // First element skipped (name becomes null/undefined), second kept
      expect(res).toHaveLength(1);
      expect(res[0].id).toBe("validNode");
    } finally {
      String.prototype.match = originalMatch;
    }
  });

  it("covers outer properties parse catch via monkeypatch on indexOf", () => {
    const originalIndexOf = String.prototype.indexOf;

    try {
      String.prototype.indexOf = function (...args) {
        // When a property string contains this marker, force indexOf to throw.
        if (this.includes("triggerErrorPropString")) {
          throw new Error("Forced indexOf error");
        }
        return originalIndexOf.apply(this, args);
      };

      const dsl = `
        Node "badProps" {
          triggerErrorPropString: 1
        };
        Node "goodProps" {
          x: 0,
          y: 0,
          height: 10,
          width: 10,
          label: "OK"
        };
      `;

      const res = DSLToExcalidraw(dsl);
      // badProps is skipped because processElement returns -1
      expect(res).toHaveLength(1);
      expect(res[0].id).toBe("goodProps");
    } finally {
      String.prototype.indexOf = originalIndexOf;
    }
  });

  it("covers Node label/backgroundColor/roundness try-catches via monkeypatch on properties", () => {
  const originalPush = Array.prototype.push;

  try {
    Array.prototype.push = function (...args) {
      const el = args[0];
      if (el && el.type === "Node" && el.name === "brokenNode" && el.properties) {
        // Wrap properties so that accessing label/backgroundColor/roundness throws,
        // but x/y/type/width/height still work.
        el.properties = new Proxy(el.properties, {
          get(target, prop) {
            if (
              prop === "label" ||
              prop === "backgroundColor" ||
              prop === "roundness"
            ) {
              throw new Error("Forced property error");
            }
            return target[prop];
          },
        });
      }
      return originalPush.apply(this, args);
    };

    const dsl = `
      Node "brokenNode" {
        x: 0,
        y: 0,
        height: 10,
        width: 10
      };
    `;

    const result = DSLToExcalidraw(dsl);
    const node = result[0];

    // label fallback from catch
    expect(node.label.text).toBe("No Name!!");
    // backgroundColor fallback from catch
    expect(node.backgroundColor).toBe("#fff3bf");
    // roundness remains undefined -> roundness object becomes { type: undefined }
    expect(node.roundness).toEqual({ type: undefined });
  } finally {
    Array.prototype.push = originalPush;
  }
});

  it("covers Connection 'cannot connect arrows' catch via monkeypatch on properties", () => {
    const originalPush = Array.prototype.push;

    try {
      Array.prototype.push = function (...args) {
        const el = args[0];
        // For processedElement of type Connection named "brokenConn",
        // remove its properties so source/target access throws.
        if (el && el.type === "Connection" && el.name === "brokenConn") {
          el.properties = undefined;
        }
        return originalPush.apply(this, args);
      };

      const dsl = `
        Node "src" {
          x: 0,
          y: 0,
          height: 10,
          width: 10,
          label: "S"
        };
        Node "dst" {
          x: 10,
          y: 10,
          height: 10,
          width: 10,
          label: "D"
        };
        Connection "brokenConn" {
          source: "src",
          target: "dst",
          relation: "willThrow"
        };
        Connection "okConn" {
          source: "src",
          target: "dst",
          relation: "ok"
        };
      `;

      const res = DSLToExcalidraw(dsl);
      const ids = res.map((e) => e.id);

      // brokenConn skipped due to catch+continue
      expect(ids).toContain("src");
      expect(ids).toContain("dst");
      expect(ids).toContain("okConn");
      expect(ids).not.toContain("brokenConn");
    } finally {
      Array.prototype.push = originalPush;
    }
  });

  it("covers Connection label catch when relation access throws", () => {
    const originalPush = Array.prototype.push;

    try {
      Array.prototype.push = function (...args) {
        const el = args[0];

        if (el && el.type === "Connection" && el.name === "noRelation" && el.properties) {
          // Replace properties with a Proxy that throws only on .relation access
          el.properties = new Proxy(
            { source: "src", target: "dst" },
            {
              get(target, prop) {
                if (prop === "relation") {
                  throw new Error("Boom on relation");
                }
                return target[prop];
              },
            }
          );
        }

        return originalPush.apply(this, args);
      };

      const dsl = `
        Node "src" {
          x: 0,
          y: 0,
          height: 10,
          width: 10,
          label: "S"
        };
        Node "dst" {
          x: 10,
          y: 10,
          height: 10,
          width: 10,
          label: "D"
        };
        Connection "noRelation" {
          source: "src",
          target: "dst"
        };
        Connection "okRelation" {
          source: "src",
          target: "dst",
          relation: "OK"
        };
      `;

      const res = DSLToExcalidraw(dsl);
      const ids = res.map((e) => e.id);

      // noRelation is skipped after label catch; okRelation is kept
      expect(ids).toContain("okRelation");
      expect(ids).not.toContain("noRelation");
    } finally {
      Array.prototype.push = originalPush;
    }
  });
   it("skips Connection when target node is missing", () => {
     const dsl = `
     Node "onlyNode" {
      x: 0,
      y: 0,
      height: 10,
      width: 10,
      label: "Only"
    };
    Connection "badConnTarget" {
      source: "onlyNode",
      target: "nonExisting",
      relation: "willBeSkippedTarget"
    };
  `;

  const res = DSLToExcalidraw(dsl);

  // The connection should be skipped because target node doesn't exist
  expect(res).toHaveLength(1);
  expect(res[0].id).toBe("onlyNode");
});

    it("skips element when name becomes null after initial match (coverage for name == null check)", () => {
  const originalMatch = String.prototype.match;

  try {
    String.prototype.match = function (regex) {
      // Only intercept the *name* regex call for this specific node
      if (
        regex &&
        regex.source === '\\s{1,}"([^"]+)"' &&
        this.includes("NullNameBranch")
      ) {
        let called = false;
        const arr = [' Node "NullNameBranch"'];

        // Make index 1 a getter that returns a truthy value first,
        // then null on the next access.
        Object.defineProperty(arr, 1, {
          get() {
            if (!called) {
              called = true;
              return "TEMP_NAME"; // truthy for the `if (!nameMatch[1])` check
            }
            return null; // used when assigning `name = nameMatch[1]`
          },
        });

        return arr;
      }

      return originalMatch.call(this, regex);
    };

    const dsl = `
      Node "NullNameBranch" {
        x: 1,
        y: 2,
        height: 3,
        width: 4
      };

      Node "validNode2" {
        x: 10,
        y: 20,
        height: 30,
        width: 40,
        label: "OK"
      };
    `;

    const result = DSLToExcalidraw(dsl);

    // First element is skipped via `if (name == null || name === undefined)`,
    // second element remains.
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("validNode2");
  } finally {
    String.prototype.match = originalMatch;
  }
});
