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
      .from('kod_bloklari')
      .select('items')
      .eq('id', 1)
      .maybeSingle() // .single yerine maybeSingle daha güvenlidir

    if (error) {
      console.error('Kod Blokları GET Hatası:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Eğer veri yoksa boş bir yapı dön
    if (!data || !data.items) {
      return NextResponse.json({ terms: [], connections: [], metadata: {} })
    }
    
    return NextResponse.json(data.items)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST — Veriyi kaydeder (Upsert)
export async function POST(req) {
  try {
    const body = await req.json()
    const supabase = getClient()
    
    // items kolonuna tüm objeyi basıyoruz
    const { error } = await supabase
      .from('kod_bloklari')
      .upsert(
        { id: 1, items: body, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )

    if (error) {
      console.error('Kod Blokları POST Hatası:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Kod Blokları Sunucu Hatası:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
