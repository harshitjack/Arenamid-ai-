// OpenRouter AI Integration
// OpenRouter provides an OpenAI-compatible API, so we use fetch directly.
// Docs: https://openrouter.ai/docs

// NOTE: Key is read lazily (inside functions) so dotenv.config() in server.ts
// always runs first before this module captures the value.
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free, fast model — change to any model slug from https://openrouter.ai/models
// Supports overriding via OPENROUTER_MODEL env var, defaulting to the auto-routing free model.
const getModel = () => process.env.OPENROUTER_MODEL || 'openrouter/free';

const getKey = () => process.env.OPENROUTER_API_KEY;

// Called once at startup to log status (called from server.ts after dotenv loads)
export const logAIStatus = () => {
  if (getKey()) {
    console.log('🤖 OpenRouter AI initialized. Model:', getModel(), '| Key prefix:', getKey()!.substring(0, 12) + '...');
  } else {
    console.warn('⚠️  [WARN] OPENROUTER_API_KEY is not set. Using ArenaMind Mock AI engine.');
  }
};

// System prompt that gives the AI context about the stadium platform
const SYSTEM_PROMPT = `You are ArenaMind AI, the central intelligence system for a FIFA 2026 World Cup stadium operations platform.
You help fans, volunteers, and staff with: seating directions, food stall recommendations, restroom locations, transport options (metro/bus/taxi), emergency guidance, live match information, and general stadium queries.
Keep responses concise, helpful, and stadium-focused. When giving directions or recommendations, be specific and practical.`;

// ----------------------------------------------------
// OpenRouter API caller
// ----------------------------------------------------
const callOpenRouter = async (
  messages: { role: string; content: string }[],
  maxTokens = 500
): Promise<string> => {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getKey()}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'ArenaMind AI Stadium Platform',
    },
    body: JSON.stringify({
      model: getModel(),
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errorBody}`);
  }

  const data: any = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenRouter');
  return content;
};

// ----------------------------------------------------
// Mock AI Engine for offline fallbacks
// ----------------------------------------------------
const runSimulatedAI = async (prompt: string, category?: string): Promise<string> => {
  const query = prompt.toLowerCase();

  if (category === 'emergency' || query.includes('emergency') || query.includes('hurt') || query.includes('fire') || query.includes('fight')) {
    return JSON.stringify({
      severity: query.includes('fire') || query.includes('heart') || query.includes('unconscious') ? 'critical' : 'high',
      suggestedResponse: 'Immediately deploy nearby volunteer team and alert Level 2 medical responders.',
      responsePlan: [
        'Dispatch Volunteer Team Alpha to the location immediately.',
        'Clear emergency route from Gate B to Medical Center.',
        'Inform stadium operations command center.',
        'Broadcast low-frequency calm alerts to surrounding sections if necessary.'
      ],
      recommendedPath: ['Gate A', 'Section 104 Corridor', 'Main Medical Bay']
    });
  }

  if (query.includes('seat') || query.includes('find') || query.includes('restroom') || query.includes('toilet') || query.includes('gate')) {
    return "To reach your seat in Section 104, take the escalator near Gate B to the Upper Level. Head left past the restrooms. The shortest and least-crowded path is clear, and the walking time is approximately 3 minutes. The nearest restroom is located behind Section 103, which currently has a wait time of less than 2 minutes.";
  }

  if (query.includes('food') || query.includes('halal') || query.includes('vegan') || query.includes('eat') || query.includes('vegetarian')) {
    return "I recommend the 'Copa Grill' behind Section 112. They serve delicious Halal options and have a short queue (approx 4 mins wait). For Vegan/Vegetarian options, 'Green Field Bistro' at Gate D has the shortest queue right now (approx 2 mins).";
  }

  if (query.includes('transport') || query.includes('metro') || query.includes('bus') || query.includes('uber') || query.includes('taxi')) {
    return "The Metro Line 1 (Green) is currently operating at high frequency. Best exit gate is Gate C (East Exit), which leads directly to the Metro station. The walking time is 6 minutes and traffic flow is steady. Avoid Gate A as it is highly congested.";
  }

  if (query.includes('match') || query.includes('who won') || query.includes('score') || query.includes('prediction')) {
    return "The score is currently 2-1, with USA holding 58% possession. AI predicts a 72% chance of USA winning. Next recommendation: expect Mexico to sub on an extra midfielder to regain control.";
  }

  return "Welcome to ArenaMind AI. I can help you find your seat, locate restrooms or food stalls, guide you through accessible routes, predict transit delays, or coordinate emergency actions. How can I assist you today?";
};

// ----------------------------------------------------
// Public AI Services
// ----------------------------------------------------

export const askGemini = async (prompt: string, history: any[] = []): Promise<string> => {
  if (!getKey()) {
    return await runSimulatedAI(prompt);
  }

  try {
    // Build message history in OpenAI format
    const messages: { role: string; content: string }[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      // Map prior conversation history
      ...history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: typeof h.parts === 'string' ? h.parts : String(h.parts),
      })),
      { role: 'user', content: prompt },
    ];

    return await callOpenRouter(messages, 500);
  } catch (error: any) {
    console.error('🔴 OpenRouter API error (falling back to mock):', error?.message || error);
    return await runSimulatedAI(prompt);
  }
};

export const classifyEmergencyAI = async (description: string, location: string): Promise<any> => {
  if (!getKey()) {
    const res = await runSimulatedAI(description, 'emergency');
    return JSON.parse(res);
  }

  const messages = [
    {
      role: 'system',
      content: 'You are an emergency response classifier for a FIFA 2026 World Cup stadium. Always respond with valid JSON only — no markdown, no explanation.'
    },
    {
      role: 'user',
      content: `Analyze this stadium emergency: "${description}" at location: "${location}".
Respond ONLY with this JSON schema:
{
  "severity": "low" | "medium" | "high" | "critical",
  "suggestedResponse": "short description",
  "responsePlan": ["step 1", "step 2", "step 3"],
  "recommendedPath": ["point A", "point B", "point C"]
}`
    }
  ];

  try {
    const text = await callOpenRouter(messages, 400);
    // Strip any markdown code fences if the model adds them
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error: any) {
    console.error('🔴 OpenRouter emergency classification error (falling back to mock):', error?.message || error);
    const res = await runSimulatedAI(description, 'emergency');
    return JSON.parse(res);
  }
};
