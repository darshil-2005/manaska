// tests/utils/randomId.test.js
import { describe, it, expect, vi } from 'vitest';
import { randomId } from '../../src/utils/randomId.js';

describe('randomId', () => {
  it('should generate an ID of default length 15', () => {
    const id = randomId();
    expect(id).toHaveLength(15);
  });

  it('should generate an ID of the given custom length', () => {
    const id = randomId(25);
    expect(id).toHaveLength(25);
  });

  it('should only contain allowed characters', () => {
    const allowed = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const id = randomId(50);

    for (const ch of id) {
      expect(allowed.includes(ch)).toBe(true);
    }
  });

  it('should generate different values (not predictable)', () => {
    const id1 = randomId();
    const id2 = randomId();
    expect(id1).not.toBe(id2);
  });

  it('should generate an empty string when length is 0', () => {
    const id = randomId(0);
    expect(id).toBe('');
  });

  it('should call Math.random correct number of times', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    randomId(10);
    expect(spy).toHaveBeenCalledTimes(10);
    spy.mockRestore();
  });
});
