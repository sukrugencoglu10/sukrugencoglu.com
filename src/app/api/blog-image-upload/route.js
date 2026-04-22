// app/api/blog-image-upload/route.js
// Supabase Storage `blog-images` bucket'ına multipart upload.
// SUPABASE_SERVICE_ROLE_KEY kullanır — istemciye asla gönderilmez.

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const BUCKET = 'blog-images'
const MAX_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function getClient() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function safeName(name) {
  const dot = name.lastIndexOf('.')
  const base = (dot > 0 ? name.slice(0, dot) : name).toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'img'
  const ext = dot > 0 ? name.slice(dot).toLowerCase().replace(/[^a-z0-9.]/g, '') : ''
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext}`
}

export async function POST(req) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Dosya yok' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Dosya 8MB sınırını aşıyor' }, { status: 400 })
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Desteklenmeyen dosya türü (jpg, png, webp, gif)' }, { status: 400 })
    }

    const supabase = getClient()
    const path = safeName(file.name || 'image')
    const bytes = Buffer.from(await file.arrayBuffer())

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: false })

    if (upErr) {
      console.error('Storage upload hatası:', upErr)
      return NextResponse.json({ error: upErr.message }, { status: 500 })
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: pub.publicUrl, path })
  } catch (err) {
    console.error('blog-image-upload hatası:', err)
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 })
  }
}
