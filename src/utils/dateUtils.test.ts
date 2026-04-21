import { describe, it, expect } from 'vitest';
import { getMonthsBetween, getBarPosition } from './dateUtils';

describe('getMonthsBetween', () => {
  it('returns a single month when start and end are in the same month', () => {
    expect(getMonthsBetween('2024-03-01', '2024-03-31')).toEqual(['Mar 2024']);
  });

  it('returns consecutive months within the same year', () => {
    expect(getMonthsBetween('2024-01-15', '2024-04-10')).toEqual([
      'Jan 2024', 'Fev 2024', 'Mar 2024', 'Abr 2024',
    ]);
  });

  it('spans across year boundaries', () => {
    expect(getMonthsBetween('2023-11-01', '2024-02-28')).toEqual([
      'Nov 2023', 'Dez 2023', 'Jan 2024', 'Fev 2024',
    ]);
  });

  it('uses Portuguese month abbreviations', () => {
    const months = getMonthsBetween('2024-01-01', '2024-12-31');
    expect(months).toEqual([
      'Jan 2024', 'Fev 2024', 'Mar 2024', 'Abr 2024',
      'Mai 2024', 'Jun 2024', 'Jul 2024', 'Ago 2024',
      'Set 2024', 'Out 2024', 'Nov 2024', 'Dez 2024',
    ]);
  });

  it('returns a single month when start and end are the same date', () => {
    expect(getMonthsBetween('2024-06-15', '2024-06-15')).toEqual(['Jun 2024']);
  });
});

describe('getBarPosition', () => {
  it('returns full width when project spans the entire timeline', () => {
    const result = getBarPosition('2024-01-01', '2024-12-31', '2024-01-01', '2024-12-31');
    expect(result.left).toBeCloseTo(0);
    expect(result.width).toBeCloseTo(100);
  });

  it('returns correct proportional position for a project in the middle', () => {
    // Timeline: Jan 1 to Dec 31 (365 days)
    // Project: Apr 1 to Jun 30
    const result = getBarPosition('2024-04-01', '2024-06-30', '2024-01-01', '2024-12-31');
    expect(result.left).toBeGreaterThan(0);
    expect(result.left).toBeLessThan(50);
    expect(result.width).toBeGreaterThan(0);
    expect(result.width).toBeLessThan(100);
  });

  it('clamps project start before timeline start', () => {
    const result = getBarPosition('2023-06-01', '2024-06-30', '2024-01-01', '2024-12-31');
    expect(result.left).toBeCloseTo(0);
    expect(result.width).toBeGreaterThan(0);
  });

  it('clamps project end after timeline end', () => {
    const result = getBarPosition('2024-06-01', '2025-06-30', '2024-01-01', '2024-12-31');
    expect(result.left).toBeGreaterThan(0);
    // Width should extend to the end of the timeline
    expect(result.left + result.width).toBeCloseTo(100, 0);
  });

  it('returns zero width when project is entirely before the timeline', () => {
    const result = getBarPosition('2023-01-01', '2023-06-30', '2024-01-01', '2024-12-31');
    expect(result.width).toBe(0);
  });

  it('returns zero width when project is entirely after the timeline', () => {
    const result = getBarPosition('2025-06-01', '2025-12-31', '2024-01-01', '2024-12-31');
    expect(result.width).toBe(0);
  });

  it('width is always >= 0', () => {
    const result = getBarPosition('2025-01-01', '2025-06-30', '2024-01-01', '2024-12-31');
    expect(result.width).toBeGreaterThanOrEqual(0);
  });

  it('handles zero-length timeline gracefully', () => {
    const result = getBarPosition('2024-01-01', '2024-06-30', '2024-03-15', '2024-03-15');
    expect(result.left).toBe(0);
    expect(result.width).toBe(0);
  });
});
