export async function POST(request: Request) {
  let payload: { text?: string; voiceId?: string };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'invalid json' }, { status: 400 });
  }
  const { text, voiceId } = payload;
  if (!text || !voiceId) {
    return Response.json(
      { error: 'missing text or voiceId' },
      { status: 400 }
    );
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'ELEVENLABS_API_KEY not configured on server' },
      { status: 500 }
    );
  }

  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.85,
          style: 0.25,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    return Response.json(
      { error: 'elevenlabs request failed', status: upstream.status, detail },
      { status: 502 }
    );
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
    },
  });
}
