import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Mail gönderim geçmişi (tek-satır JSON kalıbı — items: gönderim kayıtları dizisi)
function getClient() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function GET() {
  try {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('mail_gonderim_log')
      .select('items')
      .eq('id', 1)
      .maybeSingle()

    if (error) {
      console.error('Mail Log GET Hatası:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || !data.items) {
      return NextResponse.json([])
    }

    return NextResponse.json(data.items)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Yeni bir gönderim kaydını geçmişin başına ekler.
export async function POST(req) {
  try {
    const kayit = await req.json()
    const supabase = getClient()

    const { data, error: readErr } = await supabase
      .from('mail_gonderim_log')
      .select('items')
      .eq('id', 1)
      .maybeSingle()

    if (readErr) {
      console.error('Mail Log okuma Hatası:', readErr)
      return NextResponse.json({ error: readErr.message }, { status: 500 })
    }

    const mevcut = (data && Array.isArray(data.items)) ? data.items : []
    // Son 200 kayıtla sınırla — sınırsız büyümeyi engelle
    const items = [kayit, ...mevcut].slice(0, 200)

    const { error } = await supabase
      .from('mail_gonderim_log')
      .upsert(
        { id: 1, items, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )

    if (error) {
      console.error('Mail Log POST Hatası:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Mail Log Sunucu Hatası:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
