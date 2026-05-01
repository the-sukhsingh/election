import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FactChecker from '../FactChecker';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual as any,
    motion: { ...((actual as any).motion || {}), div: 'div' },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('FactChecker Component', () => {
  const onBack = vi.fn();

  beforeEach(() => {
    onBack.mockClear();
  });

  it('renders the first question on mount', () => {
    render(<FactChecker onBack={onBack} />);
    expect(screen.getByText(/Fact Guard/i)).toBeInTheDocument();
    // FAKE and REAL buttons visible
    expect(screen.getByRole('button', { name: /fake/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /real/i })).toBeInTheDocument();
  });

  it('shows explanation after answering', async () => {
    render(<FactChecker onBack={onBack} />);
    const fakeBtn = screen.getByRole('button', { name: /fake/i });
    
    await act(async () => { fireEvent.click(fakeBtn); });

    // Explanation should appear
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    expect(continueBtn).toBeInTheDocument();
  });

  it('increments score for correct answer', async () => {
    render(<FactChecker onBack={onBack} />);
    // First question is FAKE (isTrue: false) — so clicking FAKE is correct
    const fakeBtn = screen.getByRole('button', { name: /fake/i });
    
    await act(async () => { fireEvent.click(fakeBtn); });

    expect(screen.getByText(/Score:/i)).toBeInTheDocument();
    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  it('does not increment score for wrong answer', async () => {
    render(<FactChecker onBack={onBack} />);
    // First question is FAKE — clicking REAL is wrong
    const realBtn = screen.getByRole('button', { name: /real/i });

    await act(async () => { fireEvent.click(realBtn); });

    // Score should still be 0
    const scoreText = screen.getByText(/Score:/i);
    expect(scoreText.closest('div')).toHaveTextContent('0');
  });

  it('shows results screen after all questions are answered', async () => {
    render(<FactChecker onBack={onBack} />);
    const QUESTION_COUNT = 5;

    for (let i = 0; i < QUESTION_COUNT; i++) {
      const fakeBtn = screen.queryByRole('button', { name: /fake/i });
      const realBtn = screen.queryByRole('button', { name: /real/i });
      
      await act(async () => {
        // Just pick FAKE every time — result screen appears regardless
        (fakeBtn ?? realBtn)!.click();
      });

      const continueBtn = screen.queryByRole('button', { name: /continue/i });
      if (continueBtn) {
        await act(async () => { continueBtn.click(); });
      }
    }

    // Should show finish screen
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();
    });
  });

  it('calls onBack when Exit is clicked on results screen', async () => {
    render(<FactChecker onBack={onBack} />);
    const QUESTION_COUNT = 5;

    for (let i = 0; i < QUESTION_COUNT; i++) {
      const btn = screen.queryByRole('button', { name: /fake/i }) ?? screen.queryByRole('button', { name: /real/i });
      if (btn) await act(async () => { btn.click(); });
      const cont = screen.queryByRole('button', { name: /continue/i });
      if (cont) await act(async () => { cont.click(); });
    }

    await waitFor(() => {
      const exitBtn = screen.getByRole('button', { name: /exit/i });
      fireEvent.click(exitBtn);
    });

    expect(onBack).toHaveBeenCalledOnce();
  });
});
