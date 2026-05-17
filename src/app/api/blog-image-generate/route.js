// app/api/blog-image-generate/route.js
// Google Gemini Imagen ile kapak görseli üretip Supabase `blog-images` bucket'ına kaydeder.
// GEMINI_API_KEY ve SUPABASE_SERVICE_ROLE_KEY kullanır — istemciye asla gönderilmez.

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const BUCKET = 'blog-images'
const MODEL = 'imagen-4.0-generate-001'
const ALLOWED_RATIOS = ['16:9', '1:1', '9:16', '4:3', '3:4']

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function safeName() {
  return `ai-gen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`
}

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY tanımlı değil' }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const prompt = String(body.prompt || '').trim()
    const aspectRatio = ALLOWED_RATIOS.includes(body.aspectRatio) ? body.aspectRatio : '16:9'

    if (prompt.length < 5) {
      return NextResponse.json({ error: 'Prompt çok kısa (en az 5 karakter)' }, { status: 400 })
    }
    if (prompt.length > 1000) {
      return NextResponse.json({ error: 'Prompt çok uzun (max 1000 karakter)' }, { status: 400 })
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict`
    const gemResp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio,
          personGeneration: 'allow_adult',
        },
      }),
    })

    if (!gemResp.ok) {
      const errText = await gemResp.text().catch(() => '')
      console.error('Gemini Imagen hatası:', gemResp.status, errText)
      return NextResponse.json({ error: 'Görsel üretilemedi' }, { status: 502 })
    }

    const data = await gemResp.json()
    const b64 = data?.predictions?.[0]?.bytesBase64Encoded
    if (!b64) {
      console.error('Gemini Imagen — beklenen yanıt yok:', JSON.stringify(data).slice(0, 500))
      return NextResponse.json({ error: 'Görsel üretilemedi' }, { status: 502 })
    }

    const bytes = Buffer.from(b64, 'base64')
    const supabase = getSupabase()
    const path = safeName()

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: 'image/png', upsert: false })

    if (upErr) {
      console.error('Storage upload hatası:', upErr)
      return NextResponse.json({ error: upErr.message || 'Yükleme başarısız' }, { status: 500 })
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: pub.publicUrl, path })
  } catch (err) {
    console.error('blog-image-generate hatası:', err)
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 })
  }
}
