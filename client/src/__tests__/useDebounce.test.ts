import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('should debounce value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    );

    // Update the value
    rerender({ value: 'world', delay: 300 });

    // Value should NOT have changed yet
    expect(result.current).toBe('hello');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now it should be updated
    expect(result.current).toBe('world');
  });

  it('should reset the timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    );

    // Rapid changes
    rerender({ value: 'ab', delay: 300 });
    act(() => { jest.advanceTimersByTime(100); });

    rerender({ value: 'abc', delay: 300 });
    act(() => { jest.advanceTimersByTime(100); });

    rerender({ value: 'abcd', delay: 300 });

    // Should still be 'a' — no 300ms has elapsed since last change
    expect(result.current).toBe('a');

    // Complete the debounce
    act(() => { jest.advanceTimersByTime(300); });

    // Should be the LAST value
    expect(result.current).toBe('abcd');
  });

  it('should work with different types', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 42, delay: 200 } }
    );

    expect(result.current).toBe(42);

    rerender({ value: 100, delay: 200 });
    act(() => { jest.advanceTimersByTime(200); });

    expect(result.current).toBe(100);
  });
});
