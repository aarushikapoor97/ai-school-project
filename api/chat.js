const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM = `You are Lucia, the warm AI dining concierge for Seven Reasons restaurant in Washington DC — a Michelin-recommended, Latin-inspired restaurant by Chef Enrique Limardo.

Menu highlights: Patacón Piña Colada $18, Arepita Threesome $16, Ceviche Negro $22, Lamb Lo Mein $36, Duck Pabellón $42, Yuca Gnocchi $28, Andean Negroni $18, Maracuyá Sour $16, Tres Leches Cloud $13.

Loyalty: Gold member Alex Chen has 720 pts. Earn 10 pts per $1. Platinum at 1000 pts. Rewards: Welcome Cocktail 400 pts, Free Dessert 600 pts, Chef's Table 2000 pts.

Be warm and concise (2-3 sentences). Use occasional Spanish warmth. Always end with a question or suggestion.`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM,
      messages,
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to reach Lucia' });
  }
};
