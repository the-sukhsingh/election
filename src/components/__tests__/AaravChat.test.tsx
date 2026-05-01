import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AaravChat from '../AaravChat';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual as any,
    motion: { ...((actual as any).motion || {}), span: 'span', div: 'div' },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('AaravChat Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the floating chat button', () => {
    render(<AaravChat />);
    const btn = screen.getByRole('button', { name: /ask aarav/i });
    expect(btn).toBeInTheDocument();
  });

  it('opens the chat dialog on button click', () => {
    render(<AaravChat />);
    const openBtn = screen.getByRole('button', { name: /ask aarav/i });
    fireEvent.click(openBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Namaste!/i)).toBeInTheDocument();
  });

  it('closes the chat dialog on second click', () => {
    render(<AaravChat />);
    const btn = screen.getByRole('button', { name: /ask aarav/i });
    fireEvent.click(btn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close aarav/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(<AaravChat />);
    fireEvent.click(screen.getByRole('button', { name: /ask aarav/i }));
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    expect(sendBtn).toBeDisabled();
  });

  it('enables send button when input has text', () => {
    render(<AaravChat />);
    fireEvent.click(screen.getByRole('button', { name: /ask aarav/i }));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'What is EVM?' } });
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    expect(sendBtn).not.toBeDisabled();
  });

  it('sends a message and shows AI response', async () => {
    // Mock the fetch call to /api/ask
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ answer: 'EVM stands for Electronic Voting Machine.' }),
    }));

    render(<AaravChat />);
    fireEvent.click(screen.getByRole('button', { name: /ask aarav/i }));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'What is EVM?' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText('EVM stands for Electronic Voting Machine.')).toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'AI service is not configured.' }),
    }));

    render(<AaravChat />);
    fireEvent.click(screen.getByRole('button', { name: /ask aarav/i }));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'What is EVM?' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('AI service is not configured.');
    });
  });

  it('shows error message on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    render(<AaravChat />);
    fireEvent.click(screen.getByRole('button', { name: /ask aarav/i }));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'What is EVM?' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/network error/i);
    });
  });

  it('sends message on Enter key press', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ answer: 'The majority in Lok Sabha is 272.' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    render(<AaravChat />);
    fireEvent.click(screen.getByRole('button', { name: /ask aarav/i }));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'What is majority?' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/ask', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ query: 'What is majority?' }),
      }));
    });
  });
});
