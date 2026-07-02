// app/api/blog-image-generate/route.js
// Pollinations.ai ile kapak görseli üretip Supabase `blog-images` bucket'ına kaydeder.
// Anahtar gerektirmez — anonim API.

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const BUCKET = 'blog-images'
const ALLOWED_RATIOS = {
  '16:9': { width: 1280, height: 720 },
  '1:1':  { width: 1024, height: 1024 },
  '9:16': { width: 720,  height: 1280 },
  '4:3':  { width: 1024, height: 768 },
  '3:4':  { width: 768,  height: 1024 },
}

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function safeName(ext = 'jpg') {
  return `ai-gen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}))
    const prompt = String(body.prompt || '').trim()
    const ratio = ALLOWED_RATIOS[body.aspectRatio] ? body.aspectRatio : '16:9'
    const { width, height } = ALLOWED_RATIOS[ratio]

    if (prompt.length < 5) {
      return NextResponse.json({ error: 'Prompt çok kısa (en az 5 karakter)' }, { status: 400 })
    }
    if (prompt.length > 1000) {
      return NextResponse.json({ error: 'Prompt çok uzun (max 1000 karakter)' }, { status: 400 })
    }

    const params = new URLSearchParams({
      width: String(width),
      height: String(height),
      model: 'flux',
      nologo: 'true',
      seed: String(Math.floor(Math.random() * 1e9)),
    })
    const endpoint = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`

    const imgResp = await fetch(endpoint, { method: 'GET' })

    if (!imgResp.ok) {
      const errText = await imgResp.text().catch(() => '')
      console.error('Pollinations hatası:', imgResp.status, errText.slice(0, 300))
      return NextResponse.json({ error: 'Görsel üretilemedi' }, { status: 502 })
    }

    const contentType = imgResp.headers.get('content-type') || 'image/jpeg'
    if (!contentType.startsWith('image/')) {
      console.error('Pollinations — image dönmedi, content-type:', contentType)
      return NextResponse.json({ error: 'Görsel üretilemedi' }, { status: 502 })
    }

    const bytes = Buffer.from(await imgResp.arrayBuffer())
    if (bytes.length < 1024) {
      console.error('Pollinations — yanıt çok küçük, byte:', bytes.length)
      return NextResponse.json({ error: 'Görsel üretilemedi' }, { status: 502 })
    }

    const ext = contentType.includes('png') ? 'png' : 'jpg'
    const supabase = getSupabase()
    const path = safeName(ext)

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType, upsert: false })

    if (upErr) {
      console.error('Storage upload hatası:', upErr)
      return NextResponse.json({ error: upErr.message || 'Yükleme başarısız' }, { status: 500 })
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: pub.publicUrl, path })
  } catch (err) {
    console.error('blog-image-generate hatası:', err, 'cause:', err?.cause)
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 })
  }
}
