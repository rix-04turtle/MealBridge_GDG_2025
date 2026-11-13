const prompt = "Analyze this image of food. Return only valid JSON with exactly these keys: foodName (a short descriptive name), description (a brief description suitable for a food donation listing), and isEatable (a boolean that is true only when the food appears safe to eat).";

function parseModelResponse(text) {
  const cleanedText = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');

  return JSON.parse(cleanedText);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageData, mimeType } = req.body || {};
  if (!imageData || !mimeType || !mimeType.startsWith('image/')) {
    return res.status(400).json({ error: 'A valid image is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API is not configured on the server' });
  }

  try {
    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: imageData } },
        ],
      }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    };
    const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let result;
    let lastProviderMessage = '';

    for (const model of models) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );
      result = await response.json();
      if (response.ok) {
        break;
      }

      lastProviderMessage = result.error?.message || `Request failed with status ${response.status}`;
      console.error(`Gemini API error (${model}):`, lastProviderMessage);
    }

    if (!result || result.error) {
      return res.status(502).json({ error: lastProviderMessage || 'Gemini image analysis failed' });
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: 'Gemini returned no analysis' });
    }

    const analysis = parseModelResponse(text);
    if (
      typeof analysis.foodName !== 'string' ||
      typeof analysis.description !== 'string' ||
      typeof analysis.isEatable !== 'boolean'
    ) {
      return res.status(502).json({ error: 'Gemini returned an invalid analysis' });
    }

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Gemini image analysis error:', error);
    return res.status(502).json({ error: 'Gemini image analysis failed' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
