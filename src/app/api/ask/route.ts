import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// ── Security: validate & cap input ────────────────────────────────────────────
const MAX_QUERY_LENGTH = 200;

function sanitizeInput(input: string): string {
  return input.trim().slice(0, MAX_QUERY_LENGTH);
}

// Allowlist of topics the AI is permitted to discuss
const ALLOWED_TOPICS = [
  'election', 'voting', 'democracy', 'india', 'lok sabha', 'vidhan sabha',
  'panchayat', 'evm', 'eci', 'mla', 'mp', 'ballot', 'candidate', 'campaign',
  'constitution', 'government', 'parliament', 'minister', 'chief minister',
  'prime minister', 'sarpanch', 'gram sabha', 'nota', 'voter id', 'aadhaar',
  'mcc', 'model code of conduct', 'rajya sabha', 'president', 'governor',
  'vvpat', 'constituency', 'electoral roll', 'election commission'
];

function isTopicAllowed(query: string): boolean {
  const lower = query.toLowerCase();
  // Allow short clarifications and follow-up questions too
  if (lower.length < 20) return true;
  const regex = new RegExp(`\\b(${ALLOWED_TOPICS.join('|')})\\b`, 'i');
  return regex.test(lower);
}

// ── Rate limiting (in-memory, per-process) ────────────────────────────────────
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW_MS = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  // 2. Parse & validate body
  let body: { query?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (typeof body.query !== 'string' || !body.query.trim()) {
    return NextResponse.json({ error: 'Query must be a non-empty string.' }, { status: 400 });
  }

  const query = sanitizeInput(body.query);

  // 3. Topic guard
  if (!isTopicAllowed(query)) {
    return NextResponse.json({
      answer: "I can only answer questions about Indian elections, voting processes, and democracy. Please ask me something related to those topics!"
    });
  }

  // 4. Ensure API key exists
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return NextResponse.json({ error: 'AI service is not configured.' }, { status: 503 });
  }

  // 5. Call Gemini with safety settings
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
      ],
      systemInstruction: `You are "Aarav the Navigator", a friendly and knowledgeable guide explaining Indian elections
        and democracy to first-time voters and students. Your role is strictly educational.
        - Keep answers concise (2-4 sentences max).
        - Use simple, clear language suitable for teenagers and adults alike.
        - Only answer questions about Indian elections, voting, democracy, and governance.
        - If a question is off-topic, politely redirect: "I can only help with questions about Indian democracy and elections."
        - Never generate harmful, political bias, or partisan content.
        - Do not predict election outcomes or endorse any political party.`,
    });

    const result = await model.generateContent(query);
    const answer = result.response.text();

    return NextResponse.json({ answer });
  } catch (err) {
    console.error('[Gemini API Error]', err);
    return NextResponse.json(
      { error: 'The AI assistant is temporarily unavailable. Please try again.' },
      { status: 502 }
    );
  }
}

// Reject all other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
