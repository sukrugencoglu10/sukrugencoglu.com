import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

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
      .from('ana_harita')
      .select('items')
      .eq('id', 1)
      .maybeSingle()

    if (error) {
      console.error('ANA Harita GET Hatası:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || !data.items) {
      return NextResponse.json({ terms: [], connections: [], metadata: {} })
    }

    return NextResponse.json(data.items)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const supabase = getClient()

    const { error } = await supabase
      .from('ana_harita')
      .upsert(
        { id: 1, items: body, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )

    if (error) {
      console.error('ANA Harita POST Hatası:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('ANA Harita Sunucu Hatası:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
