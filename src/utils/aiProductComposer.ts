export type AIProductListing = {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  price: string;
  keywords: string[];
  schema: Record<string, unknown>;
  images: string[];
  bundleId?: string;
  category?: string;
};

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const sections = result.split(',');
      resolve(sections[1] ?? '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const generateProductListingFromFiles = async (
  files: File[],
  signal?: AbortSignal,
): Promise<{ listings: AIProductListing[]; summary: string }> => {
  if (files.length === 0) {
    return { listings: [], summary: 'No images provided' };
  }

  const payload = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      mime: file.type || 'image/jpeg',
      data: await toBase64(file),
    })),
  );

  const response = await fetch('/.netlify/functions/generate-product-listing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images: payload }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to generate AI product listing');
  }

  const data = await response.json();

  return {
    listings: Array.isArray(data.listings) ? data.listings : [],
    summary: data.summary ?? 'AI listing generated successfully.',
  };
};
