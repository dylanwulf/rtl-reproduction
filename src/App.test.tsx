import { describe, expect, test, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  vi.useFakeTimers({
    now: new Date('2021-02-02T16:50:26.379Z'),
    toFake: [
      // everything except for 'performance', which causes errors in browsers
      'Date',
      'cancelAnimationFrame',
      'cancelIdleCallback',
      'clearImmediate',
      'clearInterval',
      'clearTimeout',
      'hrtime',
      // 'performance',
      'nextTick',
      'queueMicrotask',
      'requestAnimationFrame',
      'requestIdleCallback',
      'setImmediate',
      'setInterval',
      'setTimeout',
    ],
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Test Suite', () => {
  test('Test', async () => {
    render(<App />);
    const button = screen.getByRole('button', { name: 'Begin Payment' });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByText('Time Remaining: 02:00')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getByText('Time Remaining: 01:59')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });

    expect(screen.getByText('Payment Successful')).toBeInTheDocument();
  });
});
