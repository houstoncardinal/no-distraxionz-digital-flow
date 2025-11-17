import type { Handler } from '@netlify/functions';

const OPENAI_KEY = process.env.OPENAI_API_KEY;

type ImagePayload = {
  filename: string;
  mime: string;
  data: string;
};

type AIListing = {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  price: number;
  keywords: string[];
  schema: Record<string, unknown>;
  images: string[];
  bundleId?: string;
  category?: string;
};

type AIResponseShape = {
  summary: string;
  listings: AIListing[];
};

const fallbackListing = (images: ImagePayload[]): AIListing[] =>
  images.map((image, index) => ({
    title: `Generated product ${index + 1}`,
    slug: `generated-product-${Date.now()}-${index}`,
    metaTitle: `NO DISTRAXIONZ ${image.filename} | Premium Product`,
    metaDescription: `Auto-generated listing for ${image.filename}.`,
    description: `AI offline fallback: describe ${image.filename} and highlight the focus-inspired design.`,
    price: 49.99,
    keywords: ['NO DISTRAXIONZ', 'streetwear', image.filename],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: image.filename,
      brand: 'NO DISTRAXIONZ',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: '49.99',
        availability: 'https://schema.org/InStock',
      },
    },
    images: [`data:${image.mime};base64,${image.data}`],
  }));

const buildPrompt = (images: ImagePayload[], context?: string) => {
  const imageDescriptions = images
    .map((image, index) => `Image ${index + 1}: ${image.filename}`)
    .join('\n');

  return `You are an elite NO DISTRAXIONZ product strategist. Review the uploaded imagery and craft fully branded, SEO-ready listings. Focus on tone, keywords, slug, schema markup, and multi-image bundles. The response must be a valid JSON object with keys 'summary' and 'listings'. Each listing must include title, slug, metaTitle, metaDescription, description, price, keywords (array), schema (object), images (array of image URLs or data URIs), bundleId (optional grouping id), and category. Use the following context: ${context ?? 'streetwear premium drop'}\nImages:\n${imageDescriptions}`;
};

const transformOpenAIResponse = (payload: unknown): AIResponseShape => {
  if (!payload || typeof payload !== 'object') {
    return { listings: [], summary: 'No AI data produced.' };
  }

  const candidate = payload as Partial<AIResponseShape>;
  return {
    summary: candidate.summary ?? 'AI generated product listing',
    listings: Array.isArray(candidate.listings) ? candidate.listings : [],
  };
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!OPENAI_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY is not configured' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { images, context } = body as { images?: ImagePayload[]; context?: string };

    if (!Array.isArray(images) || images.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Images are required' }) };
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        temperature: 0.25,
        max_output_tokens: 800,
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: buildPrompt(images, context) },
              ...images.map((image) => ({
                type: 'input_image',
                image_url: `data:${image.mime};base64,${image.data}`,
                alt_text: image.filename,
              })),
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error', errorText);
      throw new Error('OpenAI response failed');
    }

    const responseData = await response.json();
    const output = responseData.output?.[0]?.content?.find((item: any) => item.type === 'output_text')?.text;
    let parsed: AIResponseShape | null = null;

    if (output) {
      try {
        parsed = JSON.parse(output);
      } catch (err) {
        console.error('Failed to parse AI output', err);
      }
    }

    const payload = parsed ?? {
      summary: 'AI reply could not be parsed, falling back to heuristics.',
      listings: fallbackListing(images),
    };

    return {
      statusCode: 200,
      body: JSON.stringify(payload),
    };
  } catch (error: any) {
    console.error('generate-product-listing error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate product listing',
        details: error?.message ?? 'Unknown',
      }),
    };
  }
};
