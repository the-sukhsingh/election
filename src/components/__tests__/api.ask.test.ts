import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ── Mock Gemini SDK (hoisted — runs before imports) ───────────────────────────
const mockGenerateContent = vi.fn();

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return { generateContent: mockGenerateContent };
    }
  },
  HarmCategory: {
    HARM_CATEGORY_HARASSMENT:        'HARM_CATEGORY_HARASSMENT',
    HARM_CATEGORY_HATE_SPEECH:       'HARM_CATEGORY_HATE_SPEECH',
    HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT',
  },
  HarmBlockThreshold: {
    BLOCK_LOW_AND_ABOVE: 'BLOCK_LOW_AND_ABOVE',
  },
}));

// Import the route ONCE after mocks are registered
import { POST, GET } from '../../app/api/ask/route';

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeRequest(body: unknown, ip = '127.0.0.1'): NextRequest {
  return new NextRequest('http://localhost/api/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('GET /api/ask', () => {
  it('returns 405 for GET requests', async () => {
    const res = await GET();
    expect(res.status).toBe(405);
  });
});

describe('POST /api/ask — validation', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', 'real-test-key');
    mockGenerateContent.mockReset();
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'mocked answer' },
    });
  });

  it('returns 400 for missing query field', async () => {
    const res = await POST(makeRequest({}, 'v-1'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/non-empty string/i);
  });

  it('returns 400 for non-string query', async () => {
    const res = await POST(makeRequest({ query: 42 }, 'v-2'));
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': 'v-3' },
      body: 'not-json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('POST /api/ask — API key check', () => {
  it('returns 503 when GEMINI_API_KEY is placeholder', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'your_gemini_api_key_here');
    const res = await POST(makeRequest({ query: 'What is an election?' }, 'k-1'));
    expect(res.status).toBe(503);
  });

  it('returns 503 when GEMINI_API_KEY is empty', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    const res = await POST(makeRequest({ query: 'What is EVM?' }, 'k-2'));
    expect(res.status).toBe(503);
  });
});

describe('POST /api/ask — topic guard', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', 'real-test-key');
    mockGenerateContent.mockReset();
  });

  it('returns polite redirect for clearly off-topic query without calling Gemini', async () => {
    const res = await POST(makeRequest({ query: 'Please give me a chocolate cake recipe step by step' }, 'g-1'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.answer).toMatch(/only.*questions/i);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });
});

describe('POST /api/ask — successful AI call', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', 'real-test-key');
    mockGenerateContent.mockReset();
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'EVM stands for Electronic Voting Machine.' },
    });
  });

  it('returns 200 with the AI-generated answer', async () => {
    const res = await POST(makeRequest({ query: 'What is EVM?' }, 's-1'));
    expect(res.status).toBe(200);
    expect((await res.json()).answer).toBe('EVM stands for Electronic Voting Machine.');
  });

  it('truncates long queries without crashing', async () => {
    const longQuery = 'What is election '.repeat(50);
    const res = await POST(makeRequest({ query: longQuery }, 's-2'));
    expect(res.status).toBe(200);
  });
});

describe('POST /api/ask — Gemini errors', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', 'real-test-key');
    mockGenerateContent.mockReset();
  });

  it('returns 502 when Gemini SDK throws', async () => {
    mockGenerateContent.mockRejectedValue(new Error('SDK failure'));
    const res = await POST(makeRequest({ query: 'What is EVM?' }, 'e-1'));
    expect(res.status).toBe(502);
  });
});

describe('POST /api/ask — rate limiting', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', 'real-test-key');
    mockGenerateContent.mockReset();
    mockGenerateContent.mockResolvedValue({ response: { text: () => 'ok' } });
  });

  it('returns 429 after exceeding rate limit from same IP', async () => {
    // Use a unique IP to avoid cross-test interference
    const ip = `rl-${Date.now()}`;
    for (let i = 0; i < 20; i++) {
      await POST(makeRequest({ query: 'What is EVM?' }, ip));
    }
    const limited = await POST(makeRequest({ query: 'What is EVM?' }, ip));
    expect(limited.status).toBe(429);
  });

  it('allows requests from different IPs independently', async () => {
    const ipA = `rl-a-${Date.now()}`;
    const ipB = `rl-b-${Date.now()}`;
    // Exhaust IP A
    for (let i = 0; i < 20; i++) {
      await POST(makeRequest({ query: 'What is EVM?' }, ipA));
    }
    // IP B should still succeed
    const res = await POST(makeRequest({ query: 'What is EVM?' }, ipB));
    expect(res.status).toBe(200);
  });
});
