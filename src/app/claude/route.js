// app/api/claude/route.js
// Bu dosya API key'i güvenli tutar — tarayıcıya asla gönderilmez

import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt gerekli' }, { status: 400 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return NextResponse.json({ error: err.error?.message || 'API hatası' }, { status: response.status })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    return NextResponse.json({ text })
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
