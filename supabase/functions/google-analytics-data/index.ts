import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AnalyticsDataRequest {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  metrics?: string[];
  dimensions?: string[];
}

// Google Analytics Property ID
const GA_PROPERTY_ID = "513397787";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    // Get parameters from query string
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate') || '30daysAgo';
    const endDate = url.searchParams.get('endDate') || 'yesterday';
    const metricsParam = url.searchParams.get('metrics');
    const dimensionsParam = url.searchParams.get('dimensions');

    // Parse metrics and dimensions
    let metrics = ['activeUsers', 'screenPageViews', 'sessions'];
    let dimensions = ['date'];

    if (metricsParam) {
      metrics = metricsParam.split(',').map(m => m.trim());
    }

    if (dimensionsParam) {
      dimensions = dimensionsParam.split(',').map(d => d.trim());
    }

    // Get Google Analytics credentials from environment
    const GA_SERVICE_ACCOUNT_KEY = Deno.env.get("GA_SERVICE_ACCOUNT_KEY");
    if (!GA_SERVICE_ACCOUNT_KEY) {
      throw new Error("GA_SERVICE_ACCOUNT_KEY environment variable is not set");
    }

    let credentials;
    try {
      credentials = JSON.parse(GA_SERVICE_ACCOUNT_KEY);
    } catch (e) {
      throw new Error("GA_SERVICE_ACCOUNT_KEY is not valid JSON");
    }

    // Get access token from Google OAuth
    const accessToken = await getGoogleAccessToken(credentials);

    // Build GA4 Data API request
    const gaData = await fetchGoogleAnalyticsData(accessToken, {
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      metrics: metrics.map(metric => ({ name: metric })),
      dimensions: dimensions.map(dimension => ({ name: dimension })),
    });

    return new Response(
      JSON.stringify(gaData),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error fetching Google Analytics data:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch analytics data",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function getGoogleAccessToken(credentials: any): Promise<string> {
  const jwt = await createJWT(credentials);
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error(`OAuth token request failed: ${tokenData.error_description}`);
  }

  return tokenData.access_token;
}

async function createJWT(credentials: any): Promise<string> {
  const header = { alg: "RS256" as const, typ: "JWT" };
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: getNumericDate(60 * 60), // 1 hour
    iat: getNumericDate(0),
  };

  // Convert PEM private key to CryptoKey
  const privateKeyPem = credentials.private_key;
  const privateKey = await importPrivateKey(privateKeyPem);

  return await create(header, payload, privateKey);
}

async function importPrivateKey(pemKey: string): Promise<CryptoKey> {
  // Remove header, footer, and newlines
  const pemContents = pemKey
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');

  // Decode base64
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  return await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );
}


async function fetchGoogleAnalyticsData(accessToken: string, requestBody: any): Promise<any> {
  const response = await fetch('https://analyticsdata.googleapis.com/v1beta/properties:batchRunReports', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{
        ...requestBody,
        returnPropertyQuota: true,
      }],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`GA4 API request failed: ${data.error?.message}`);
  }

  return data;
}

serve(handler);
