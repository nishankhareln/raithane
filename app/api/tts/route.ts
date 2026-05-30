import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

// Rachel (a warm, clear default voice). Multilingual model handles Nepali/Devanagari reasonably.
const DEFAULT_VOICE = '21m00Tcm4TlvDq8ikWAM'

export async function POST(req: NextRequest) {
  const key = process.env.eleven_labs || process.env.ELEVENLABS_API_KEY
  if (!key) return new Response('Voice not configured', { status: 500 })

  let text = '', voiceId = DEFAULT_VOICE
  try {
    const body = await req.json()
    text = (body.text || '').toString().slice(0, 2500) // cap to protect quota
    if (body.voiceId) voiceId = body.voiceId
  } catch { return new Response('Bad request', { status: 400 }) }
  if (!text.trim()) return new Response('No text', { status: 400 })

  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  })

  if (!r.ok) return new Response(await r.text(), { status: r.status })
  const audio = await r.arrayBuffer()
  return new Response(audio, {
    headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
  })
}
