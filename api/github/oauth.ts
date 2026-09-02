import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'GitHub OAuth not configured' });
    }

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description || data.error });
    }

    return res.status(200).json({
      token: data.access_token,
      tokenType: data.token_type,
      scope: data.scope,
    });
  } catch (error) {
    console.error('OAuth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
