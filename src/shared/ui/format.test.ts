import { formatCount, formatDate } from './format';

describe('format helpers', () => {
  it('compacts large counts and formats ISO dates', () => {
    expect(formatCount(12)).toBe('12');
    expect(formatCount(1500)).toBe('1.5k');
    expect(formatCount(12000)).toBe('12k');
    expect(formatCount(2_300_000)).toBe('2.3m');
    expect(formatDate('2026-09-01T12:00:00Z', 'en')).toMatch(/Sep/);
  });
});
