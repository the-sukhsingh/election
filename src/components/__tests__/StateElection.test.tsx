import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StateElection from '../StateElection';

// Mock framer-motion to skip animations during testing
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual as any,
    motion: {
      ...((actual as any).motion || {}),
      div: 'div'
    },
    AnimatePresence: ({ children }: any) => <>{children}</>
  };
});

describe('StateElection Component', () => {
  it('renders the initial phase correctly', () => {
    render(<StateElection />);
    expect(screen.getAllByText('Announcement').length).toBeGreaterThan(0);
    expect(screen.getAllByText('State elections determine the state government. A state is divided into smaller constituencies, each electing a Member of Legislative Assembly (MLA).').length).toBeGreaterThan(0);
  });

  it('navigates to the next phase on clicking continue', () => {
    render(<StateElection />);
    
    const continueBtn = screen.getByRole('button', { name: /Continue to next step/i });
    fireEvent.click(continueBtn);
    
    // After clicking continue, should be on the "Candidates" phase
    expect(screen.getAllByText('Candidates').length).toBeGreaterThan(0);
  });

  it('enforces voting in the Voting Day phase', () => {
    render(<StateElection />);
    
    const continueBtn = screen.getByRole('button', { name: /Continue to next step/i });
    
    // Go to candidates
    fireEvent.click(continueBtn);
    
    // Go to campaign
    fireEvent.click(continueBtn);
    
    // Go to voting
    fireEvent.click(continueBtn);
    
    // Check if we are on voting phase
    expect(screen.getAllByText('Voting Day').length).toBeGreaterThan(0);
    
    // Continue should be disabled or text should be "Vote First"
    const voteFirstBtn = screen.getByRole('button', { name: /You must vote first to continue/i });
    expect(voteFirstBtn).toBeInTheDocument();
    expect(voteFirstBtn).toBeDisabled();
    
    // Cast a vote
    const voteBtn = screen.getAllByRole('button', { name: /Vote for/i })[0];
    fireEvent.click(voteBtn);
    
    // Now continue should be enabled
    const enabledContinueBtn = screen.getByRole('button', { name: /Continue to next step/i });
    expect(enabledContinueBtn).toBeEnabled();
  });
});
