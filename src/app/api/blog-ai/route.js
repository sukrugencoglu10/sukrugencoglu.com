// app/api/blog-ai/route.js
// Blog sihirbazı için Claude destekli öneri uçları.
// action = 'suggest_titles' | 'suggest_category_tags' | 'suggest_summary'

import { NextResponse } from 'next/server'

const CATEGORIES = ['genel', 'gtm', 'analytics', 'cro', 'otomasyon', 'reklam']

async function callClaude(prompt, maxTokens = 800) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Claude API hatası (${response.status})`)
  }
  const data = await response.json()
  return data.content?.[0]?.text || ''
}

function extractJson(text) {
  if (!text) return null
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenceMatch ? fenceMatch[1] : text
  const firstBrace = raw.search(/[\[{]/)
  if (firstBrace === -1) return null
  const candidate = raw.slice(firstBrace).trim()
  try {
    return JSON.parse(candidate)
  } catch {
    const lastBrace = Math.max(candidate.lastIndexOf(']'), candidate.lastIndexOf('}'))
    if (lastBrace === -1) return null
    try {
      return JSON.parse(candidate.slice(0, lastBrace + 1))
    } catch {
      return null
    }
  }
}

export async function POST(request) {
  try {
    const { action, contentTR } = await request.json()
    if (!action) return NextResponse.json({ error: 'action gerekli' }, { status: 400 })
    if (!contentTR || contentTR.trim().length < 20) {
      return NextResponse.json({ error: 'İçerik çok kısa (en az 20 karakter)' }, { status: 400 })
    }

    const snippet = contentTR.slice(0, 6000)

    if (action === 'suggest_titles') {
      const prompt = `Aşağıdaki Türkçe blog yazısı için tam 2 farklı başlık öner. Her biri kısa (60 karakter altı), net, SEO dostu ve tıklanabilir olsun. Ek açıklama yazma. Sadece JSON dizi döndür: ["Başlık 1","Başlık 2"]

METİN:
"""
${snippet}
"""`
      const text = await callClaude(prompt, 300)
      const parsed = extractJson(text)
      const titles = Array.isArray(parsed) ? parsed.filter(t => typeof t === 'string' && t.trim()).slice(0, 2) : []
      if (titles.length < 2) {
        return NextResponse.json({ error: 'Başlık üretilemedi', raw: text }, { status: 502 })
      }
      return NextResponse.json({ titles })
    }

    if (action === 'suggest_category_tags') {
      const prompt = `Aşağıdaki Türkçe blog yazısını analiz et. Şu iki şeyi üret:
1) Aşağıdaki kategori listesinden en uygun OLANI seç: ${CATEGORIES.join(', ')}
2) 5-8 adet kısa (1-2 kelime) Türkçe etiket üret. Küçük harf, # kullanma.

Sadece JSON döndür, ek yazı yazma:
{"category":"genel","tags":["etiket1","etiket2"]}

METİN:
"""
${snippet}
"""`
      const text = await callClaude(prompt, 400)
      const parsed = extractJson(text)
      if (!parsed || typeof parsed !== 'object') {
        return NextResponse.json({ error: 'Öneri üretilemedi', raw: text }, { status: 502 })
      }
      const category = CATEGORIES.includes(parsed.category) ? parsed.category : 'genel'
      const tags = Array.isArray(parsed.tags)
        ? parsed.tags.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim().toLowerCase()).slice(0, 8)
        : []
      return NextResponse.json({ category, tags })
    }

    if (action === 'suggest_summary') {
      const prompt = `Aşağıdaki Türkçe blog yazısı için 1-2 cümlelik kısa bir özet yaz (max 220 karakter). Kart görünümünde gösterilecek. Sadece düz metin döndür, tırnak ya da başlık ekleme.

METİN:
"""
${snippet}
"""`
      const text = await callClaude(prompt, 250)
      const summary = text.trim().replace(/^["']|["']$/g, '').slice(0, 280)
      if (!summary) return NextResponse.json({ error: 'Özet üretilemedi' }, { status: 502 })
      return NextResponse.json({ summary })
    }

    return NextResponse.json({ error: 'Bilinmeyen action' }, { status: 400 })
  } catch (err) {
    console.error('blog-ai hatası:', err)
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 })
  }
}
