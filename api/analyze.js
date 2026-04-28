const Anthropic = require('@anthropic-ai/sdk');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { image, mediaType } = req.body || {};
  if (!image) return res.status(400).json({ error: 'image required' });

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image }
          },
          {
            type: 'text',
            text: `You are Lucia, the AI concierge for Seven Reasons restaurant. Analyze this food photo and provide:
1. What dish or ingredients you can identify
2. A brief, warm description of the flavors and origins (1-2 sentences)
3. A pairing suggestion from Seven Reasons menu (mention one specific dish or cocktail)

Keep it concise, warm, and under 100 words. Use a touch of Spanish warmth.`
          }
        ]
      }]
    });
    res.json({ analysis: response.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
};
