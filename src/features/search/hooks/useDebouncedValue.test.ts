import { renderHook, waitFor } from '@testing-library/react-native';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  it('returns the latest value only after the delay', async () => {
    const { result, rerender } = await renderHook(({ value }: { value: string }) => useDebouncedValue(value, 20), {
      initialProps: { value: 're' },
    });

    expect(result.current).toBe('re');
    rerender({ value: 'react-native' });
    expect(result.current).toBe('re');

    await waitFor(() => {
      expect(result.current).toBe('react-native');
    });
  });
});
