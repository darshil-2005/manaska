import { describe, it, expect } from 'vitest'
import { layoutMindmap } from '../../src/utils/layoutMindmap'

describe('layoutMindmap', () => {
  describe('basic functionality', () => {
    it('should layout a simple single-node mindmap', () => {
      const root = { id: '1', label: 'Root' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result).toHaveProperty('x')
      expect(result).toHaveProperty('y')
      expect(result).toHaveProperty('width')
      expect(result).toHaveProperty('height')
      expect(result.id).toBe('1')
      expect(result.label).toBe('Root')
    })

    it('should layout a two-level vertical mindmap', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          { id: '2', label: 'Child 1' },
          { id: '3', label: 'Child 2' }
        ]
      }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.children).toHaveLength(2)
      expect(result.children[0].x).toBeGreaterThan(result.x)
      expect(result.children[0]).toHaveProperty('y')
      expect(result.children[1]).toHaveProperty('y')
    })

    it('should layout a horizontal mindmap', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          { id: '2', label: 'Child 1' },
          { id: '3', label: 'Child 2' }
        ]
      }
      const result = layoutMindmap(root, 'horizontal')
      
      expect(result).toHaveProperty('x')
      expect(result).toHaveProperty('y')
      expect(result.children[0].y).toBeGreaterThan(result.y)
    })

    it('should layout a radial mindmap', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          { id: '2', label: 'Child 1' },
          { id: '3', label: 'Child 2' }
        ]
      }
      const result = layoutMindmap(root, 'radial')
      
      expect(result).toHaveProperty('x')
      expect(result).toHaveProperty('y')
      expect(result).toHaveProperty('angleMid')
      expect(result).toHaveProperty('angleStart')
      expect(result).toHaveProperty('angleEnd')
    })
  })

  describe('depth and leaf count calculation', () => {
    it('should correctly calculate depth for nested nodes', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          {
            id: '2',
            label: 'Child',
            children: [
              { id: '3', label: 'Grandchild' }
            ]
          }
        ]
      }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.depth).toBe(0)
      expect(result.children[0].depth).toBe(1)
      expect(result.children[0].children[0].depth).toBe(2)
    })

    it('should correctly calculate leaf count', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          { id: '2', label: 'Leaf 1' },
          { id: '3', label: 'Leaf 2' },
          { id: '4', label: 'Leaf 3' }
        ]
      }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.leafCount).toBe(3)
      expect(result.children[0].leafCount).toBe(1)
    })

    it('should calculate leaf count for complex tree', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          {
            id: '2',
            label: 'Branch 1',
            children: [
              { id: '3', label: 'Leaf 1' },
              { id: '4', label: 'Leaf 2' }
            ]
          },
          { id: '5', label: 'Leaf 3' }
        ]
      }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.leafCount).toBe(3)
      expect(result.children[0].leafCount).toBe(2)
      expect(result.children[1].leafCount).toBe(1)
    })
  })

  describe('width calculation', () => {
    it('should compute width based on label length', () => {
      const root = { id: '1', label: 'Short' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.width).toBeGreaterThanOrEqual(120) // minWidth
    })

    it('should use minimum width for short labels', () => {
      const root = { id: '1', label: 'A' }
      const result = layoutMindmap(root, 'vertical', { minWidth: 150 })
      
      expect(result.width).toBe(150)
    })

    it('should scale width for longer labels', () => {
      const root1 = { id: '1', label: 'Short' }
      const root2 = { id: '2', label: 'A much longer label text' }
      
      const result1 = layoutMindmap(root1, 'vertical')
      const result2 = layoutMindmap(root2, 'vertical')
      
      expect(result2.width).toBeGreaterThan(result1.width)
    })

    it('should handle null or undefined labels', () => {
      const root = { id: '1', label: null }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.width).toBe(120) // should use minWidth
    })

    it('should handle empty string labels', () => {
      const root = { id: '1', label: '' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.width).toBe(120) // should use minWidth
    })
  })

  describe('custom options', () => {
    it('should respect custom dx spacing', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [{ id: '2', label: 'Child' }]
      }
      const result = layoutMindmap(root, 'vertical', { dx: 500 })
      
      expect(result.children[0].x - result.x).toBe(500)
    })

    it('should respect custom dy spacing', () => {
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
    })

    it('should respect custom node height', () => {
      const root = { id: '1', label: 'Root' }
      const result = layoutMindmap(root, 'vertical', { nodeHeight: 100 })
      
      expect(result.height).toBe(100)
    })

    it('should respect custom margins', () => {
      const root = { id: '1', label: 'Root' }
      const result = layoutMindmap(root, 'vertical', { marginX: 200, marginY: 150 })
      
      expect(result.x).toBe(200)
      expect(result.y).toBe(150)
    })

    it('should respect custom centerX and centerY for radial', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [{ id: '2', label: 'Child' }]
      }
      const result = layoutMindmap(root, 'radial', { centerX: 500, centerY: 500 })
      
      expect(result.x).toBe(500)
      expect(result.y).toBe(500)
    })

    it('should respect custom ringSpacing for radial', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [{ id: '2', label: 'Child' }]
      }
      const result = layoutMindmap(root, 'radial', { ringSpacing: 200, centerX: 0, centerY: 0 })
      
      expect(result.children[0].radiusFromCenter).toBe(200)
    })
  })

  describe('edge cases', () => {
    it('should handle node without children property', () => {
      const root = { id: '1', label: 'Root' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.children).toEqual([])
      expect(result.leafCount).toBe(1)
    })

    it('should handle empty children array', () => {
      const root = { id: '1', label: 'Root', children: [] }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.children).toEqual([])
      expect(result.leafCount).toBe(1)
    })

    it('should handle deeply nested tree', () => {
      let node = { id: '5', label: 'Level 5' }
      for (let i = 4; i >= 1; i--) {
        node = { id: String(i), label: `Level ${i}`, children: [node] }
      }
      
      const result = layoutMindmap(node, 'vertical')
      
      expect(result.depth).toBe(0)
      let current = result
      for (let i = 1; i <= 4; i++) {
        expect(current.children).toHaveLength(1)
        current = current.children[0]
        expect(current.depth).toBe(i)
      }
    })

    it('should handle wide tree with many children', () => {
      const children = Array.from({ length: 10 }, (_, i) => ({
        id: String(i + 2),
        label: `Child ${i + 1}`
      }))
      const root = { id: '1', label: 'Root', children }
      
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.children).toHaveLength(10)
      expect(result.leafCount).toBe(10)
    })

    it('should preserve metadata from original nodes', () => {
      const root = {
        id: '1',
        label: 'Root',
        meta: { color: 'red', priority: 1 }
      }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.meta).toEqual({ color: 'red', priority: 1 })
    })

    it('should handle nodes without metadata', () => {
      const root = { id: '1', label: 'Root' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.meta).toEqual({})
    })

    it('should not mutate original tree', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [{ id: '2', label: 'Child' }]
      }
      const original = JSON.parse(JSON.stringify(root))
      
      layoutMindmap(root, 'vertical')
      
      expect(root).toEqual(original)
    })
  })

  describe('radial layout specifics', () => {
    it('should assign angles to all nodes', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          { id: '2', label: 'Child 1' },
          { id: '3', label: 'Child 2' },
          { id: '4', label: 'Child 3' }
        ]
      }
      const result = layoutMindmap(root, 'radial')
      
      expect(result.angleStart).toBe(0)
      expect(result.angleEnd).toBe(Math.PI * 2)
      result.children.forEach(child => {
        expect(child).toHaveProperty('angleStart')
        expect(child).toHaveProperty('angleEnd')
        expect(child).toHaveProperty('angleMid')
      })
    })

    it('should distribute angles proportionally to leaf counts', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          {
            id: '2',
            label: 'Branch with 2 leaves',
            children: [
              { id: '3', label: 'Leaf 1' },
              { id: '4', label: 'Leaf 2' }
            ]
          },
          { id: '5', label: 'Single leaf' }
        ]
      }
      const result = layoutMindmap(root, 'radial')
      
      const angle1 = result.children[0].angleEnd - result.children[0].angleStart
      const angle2 = result.children[1].angleEnd - result.children[1].angleStart
      
      // First child should have roughly twice the angle of second child
      expect(angle1).toBeCloseTo(angle2 * 2, 10)
    })

    it('should place root at center for radial layout', () => {
      const root = { id: '1', label: 'Root' }
      const result = layoutMindmap(root, 'radial', { centerX: 400, centerY: 300 })
      
      expect(result.x).toBe(400)
      expect(result.y).toBe(300)
      expect(result.radiusFromCenter).toBe(0)
    })

    it('should make radial nodes have equal width and height', () => {
      const root = {
        id: '1',
        label: 'Root with long label',
        children: [{ id: '2', label: 'Child' }]
      }
      const result = layoutMindmap(root, 'radial')
      
      expect(result.width).toBe(result.height)
      expect(result.children[0].width).toBe(result.children[0].height)
    })
  })

  describe('boundary values', () => {
    it('should handle single character labels', () => {
      const root = { id: '1', label: 'A' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.width).toBeGreaterThanOrEqual(120)
      expect(result).toHaveProperty('x')
      expect(result).toHaveProperty('y')
    })

    it('should handle very long labels', () => {
      const longLabel = 'A'.repeat(1000)
      const root = { id: '1', label: longLabel }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.width).toBeGreaterThan(1000)
    })

    it('should handle numeric labels', () => {
      const root = { id: '1', label: 12345 }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result).toHaveProperty('width')
      expect(result.width).toBeGreaterThanOrEqual(120)
    })

    it('should handle zero as label', () => {
      const root = { id: '1', label: 0 }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result).toHaveProperty('width')
    })

    it('should handle unicode characters in labels', () => {
      const root = { id: '1', label: '你好世界 🎉' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result).toHaveProperty('width')
      expect(result.width).toBeGreaterThan(0)
    })
  })

  describe('invalid inputs', () => {
    it('should handle undefined root gracefully', () => {
      expect(() => layoutMindmap(undefined, 'vertical')).toThrow()
    })

    it('should handle null root gracefully', () => {
      expect(() => layoutMindmap(null, 'vertical')).toThrow()
    })

    it('should handle root without id', () => {
      const root = { label: 'Root' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result).toHaveProperty('x')
      expect(result).toHaveProperty('y')
    })

    it('should handle root without label', () => {
      const root = { id: '1' }
      const result = layoutMindmap(root, 'vertical')
      
      expect(result).toHaveProperty('width')
      expect(result.width).toBe(120) // minWidth
    })

    it('should default to vertical for unknown type', () => {
      const root = { id: '1', label: 'Root' }
      const result1 = layoutMindmap(root, 'unknown')
      const result2 = layoutMindmap(root, 'vertical')
      
      expect(result1.x).toBe(result2.x)
    })

    it('should handle undefined type', () => {
      const root = { id: '1', label: 'Root' }
      const result = layoutMindmap(root, undefined)
      
      expect(result).toHaveProperty('x')
      expect(result).toHaveProperty('y')
    })

    it('should handle empty options object', () => {
      const root = { id: '1', label: 'Root' }
      const result = layoutMindmap(root, 'vertical', {})
      
      expect(result).toHaveProperty('x')
      expect(result).toHaveProperty('y')
    })

    it('should handle null in children array', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [null, { id: '2', label: 'Valid' }]
      }
      
      expect(() => layoutMindmap(root, 'vertical')).toThrow()
    })
  })

  describe('layout type comparison', () => {
    it('should produce different coordinates for different layout types', () => {
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
    })

    it('should maintain same structure across layout types', () => {
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
      
      expect(vertical.children).toHaveLength(2)
      expect(horizontal.children).toHaveLength(2)
      expect(radial.children).toHaveLength(2)
      
      expect(vertical.id).toBe(horizontal.id)
      expect(horizontal.id).toBe(radial.id)
    })
  })

  describe('complex tree structures', () => {
    it('should handle unbalanced tree', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          {
            id: '2',
            label: 'Deep branch',
            children: [
              {
                id: '3',
                label: 'Level 3',
                children: [
                  { id: '4', label: 'Level 4' }
                ]
              }
            ]
          },
          { id: '5', label: 'Shallow branch' }
        ]
      }
      
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.children[0].children[0].children[0].depth).toBe(3)
      expect(result.children[1].depth).toBe(1)
    })

    it('should handle mixed leaf and branch nodes at same level', () => {
      const root = {
        id: '1',
        label: 'Root',
        children: [
          { id: '2', label: 'Leaf' },
          {
            id: '3',
            label: 'Branch',
            children: [
              { id: '4', label: 'Child of branch' }
            ]
          },
          { id: '5', label: 'Another leaf' }
        ]
      }
      
      const result = layoutMindmap(root, 'vertical')
      
      expect(result.children[0].leafCount).toBe(1)
      expect(result.children[1].leafCount).toBe(1)
      expect(result.children[2].leafCount).toBe(1)
      expect(result.leafCount).toBe(3)
    })
  })

  describe('additional coverage for missing branches', () => {
  // Line 141: covers the fallback for centerX when it's null/undefined in radial WITHOUT custom centerX
  it('should use computed center when centerX is not provided in radial layout', () => {
    const root = {
      id: '1',
      label: 'Root',
      children: [{ id: '2', label: 'Child' }]
    }
    // Don't provide centerX/centerY - let it compute
    const result = layoutMindmap(root, 'radial')
    
    // Should have valid coordinates (not using provided center)
    expect(result.x).toBeGreaterThan(0)
    expect(result.y).toBeGreaterThan(0)
    expect(result.radiusFromCenter).toBe(0)
  })

  // Line 164: covers the horizontal layout when node has no children (empty array or undefined)
  it('should handle horizontal layout with leaf node without children array', () => {
    const root = {
      id: '1',
      label: 'Root',
      children: [
        { id: '2', label: 'Leaf without children property' }
      ]
    }
    const result = layoutMindmap(root, 'horizontal')
    
    expect(result.children[0].children).toEqual([])
    expect(result.children[0].x).toBeGreaterThan(0)
    expect(result.children[0].y).toBeGreaterThan(result.y)
  })

  // Line 176: covers the vertical layout when node has no children (empty or undefined)
  it('should handle vertical layout with leaf node without children array', () => {
    const root = {
      id: '1',
      label: 'Root',
      children: [
        { id: '2', label: 'Leaf without children property' }
      ]
    }
    const result = layoutMindmap(root, 'vertical')
    
    expect(result.children[0].children).toEqual([])
    expect(result.children[0].x).toBeGreaterThan(result.x)
    expect(result.children[0].y).toBeGreaterThan(0)
  })

  // Lines 102-109: covers the radial angle assignment when children array exists but might be empty
  it('should handle radial layout with node having empty children array', () => {
    const root = {
      id: '1',
      label: 'Root',
      children: [
        { 
          id: '2', 
          label: 'Branch', 
          children: [] // explicitly empty
        }
      ]
    }
    const result = layoutMindmap(root, 'radial')
    
    expect(result.children[0].angleStart).toBeDefined()
    expect(result.children[0].angleEnd).toBeDefined()
    expect(result.children[0].angleMid).toBeDefined()
    expect(result.children[0].children).toEqual([])
  })

  // Additional test for radial with deeply nested structure (covers lines 102-109 more thoroughly)
  it('should assign angles correctly in deeply nested radial layout', () => {
    const root = {
      id: '1',
      label: 'Root',
      children: [
        {
          id: '2',
          label: 'Branch 1',
          children: [
            { id: '3', label: 'Leaf 1' },
            { id: '4', label: 'Leaf 2' }
          ]
        },
        {
          id: '5',
          label: 'Branch 2',
          children: [
            { id: '6', label: 'Leaf 3' }
          ]
        }
      ]
    }
    const result = layoutMindmap(root, 'radial')
    
    // Check that nested children also have angles assigned
    expect(result.children[0].children[0].angleStart).toBeDefined()
    expect(result.children[0].children[0].angleEnd).toBeDefined()
    expect(result.children[0].children[1].angleStart).toBeDefined()
    expect(result.children[1].children[0].angleStart).toBeDefined()
  })

  // Cover the case where radial layout computes bounding box and translates
  it('should correctly compute and translate radial layout without provided center', () => {
    const root = {
      id: '1',
      label: 'Root',
      children: [
        { id: '2', label: 'Child 1' },
        { id: '3', label: 'Child 2' },
        { id: '4', label: 'Child 3' },
        { id: '5', label: 'Child 4' }
      ]
    }
    // No centerX/centerY provided - triggers bbox computation
    const result = layoutMindmap(root, 'radial', { ringSpacing: 300 })
    
    // All coordinates should be positive after translation
    expect(result.x).toBeGreaterThanOrEqual(0)
    expect(result.y).toBeGreaterThanOrEqual(0)
    result.children.forEach(child => {
      expect(child.x).toBeGreaterThanOrEqual(0)
      expect(child.y).toBeGreaterThanOrEqual(0)
    })
  })
})
})