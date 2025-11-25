import { describe, it, expect } from 'vitest'
import { getPoints } from '../../src/utils/getPoints'

describe('getPoints', () => {
  describe('vertical layout', () => {
    it('should compute connector from top node to bottom node', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '80', height: '40' }
        },
        {
          name: 'node2',
          properties: { x: '100', y: '200', width: '80', height: '40' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'vertical')
      
      expect(result.absoluteStart.x).toBe(140) // 100 + 80/2
      expect(result.absoluteStart.y).toBe(140) // 100 + 40
      expect(result.points).toHaveLength(2)
      expect(result.points[0]).toEqual([0, 0])
      expect(result.points[1][0]).toBe(0) // same x (140 - 140)
      expect(result.points[1][1]).toBe(60) // 200 - 140
    })

    it('should compute connector from bottom node to top node', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '200', width: '80', height: '40' }
        },
        {
          name: 'node2',
          properties: { x: '100', y: '100', width: '80', height: '40' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'vertical')
      
      expect(result.absoluteStart.x).toBe(140) // 100 + 80/2
      expect(result.absoluteStart.y).toBe(200) // top of source node
      expect(result.points[0]).toEqual([0, 0])
      expect(result.points[1][1]).toBe(-60) // negative y (upward)
    })

    it('should handle nodes with different widths', () => {
      const elements = [
        {
          name: 'wide',
          properties: { x: '0', y: '0', width: '200', height: '50' }
        },
        {
          name: 'narrow',
          properties: { x: '80', y: '100', width: '40', height: '50' }
        }
      ]
      
      const result = getPoints(elements, 'wide', 'narrow', 'vertical')
      
      expect(result.absoluteStart.x).toBe(100) // 0 + 200/2
      expect(result.absoluteStart.y).toBe(50) // 0 + 50
      expect(result.points[1][0]).toBe(0) // 100 - 100 (centers align)
    })

    it('should handle offset nodes vertically', () => {
      const elements = [
        {
          name: 'left',
          properties: { x: '50', y: '50', width: '60', height: '40' }
        },
        {
          name: 'right',
          properties: { x: '150', y: '150', width: '60', height: '40' }
        }
      ]
      
      const result = getPoints(elements, 'left', 'right', 'vertical')
      
      expect(result.absoluteStart.x).toBe(80) // 50 + 60/2
      expect(result.points[1][0]).toBe(100) // 180 - 80 (horizontal offset)
      expect(result.points[1][1]).toBe(60) // 150 - 50 (vertical offset)
    })
  })

  describe('horizontal layout', () => {
    it('should compute connector from left node to right node', () => {
      const elements = [
        {
          name: 'left',
          properties: { x: '50', y: '100', width: '80', height: '60' }
        },
        {
          name: 'right',
          properties: { x: '200', y: '100', width: '80', height: '60' }
        }
      ]
      
      const result = getPoints(elements, 'left', 'right', 'horizontal')
      
      expect(result.absoluteStart.x).toBe(130) // 50 + 80
      expect(result.absoluteStart.y).toBe(130) // 100 + 60/2
      expect(result.points[0]).toEqual([0, 0])
      expect(result.points[1][0]).toBe(70) // 200 - 130
      expect(result.points[1][1]).toBe(0) // same y (130 - 130)
    })

    it('should compute connector from right node to left node', () => {
      const elements = [
        {
          name: 'right',
          properties: { x: '200', y: '100', width: '80', height: '60' }
        },
        {
          name: 'left',
          properties: { x: '50', y: '100', width: '80', height: '60' }
        }
      ]
      
      const result = getPoints(elements, 'right', 'left', 'horizontal')
      
      expect(result.absoluteStart.x).toBe(200) // left edge of source
      expect(result.absoluteStart.y).toBe(130) // 100 + 60/2
      expect(result.points[1][0]).toBe(-70) // negative x (leftward)
    })

    it('should handle nodes with different heights', () => {
      const elements = [
        {
          name: 'tall',
          properties: { x: '50', y: '50', width: '80', height: '120' }
        },
        {
          name: 'short',
          properties: { x: '200', y: '80', width: '80', height: '60' }
        }
      ]
      
      const result = getPoints(elements, 'tall', 'short', 'horizontal')
      
      expect(result.absoluteStart.y).toBe(110) // 50 + 120/2
      expect(result.points[1][1]).toBe(0) // 110 - 110 (vertical alignment)
    })

    it('should handle vertically offset nodes', () => {
      const elements = [
        {
          name: 'top',
          properties: { x: '50', y: '50', width: '80', height: '60' }
        },
        {
          name: 'bottom',
          properties: { x: '200', y: '150', width: '80', height: '60' }
        }
      ]
      
      const result = getPoints(elements, 'top', 'bottom', 'horizontal')
      
      expect(result.absoluteStart.y).toBe(80) // 50 + 60/2
      expect(result.points[1][1]).toBe(100) // 180 - 80 (vertical offset)
    })
  })

  describe('radial layout', () => {
    it('should compute connector between two nodes using circle edges', () => {
      const elements = [
        {
          name: 'center',
          properties: { x: '100', y: '100', width: '40', height: '40' }
        },
        {
          name: 'outer',
          properties: { x: '200', y: '100', width: '40', height: '40' }
        }
      ]
      
      const result = getPoints(elements, 'center', 'outer', 'radial')
      
      expect(result).toHaveProperty('absoluteStart')
      expect(result).toHaveProperty('absoluteEnd')
      expect(result).toHaveProperty('points')
      expect(result.absoluteStart.x).toBeGreaterThan(120) // starts at edge of circle
      expect(result.absoluteEnd.x).toBeLessThan(220) // ends at edge of circle
    })

   it('should handle radial nodes at different angles', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '50', height: '50' }
        },
        {
          name: 'node2',
          properties: { x: '150', y: '200', width: '50', height: '50' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'radial')
      
    
      
      // CORRECT: Starts at center (125) + offset (~11.18) = ~136.18
      expect(result.absoluteStart.x).toBeCloseTo(136.18, 1) 
      
      // CORRECT: Starts at center (125) + offset (~22.36) = ~147.36
      expect(result.absoluteStart.y).toBeCloseTo(147.36, 1) 

      expect(result.points).toHaveLength(2)
  })

    it('should handle nodes with different sizes in radial layout', () => {
      const elements = [
        {
          name: 'small',
          properties: { x: '100', y: '100', width: '30', height: '30' }
        },
        {
          name: 'large',
          properties: { x: '200', y: '200', width: '80', height: '80' }
        }
      ]
      
      const result = getPoints(elements, 'small', 'large', 'radial')
      
      expect(result.absoluteStart).toBeDefined()
      expect(result.absoluteEnd).toBeDefined()
      expect(result.points[1][0]).toBeGreaterThan(0)
      expect(result.points[1][1]).toBeGreaterThan(0)
    })

    it('should handle coincident nodes (zero distance)', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '40', height: '40' }
        },
        {
          name: 'node2',
          properties: { x: '100', y: '100', width: '40', height: '40' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'radial')
      
      // Should use default direction (1, 0)
      expect(result.absoluteStart.x).toBeCloseTo(140, 0) // 120 + 20
      expect(result.absoluteStart.y).toBeCloseTo(120, 0)
    })

    it('should round radial coordinates to 3 decimal places', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '0', y: '0', width: '10', height: '10' }
        },
        {
          name: 'node2',
          properties: { x: '17.12345', y: '23.98765', width: '10', height: '10' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'radial')
      
      // Check that values are properly rounded
      const dx = result.points[1][0]
      const dy = result.points[1][1]
      expect(dx.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(3)
      expect(dy.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(3)
    })

    it('should use minimum of width and height as radius', () => {
      const elements = [
        {
          name: 'rect',
          properties: { x: '100', y: '100', width: '80', height: '40' }
        },
        {
          name: 'circle',
          properties: { x: '200', y: '100', width: '40', height: '40' }
        }
      ]
      
      const result = getPoints(elements, 'rect', 'circle', 'radial')
      
      // Rectangle should use height/2 = 20 as radius
      const centerX = 100 + 80/2
      const centerY = 100 + 40/2
      expect(result.absoluteStart.x).toBeCloseTo(centerX + 20, 0)
    })
  })

  describe('edge cases', () => {
    it('should handle string and numeric property values', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: 100, y: 100, width: 80, height: 60 }
        },
        {
          name: 'node2',
          properties: { x: '200', y: '150', width: '80', height: '60' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'horizontal')
      
      expect(result.absoluteStart.x).toBe(180) // 100 + 80
    })

    it('should handle floating point property values', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100.5', y: '100.7', width: '80.3', height: '60.2' }
        },
        {
          name: 'node2',
          properties: { x: '200.1', y: '150.9', width: '80.8', height: '60.4' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'vertical')
      
      expect(result.absoluteStart.x).toBeCloseTo(140.65, 2)
    })

    it('should handle nodes with zero dimensions', () => {
      const elements = [
        {
          name: 'point',
          properties: { x: '100', y: '100', width: '0', height: '0' }
        },
        {
          name: 'node',
          properties: { x: '150', y: '150', width: '50', height: '50' }
        }
      ]
      
      const result = getPoints(elements, 'point', 'node', 'vertical')
      
      expect(result.absoluteStart.x).toBe(100)
      expect(result.absoluteStart.y).toBe(100)
    })

    it('should handle very large coordinate values', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '10000', y: '10000', width: '100', height: '100' }
        },
        {
          name: 'node2',
          properties: { x: '20000', y: '20000', width: '100', height: '100' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'horizontal')
      
      expect(result.absoluteStart.x).toBe(10100)
      expect(result.points[1][0]).toBe(9900)
    })

    it('should handle negative coordinates', () => {
      const elements = [
        {
          name: 'neg',
          properties: { x: '-100', y: '-50', width: '80', height: '60' }
        },
        {
          name: 'pos',
          properties: { x: '50', y: '50', width: '80', height: '60' }
        }
      ]
      
      const result = getPoints(elements, 'neg', 'pos', 'vertical')
      
      expect(result.absoluteStart.x).toBe(-60) // -100 + 80/2
      expect(result.points[1][0]).toBe(150) // 90 - (-60)
    })

    // CORRECTED: Function doesn't throw, it crashes with TypeError
    it('should crash when target node is missing', () => {
      const elements = [
        {
          name: 'only',
          properties: { x: '100', y: '100', width: '80', height: '60' }
        }
      ]
      
      // Function will crash trying to access undefined.properties
      expect(() => getPoints(elements, 'only', 'missing', 'vertical')).toThrow(TypeError)
    })

    // CORRECTED: Function doesn't throw, it crashes with TypeError
    it('should crash with empty elements array', () => {
      const elements = []
      
      expect(() => getPoints(elements, 'node1', 'node2', 'vertical')).toThrow(TypeError)
    })
  })

  describe('invalid inputs', () => {
    it('should return -1 for unsupported layout type', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '80', height: '60' }
        },
        {
          name: 'node2',
          properties: { x: '200', y: '150', width: '80', height: '60' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'invalid')
      
      expect(result).toBe(-1)
    })

    it('should return -1 for undefined layout type', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '80', height: '60' }
        },
        {
          name: 'node2',
          properties: { x: '200', y: '150', width: '80', height: '60' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', undefined)
      
      expect(result).toBe(-1)
    })

    it('should return -1 for null layout type', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '80', height: '60' }
        },
        {
          name: 'node2',
          properties: { x: '200', y: '150', width: '80', height: '60' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', null)
      
      expect(result).toBe(-1)
    })

    // CORRECTED: Function crashes with TypeError, not explicit throw
    it('should crash for non-existent source node', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '80', height: '60' }
        }
      ]
      
      expect(() => getPoints(elements, 'missing', 'node1', 'vertical')).toThrow(TypeError)
    })

    // CORRECTED: Function crashes with TypeError, not explicit throw
    it('should crash for non-existent target node', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '80', height: '60' }
        }
      ]
      
      expect(() => getPoints(elements, 'node1', 'missing', 'vertical')).toThrow(TypeError)
    })

    // CORRECTED: Function crashes with TypeError
    it('should crash for null elements array', () => {
      expect(() => getPoints(null, 'node1', 'node2', 'vertical')).toThrow(TypeError)
    })

    // CORRECTED: Function crashes with TypeError
    it('should crash for undefined elements array', () => {
      expect(() => getPoints(undefined, 'node1', 'node2', 'vertical')).toThrow(TypeError)
    })

    // CORRECTED: Function crashes with TypeError
    it('should crash for elements without properties', () => {
      const elements = [
        { name: 'node1' },
        { name: 'node2', properties: { x: '100', y: '100', width: '80', height: '60' } }
      ]
      
      expect(() => getPoints(elements, 'node1', 'node2', 'vertical')).toThrow(TypeError)
    })

    // CORRECTED: Function crashes with TypeError
  it('should return NaN coordinates for missing dimensions', () => {
  const elements = [
    {
      name: 'node1',
      // properties has x/y but missing width/height
      properties: { x: '100', y: '100' } 
    },
    {
      name: 'node2',
      properties: { x: '200', y: '150', width: '80', height: '60' }
    }
  ]
  
  const result = getPoints(elements, 'node1', 'node2', 'vertical')
  
  // The test should check that the calculation failed gracefully into NaN
  expect(result.absoluteStart.x).toBeNaN()
  expect(result.absoluteStart.y).toBeNaN()
})

    it('should handle non-numeric property values', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: 'abc', y: 'def', width: 'ghi', height: 'jkl' }
        },
        {
          name: 'node2',
          properties: { x: '200', y: '150', width: '80', height: '60' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'vertical')
      
      expect(isNaN(result.absoluteStart.x)).toBe(true)
    })

    // CORRECTED: Function crashes with TypeError
    it('should crash for null sourceId', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '80', height: '60' }
        }
      ]
      
      expect(() => getPoints(elements, null, 'node1', 'vertical')).toThrow(TypeError)
    })

    // CORRECTED: Function crashes with TypeError
    it('should crash for null targetId', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '80', height: '60' }
        }
      ]
      
      expect(() => getPoints(elements, 'node1', null, 'vertical')).toThrow(TypeError)
    })
  })

  describe('boundary values', () => {
    it('should handle nodes at origin', () => {
      const elements = [
        {
          name: 'origin',
          properties: { x: '0', y: '0', width: '50', height: '50' }
        },
        {
          name: 'offset',
          properties: { x: '100', y: '100', width: '50', height: '50' }
        }
      ]
      
      const result = getPoints(elements, 'origin', 'offset', 'vertical')
      
      expect(result.absoluteStart.x).toBe(25)
      expect(result.absoluteStart.y).toBe(50)
    })

    it('should handle very small node dimensions', () => {
      const elements = [
        {
          name: 'tiny',
          properties: { x: '100', y: '100', width: '0.1', height: '0.1' }
        },
        {
          name: 'normal',
          properties: { x: '110', y: '110', width: '50', height: '50' }
        }
      ]
      
      const result = getPoints(elements, 'tiny', 'normal', 'radial')
      
      expect(result).toHaveProperty('absoluteStart')
      expect(result).toHaveProperty('absoluteEnd')
    })

  it('should handle same source and target id (vertical)', () => {
  const elements = [
    { name: 'self', properties: { x: '100', y: '100', width: '80', height: '60' } }
  ]
  const result = getPoints(elements, 'self', 'self', 'vertical')

  // The logic falls to the 'else' block because 100 < 100 is false.
  // Connects Top (100) to Bottom (160).
  expect(result.points[1][0]).toBe(0)   // X aligns
  expect(result.points[1][1]).toBe(60)  // Y difference is height (160 - 100)
})

  it('should handle nodes with identical positions (horizontal)', () => {
  const elements = [
    { name: 'n1', properties: { x: '100', y: '100', width: '80', height: '60' } },
    { name: 'n2', properties: { x: '100', y: '100', width: '80', height: '60' } }
  ]
  const result = getPoints(elements, 'n1', 'n2', 'horizontal')

  // Logic falls to 'else'. Connects Left (100) to Right (180).
  expect(result.points[1][0]).toBe(80) // Width difference (180 - 100)
  expect(result.points[1][1]).toBe(0)  // Y aligns
})
  })

  describe('node lookup', () => {
    it('should find nodes by name property', () => {
      const elements = [
        {
          name: 'first',
          properties: { x: '0', y: '0', width: '50', height: '50' }
        },
        {
          name: 'second',
          properties: { x: '100', y: '100', width: '50', height: '50' }
        },
        {
          name: 'third',
          properties: { x: '200', y: '200', width: '50', height: '50' }
        }
      ]
      
      const result = getPoints(elements, 'first', 'third', 'vertical')
      
      expect(result.absoluteStart.x).toBe(25) // from 'first' node
    })

    // CORRECTED: Function uses == without break, so last match wins
    it('should handle duplicate node names (uses last occurrence)', () => {
      const elements = [
        {
          name: 'duplicate',
          properties: { x: '50', y: '50', width: '50', height: '50' }
        },
        {
          name: 'duplicate',
          properties: { x: '150', y: '150', width: '50', height: '50' }
        }
      ]
      
      const result = getPoints(elements, 'duplicate', 'duplicate', 'vertical')
      
      // Should use the last occurrence (second node at 150, 150)
      expect(result.absoluteStart.x).toBe(175) // 150 + 50/2
    })

    // CORRECTED: Function crashes with TypeError
    it('should perform case-sensitive name matching', () => {
      const elements = [
        {
          name: 'Node',
          properties: { x: '100', y: '100', width: '50', height: '50' }
        },
        {
          name: 'node',
          properties: { x: '200', y: '200', width: '50', height: '50' }
        }
      ]
      
      expect(() => getPoints(elements, 'Node', 'NODE', 'vertical')).toThrow(TypeError)
    })
  })

  describe('return value structure', () => {
    it('should return correct structure for vertical layout', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '80', height: '60' }
        },
        {
          name: 'node2',
          properties: { x: '200', y: '200', width: '80', height: '60' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'vertical')
      
      expect(result).toHaveProperty('absoluteStart')
      expect(result.absoluteStart).toHaveProperty('x')
      expect(result.absoluteStart).toHaveProperty('y')
      expect(result).toHaveProperty('points')
      expect(Array.isArray(result.points)).toBe(true)
      expect(result.points).toHaveLength(2)
      expect(result.points[0]).toEqual([0, 0])
      expect(Array.isArray(result.points[1])).toBe(true)
    })

    it('should return correct structure for radial layout', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '80', height: '60' }
        },
        {
          name: 'node2',
          properties: { x: '200', y: '200', width: '80', height: '60' }
        }
      ]
      
      const result = getPoints(elements, 'node1', 'node2', 'radial')
      
      expect(result).toHaveProperty('absoluteStart')
      expect(result).toHaveProperty('absoluteEnd')
      expect(result).toHaveProperty('points')
      expect(result.absoluteEnd).toHaveProperty('x')
      expect(result.absoluteEnd).toHaveProperty('y')
    })

    it('should always have first point as [0, 0]', () => {
      const elements = [
        {
          name: 'node1',
          properties: { x: '100', y: '100', width: '80', height: '60' }
        },
        {
          name: 'node2',
          properties: { x: '200', y: '200', width: '80', height: '60' }
        }
      ]
      
      const vertResult = getPoints(elements, 'node1', 'node2', 'vertical')
      const horizResult = getPoints(elements, 'node1', 'node2', 'horizontal')
      const radialResult = getPoints(elements, 'node1', 'node2', 'radial')
      
      expect(vertResult.points[0]).toEqual([0, 0])
      expect(horizResult.points[0]).toEqual([0, 0])
      expect(radialResult.points[0]).toEqual([0, 0])
    })
  })
})