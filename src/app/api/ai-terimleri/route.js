import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getClient() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// GET — Veriyi okur
export async function GET() {
  try {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('ai_terimleri')
      .select('items')
      .eq('id', 1)
      .single()

    if (error || !data) return NextResponse.json([])
    return NextResponse.json(data.items ?? [])
  } catch {
    return NextResponse.json([])
  }
}

// POST — Veriyi kaydeder (Upsert)
export async function POST(req) {
  try {
    const body = await req.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Geçersiz veri formatı' }, { status: 400 })
    }

    const supabase = getClient()
    const { error } = await supabase
      .from('ai_terimleri')
      .upsert({ id: 1, items: body, updated_at: new Date().toISOString() })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
