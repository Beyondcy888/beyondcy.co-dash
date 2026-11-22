import { describe, expect, it } from 'vitest';
import { fmtNum, fmtPct } from './format.js';

describe('Indonesian number format', () => {
  it('groups thousands with a dot', () => {
    expect(fmtNum(0)).toBe('0');
    expect(fmtNum(1250)).toBe('1.250');
    expect(fmtNum(89200)).toBe('89.200');
  });
  it('writes percentages with a decimal comma', () => {
    expect(fmtPct(35.5)).toBe('35,5%');
    expect(fmtPct(68.8)).toBe('68,8%');
    expect(fmtPct(100)).toBe('100%');
    expect(fmtPct(0)).toBe('0%');
    expect(fmtPct(null)).toBe('–');
  });
});
