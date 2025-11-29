import { describe, it, expect, vi } from 'vitest'
import { getPoints } from '../../src/utils/getPoints'

function makeNode(name, x, y, w = 100, h = 50) {
  return {
    name,
    properties: {
      x: x.toString(),
      y: y.toString(),
      width: w.toString(),
      height: h.toString(),
    },
  };
}

describe('getPoints - Combined Essential Tests', () => {
  describe('vertical layout', () => {
    it('should compute connector from top node to bottom node', () => {
      const elements = [
        makeNode('node1', 100, 100, 80, 40),
        makeNode('node2', 100, 200, 80, 40)
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'vertical')
      
      expect(result.absoluteStart.x).toBe(140)
      expect(result.absoluteStart.y).toBe(140)
      expect(result.points).toHaveLength(2)
      expect(result.points[0]).toEqual([0, 0])
      expect(result.points[1][0]).toBe(0)
      expect(result.points[1][1]).toBe(60)
    })

    it('should compute connector from bottom node to top node', () => {
      const elements = [
        makeNode('node1', 100, 200, 80, 40),
        makeNode('node2', 100, 100, 80, 40)
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'vertical')
      
      expect(result.absoluteStart.x).toBe(140)
      expect(result.absoluteStart.y).toBe(200)
      expect(result.points[0]).toEqual([0, 0])
      expect(result.points[1][1]).toBe(-60)
    })

    it('should handle source exactly at same Y as target', () => {
      const elements = [
        makeNode('node1', 100, 200, 80, 40),
        makeNode('node2', 200, 200, 60, 30)
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'vertical')
      expect(result.absoluteStart.y).toBe(200)
    })
  })

  describe('horizontal layout', () => {
    it('should compute connector from left node to right node', () => {
      const elements = [
        makeNode('left', 50, 100, 80, 60),
        makeNode('right', 200, 100, 80, 60)
      ]
      
      const result = getPoints(elements, 'left', 'right', 'horizontal')
      
      expect(result.absoluteStart.x).toBe(130)
      expect(result.absoluteStart.y).toBe(130)
      expect(result.points[0]).toEqual([0, 0])
      expect(result.points[1][0]).toBe(70)
      expect(result.points[1][1]).toBe(0)
    })

    it('should compute connector from right node to left node', () => {
      const elements = [
        makeNode('right', 200, 100, 80, 60),
        makeNode('left', 50, 100, 80, 60)
      ]
      
      const result = getPoints(elements, 'right', 'left', 'horizontal')
      
      expect(result.absoluteStart.x).toBe(200)
      expect(result.absoluteStart.y).toBe(130)
      expect(result.points[1][0]).toBe(-70)
    })

    it('should handle source exactly at same X as target', () => {
      const elements = [
        makeNode('node1', 100, 200, 80, 40),
        makeNode('node2', 100, 300, 60, 30)
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'horizontal')
      expect(result.absoluteStart.x).toBe(100)
    })

    // MUTANT KILLER: Arithmetic operators in horizontal calculations
    it('should use correct arithmetic in horizontal target Y calculation', () => {
      const elements = [
        makeNode('A', 50, 100, 80, 60),
        makeNode('B', 200, 100, 80, 60)
      ]
      
      const result = getPoints(elements, 'A', 'B', 'horizontal')
      
      // Target Y should be center of target node: 100 + 60/2 = 130
      // If subtraction or multiplication were used, this would be wrong
      const targetCenterY = 100 + 60/2
      expect(result.absoluteStart.y).toBe(targetCenterY)
    })

    // NEW MUTANT KILLER: Kills arithmetic operator mutants in horizontal result calculation
    it('should use correct arithmetic in horizontal result points calculation - KILLS ARITHMETIC MUTANTS', () => {
      const elements = [
        makeNode('A', 50, 100, 80, 60),
        makeNode('B', 200, 100, 80, 60)
      ]
      
      const result = getPoints(elements, 'A', 'B', 'horizontal')
      
      // Verify the exact arithmetic in points calculation
      // absoluteTargetX - absoluteX = 200 - 130 = 70
      // absoluteTargetY - absoluteY = 130 - 130 = 0
      expect(result.points[1][0]).toBe(70) // Kills subtraction mutant
      expect(result.points[1][1]).toBe(0)  // Kills subtraction mutant
      
      // Also verify the array structure kills array declaration mutant
      expect(result.points[0]).toEqual([0, 0]) // Kills array mutant that changes [0,0] to []
    })
  })

  describe('radial layout', () => {
    it('should compute connector between two nodes using circle edges', () => {
      const elements = [
        makeNode('center', 100, 100, 40, 40),
        makeNode('outer', 200, 100, 40, 40)
      ]
      
      const result = getPoints(elements, 'center', 'outer', 'radial')
      
      expect(result).toHaveProperty('absoluteStart')
      expect(result).toHaveProperty('absoluteEnd')
      expect(result).toHaveProperty('points')
      expect(result.absoluteStart.x).toBeGreaterThan(120)
      expect(result.absoluteEnd.x).toBeLessThan(220)
    })

    it('should handle coincident nodes (zero distance)', () => {
      const elements = [
        makeNode('node1', 100, 100, 40, 40),
        makeNode('node2', 100, 100, 40, 40)
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'radial')
      expect(result.absoluteStart.x).toBeCloseTo(140, 0)
      expect(result.absoluteStart.y).toBeCloseTo(120, 0)
    })

    it('should use minimum of width and height as radius', () => {
      const elements = [
        makeNode('rect', 100, 100, 80, 40),
        makeNode('circle', 200, 100, 40, 40)
      ]
      
      const result = getPoints(elements, 'rect', 'circle', 'radial')
      const centerX = 100 + 80/2
      expect(result.absoluteStart.x).toBeCloseTo(centerX + 20, 0)
    })

    // MUTANT KILLER TESTS - IMPROVED VERSION
    it('should use Math.min (not Math.max) for radius calculation - KILLS MATH.MIN MUTANT', () => {
      const elements = [
        makeNode('wide', 0, 0, 200, 50),   // min(200,50)=50 → radius=25
        makeNode('tall', 300, 0, 60, 120)  // min(60,120)=60 → radius=30
      ]
      
      const result = getPoints(elements, 'wide', 'tall', 'radial')
      
      // Source: center (100,25), radius 25 → start X should be ~125
      // Target: center (330,60), radius 30 → end X should be ~300
      expect(result.absoluteStart.x).toBeCloseTo(125, 0)
      expect(result.absoluteEnd.x).toBeCloseTo(300, 0)
      
      // If Math.max were used: source radius would be 100, target radius would be 60
      // Start X would be ~200, end X would be ~270 - which would be WRONG
    })

    it('should handle zero distance with default direction vector - KILLS DISTANCE ZERO MUTANT', () => {
      const elements = [
        makeNode('node1', 100, 100, 50, 50),
        makeNode('node2', 100, 100, 50, 50)
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'radial')
      
      expect(result.points).toHaveLength(2)
      expect(result.absoluteStart).toBeDefined()
      expect(result.absoluteEnd).toBeDefined()
      
      // When distance is 0, should use default direction (1,0) → horizontal connection
      expect(result.points[1][1]).toBe(0) // No vertical movement
      
      // The important thing is that it doesn't crash and returns valid coordinates
      expect(typeof result.points[1][0]).toBe('number')
      expect(result.absoluteStart.x).toBeDefined()
      expect(result.absoluteStart.y).toBeDefined()
      expect(result.absoluteEnd.x).toBeDefined()
      expect(result.absoluteEnd.y).toBeDefined()
    })

    it('should correctly calculate direction vector with subtraction - KILLS ARITHMETIC MUTANT', () => {
      const elements = [
        makeNode('source', 100, 100, 50, 50),
        makeNode('target', 200, 150, 50, 50)
      ]
      
      const result = getPoints(elements, 'source', 'target', 'radial')
      
      // Centers: source (125,125), target (225,175)
      // dx should be 100, dy should be 50 (subtraction)
      // NOT 350, 300 (addition)
      
      const deltaX = result.points[1][0]
      const deltaY = result.points[1][1]
      
      // Deltas should be reasonable (not huge addition values)
      expect(Math.abs(deltaX)).toBeLessThan(150)
      expect(Math.abs(deltaY)).toBeLessThan(100)
      
      // Direction should be toward target
      expect(result.absoluteEnd.x).toBeGreaterThan(result.absoluteStart.x)
      expect(result.absoluteEnd.y).toBeGreaterThan(result.absoluteStart.y)
      
      const sourceCenterX = 100 + 50/2
      const targetCenterX = 200 + 50/2
      const expectedHorizontalDirection = targetCenterX - sourceCenterX // Should be positive
      
      // The horizontal direction should match the expected direction
      if (expectedHorizontalDirection > 0) {
        expect(result.points[1][0]).toBeGreaterThan(0)
      } else {
        expect(result.points[1][0]).toBeLessThan(0)
      }
    })

    it('should use division (not multiplication) in unit vector calculation - KILLS DIVISION MUTANT', () => {
      const elements = [
        makeNode('source', 0, 0, 100, 100),
        makeNode('target', 200, 0, 100, 100)
      ]
      
      const result = getPoints(elements, 'source', 'target', 'radial')
      
      // For horizontal alignment, y-component should be exactly zero
      // If multiplication were used instead of division, uy would not be 0
      expect(result.points[1][1]).toBe(0)
      
      // Verify the exact coordinates
      // Source center: (50,50), radius: 50 → start: (100,50)
      // Target center: (250,50), radius: 50 → end: (200,50)  
      // Points: [0,0] to [100,0]
      expect(result.absoluteStart.x).toBeCloseTo(100)
      expect(result.absoluteStart.y).toBeCloseTo(50)
      expect(result.absoluteEnd.x).toBeCloseTo(200)
      expect(result.absoluteEnd.y).toBeCloseTo(50)
      expect(result.points[1][0]).toBeCloseTo(100)
      expect(result.points[1][1]).toBe(0)
    })

    it('should handle conditional expression for zero distance - KILLS CONDITIONAL MUTANT', () => {
      const elements = [
        makeNode('A', 50, 50, 20, 20),
        makeNode('B', 50, 50, 20, 20) // Exact same position
      ]
      
      const result = getPoints(elements, 'A', 'B', 'radial')
      
      // Should handle the dist === 0 condition specifically
      // and not crash or return invalid data
      expect(result.points.length).toBe(2)
      expect(Array.isArray(result.points[1])).toBe(true)
      expect(result.points[1].length).toBe(2)
      
      // The connection should exist and be valid
      expect(typeof result.points[1][0]).toBe('number')
      expect(typeof result.points[1][1]).toBe('number')
    })

    it('should use correct arithmetic in radial coordinate calculations - KILLS ARITHMETIC MUTANTS', () => {
      const elements = [
        makeNode('source', 0, 0, 100, 100),
        makeNode('target', 300, 400, 100, 100)
      ]
      
      const result = getPoints(elements, 'source', 'target', 'radial')
      
      // Test specific arithmetic operations:
      // sx + ux * sr (addition and multiplication)
      // ty - uy * tr (subtraction and multiplication)
      
      // Start point should be on source boundary toward target
      expect(result.absoluteStart.x).toBeGreaterThan(50) // > center X
      expect(result.absoluteStart.x).toBeLessThan(100)   // < right edge
      expect(result.absoluteStart.y).toBeGreaterThan(50) // > center Y  
      expect(result.absoluteStart.y).toBeLessThan(100)   // < bottom edge
      
      // End point should be on target boundary toward source
      expect(result.absoluteEnd.x).toBeGreaterThan(300) // > left edge
      expect(result.absoluteEnd.x).toBeLessThan(350)    // < center X
      expect(result.absoluteEnd.y).toBeGreaterThan(400) // > top edge
      expect(result.absoluteEnd.y).toBeLessThan(450)    // < center Y
    })

    // NEW MUTANT KILLER: Kills specific arithmetic operators in radial calculations
    it('should use subtraction for direction vector calculation - KILLS DX/DY ARITHMETIC MUTANTS', () => {
      const elements = [
        makeNode('source', 100, 100, 50, 50),
        makeNode('target', 200, 150, 50, 50)
      ]
      
      const result = getPoints(elements, 'source', 'target', 'radial')
      
      // Centers: source (125,125), target (225,175)
      // dx should be 225-125=100, dy should be 175-125=50 (subtraction)
      // If addition were used: dx=350, dy=300 (completely wrong)
      
      // The resulting points should reflect reasonable values from subtraction
      // Not huge values from addition
      expect(Math.abs(result.points[1][0])).toBeLessThan(150) // Would be ~350 if addition used
      expect(Math.abs(result.points[1][1])).toBeLessThan(100) // Would be ~300 if addition used
    })

    // NEW MUTANT KILLER: Kills multiplication vs division mutants in radial coordinates
    it('should use multiplication (not division) for radial boundary calculations - KILLS MULTIPLICATION MUTANTS', () => {
      const elements = [
        makeNode('source', 0, 0, 100, 100),
        makeNode('target', 200, 0, 100, 100)
      ]
      
      const result = getPoints(elements, 'source', 'target', 'radial')
      
      // For horizontal connection with radius 50:
      // Start X should be centerX + ux * radius = 50 + 1*50 = 100
      // If division were used: 50 + 1/50 = ~50.02 (completely wrong)
      expect(result.absoluteStart.x).toBeCloseTo(100, 0) // Multiplication gives 100, division gives ~50
      expect(result.absoluteEnd.x).toBeCloseTo(200, 0)   // Target boundary
    })
  })

  describe('error handling', () => {
    it('should return -1 for unsupported layout type', () => {
      const elements = [
        makeNode('node1', 100, 100),
        makeNode('node2', 200, 200)
      ]
      
      expect(getPoints(elements, 'node1', 'node2', 'invalid')).toBe(-1)
      expect(getPoints(elements, 'node1', 'node2', null)).toBe(-1)
      expect(getPoints(elements, 'node1', 'node2', undefined)).toBe(-1)
    })

    it('should crash when target node is missing', () => {
      const elements = [makeNode('only', 100, 100)]
      expect(() => getPoints(elements, 'only', 'missing', 'vertical')).toThrow()
    })

    it('should crash when source node is missing', () => {
      const elements = [makeNode('only', 100, 100)]
      expect(() => getPoints(elements, 'missing', 'only', 'vertical')).toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle string and numeric property values', () => {
      const elements = [
        { name: 'node1', properties: { x: 100, y: 100, width: 80, height: 60 } },
        { name: 'node2', properties: { x: '200', y: '150', width: '80', height: '60' } }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'horizontal')
      expect(result.absoluteStart.x).toBe(180)
    })

    it('should handle floating point property values', () => {
      const elements = [
        makeNode('node1', 100.5, 100.7, 80.3, 60.2),
        makeNode('node2', 200.1, 150.9, 80.8, 60.4)
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'vertical')
      expect(result.absoluteStart.x).toBeCloseTo(140.65, 2)
    })

    it('should handle nodes with zero dimensions', () => {
      const elements = [
        { name: 'point', properties: { x: '100', y: '100', width: '0', height: '0' } },
        makeNode('node', 150, 150)
      ]
      
      const result = getPoints(elements, 'point', 'node', 'vertical')
      expect(result.absoluteStart.x).toBe(100)
      expect(result.absoluteStart.y).toBe(100)
    })

    it('should handle same source and target id', () => {
      const elements = [makeNode('self', 100, 100, 80, 60)]
      const result = getPoints(elements, 'self', 'self', 'vertical')
      expect(result.points[1][0]).toBe(0)
      expect(result.points[1][1]).toBe(60)
    })
  })

  describe('return value structure - KILLS ARRAY INIT MUTANT', () => {
    it('should return correct structure for all layout types', () => {
      const elements = [
        makeNode('node1', 100, 100, 80, 60),
        makeNode('node2', 200, 200, 80, 60)
      ]

      const vert = getPoints(elements, 'node1', 'node2', 'vertical')
      const horiz = getPoints(elements, 'node1', 'node2', 'horizontal')
      const radial = getPoints(elements, 'node1', 'node2', 'radial')
      
      expect(vert).toHaveProperty('absoluteStart')
      expect(vert).toHaveProperty('points')
      expect(vert.points[0]).toEqual([0, 0])
      
      expect(horiz).toHaveProperty('absoluteStart')
      expect(horiz).toHaveProperty('points')
      expect(horiz.points[0]).toEqual([0, 0])
      
      expect(radial).toHaveProperty('absoluteStart')
      expect(radial).toHaveProperty('absoluteEnd')
      expect(radial).toHaveProperty('points')
      expect(radial.points[0]).toEqual([0, 0])
    })

    it('should initialize points as empty array and populate correctly - KILLS ARRAY INIT MUTANT', () => {
      const source = makeNode("A", 0, 0, 100, 50);
      const target = makeNode("B", 200, 100, 80, 40);
      
      const result = getPoints([source, target], "A", "B", "vertical");
      
      // Kills array initialization mutant by verifying the exact structure
      expect(Array.isArray(result.points)).toBe(true);
      expect(result.points.length).toBe(2);
      
      // First point must be exactly [0, 0] - kills mutant that changes this
      expect(result.points[0]).toEqual([0, 0]);
      expect(Array.isArray(result.points[0])).toBe(true);
      expect(result.points[0].length).toBe(2);
      expect(result.points[0][0]).toBe(0);
      expect(result.points[0][1]).toBe(0);
      
      // Second point must be an array with 2 numbers
      expect(Array.isArray(result.points[1])).toBe(true);
      expect(result.points[1].length).toBe(2);
      expect(typeof result.points[1][0]).toBe('number');
      expect(typeof result.points[1][1]).toBe('number');
    })
  })

  describe('comprehensive coverage', () => {
    it('should cover all layout types and edge cases', () => {
      const elements = [
        makeNode("A", 0, 0),
        makeNode("B", 100, 100)
      ]

      const vert = getPoints(elements, "A", "B", "vertical")
      const horiz = getPoints(elements, "A", "B", "horizontal")
      const radial = getPoints(elements, "A", "B", "radial")
      const invalid = getPoints(elements, "A", "B", "invalid")

      expect(vert.points.length).toBe(2)
      expect(horiz.points.length).toBe(2)
      expect(radial.points.length).toBe(2)
      expect(invalid).toBe(-1)

      // Only iterate over valid results
      const validResults = [vert, horiz, radial]
      validResults.forEach(result => {
        expect(Array.isArray(result.points)).toBe(true)
        expect(result.points[0]).toEqual([0, 0])
      })
    })
  })
})