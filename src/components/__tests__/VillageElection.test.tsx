import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VillageElection from '../VillageElection';

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

describe('VillageElection Component', () => {
  it('renders the initial phase correctly', () => {
    render(<VillageElection />);
    expect(screen.getAllByText('Announcement').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Panchayati Raj represents local self-government. Unlike national elections run by the ECI, the State Election Commission (SEC) organizes Panchayat elections.').length).toBeGreaterThan(0);
  });

  it('navigates to the next phase on clicking continue', () => {
    render(<VillageElection />);
    
    const continueBtn = screen.getByRole('button', { name: /Continue to next step/i });
    fireEvent.click(continueBtn);
    
    // After clicking continue, should be on the "Nominations" phase
    expect(screen.getAllByText('Nominations').length).toBeGreaterThan(0);
  });

  it('enforces voting in the Voting Day phase', () => {
    render(<VillageElection />);
    
    const continueBtn = screen.getByRole('button', { name: /Continue to next step/i });
    
    // Go to candidates (Nominations)
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
