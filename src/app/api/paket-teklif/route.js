import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing')
      return NextResponse.json(
        { error: 'Sunucu yapılandırma hatası: API Anahtarı eksik.' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const {
      paketSlug,
      paketTitle,
      name,
      email,
      phone,
      company,
      note,
      addons = [],
      pricing = null,
    } = body

    if (!name || !email || !paketSlug) {
      return NextResponse.json(
        { error: 'Ad, e-posta ve paket bilgisi zorunludur.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin.' },
        { status: 400 }
      )
    }

    const fmt = (p) =>
      p && p.amount
        ? `${Number(p.amount).toLocaleString('tr-TR')} ${p.currency || 'TRY'}${p.label ? ' — ' + p.label : ''}`
        : ''

    const lines = [
      `📦 Paket Teklif Talebi`,
      ``,
      `Paket: ${paketTitle || paketSlug}`,
      `Slug: ${paketSlug}`,
      ``,
      `--- Müşteri ---`,
      `Ad: ${name}`,
      `E-posta: ${email}`,
      phone ? `Telefon: ${phone}` : null,
      company ? `Şirket: ${company}` : null,
      ``,
      pricing?.setup ? `Kurulum: ${fmt(pricing.setup)}` : null,
      pricing?.monthly ? `Aylık Bakım: ${fmt(pricing.monthly)}` : null,
      ``,
      addons.length > 0 ? `--- Seçili Add-on'lar ---` : null,
      ...addons.map(
        (a) =>
          `• ${a.title}${a.price ? ` — ${Number(a.price).toLocaleString('tr-TR')} TRY` : ''}${a.recurrence === 'monthly' ? ' /ay' : ''}`
      ),
      ``,
      note ? `--- Not ---` : null,
      note || null,
    ].filter((l) => l !== null)

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: 'Paket Teklif <onboarding@resend.dev>',
      to: ['sukrugencoglu10@gmail.com'],
      subject: `Yeni Paket Teklifi: ${paketTitle || paketSlug} — ${name}`,
      text: lines.join('\n'),
      replyTo: email,
    })

    if (error) {
      console.error('Resend hatası:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    console.error('paket-teklif sunucu hatası:', err)
    return NextResponse.json(
      { error: err?.message || 'Beklenmeyen sunucu hatası.' },
      { status: 500 }
    )
  }
}
