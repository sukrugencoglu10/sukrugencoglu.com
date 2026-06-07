import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// {ad}, {firma}, {sektor}, {email} tokenlarını alıcı bilgileriyle değiştirir.
function kisisellestir(metin, alici) {
  if (!metin) return ''
  return metin
    .replace(/\{ad\}/g, alici.ad || '')
    .replace(/\{firma\}/g, alici.firma || '')
    .replace(/\{sektor\}/g, alici.sektor || '')
    .replace(/\{email\}/g, alici.email || '')
}

const bekle = (ms) => new Promise((r) => setTimeout(r, ms))

export async function POST(req) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Sunucu yapılandırma hatası: RESEND_API_KEY eksik. .env.local / Vercel ayarlarını kontrol edin.' },
        { status: 500 }
      )
    }

    const { from, konu, htmlGovde, duzMetin, alicilar } = await req.json()

    if (!konu || !htmlGovde) {
      return NextResponse.json({ error: 'Konu ve mail gövdesi zorunludur.' }, { status: 400 })
    }
    if (!Array.isArray(alicilar) || alicilar.length === 0) {
      return NextResponse.json({ error: 'En az bir alıcı gerekli.' }, { status: 400 })
    }

    const gonderici = from || process.env.MAIL_FROM || 'Şükrü Gençoğlu <bilgi@sukrugencoglu.com>'
    const resend = new Resend(process.env.RESEND_API_KEY)

    const sonuclar = []
    for (let i = 0; i < alicilar.length; i++) {
      const alici = alicilar[i]
      const email = (alici?.email || '').trim()

      if (!emailRegex.test(email)) {
        sonuclar.push({ email, ok: false, hata: 'Geçersiz e-posta adresi' })
        continue
      }

      try {
        const { data, error } = await resend.emails.send({
          from: gonderici,
          to: [email],
          subject: kisisellestir(konu, alici),
          html: kisisellestir(htmlGovde, alici),
          ...(duzMetin ? { text: kisisellestir(duzMetin, alici) } : {}),
        })

        if (error) {
          sonuclar.push({ email, ok: false, hata: error.message || 'Resend hatası' })
        } else {
          sonuclar.push({ email, ok: true, id: data?.id })
        }
      } catch (err) {
        sonuclar.push({ email, ok: false, hata: err?.message || 'Beklenmeyen hata' })
      }

      // Rate limit (~2 istek/sn) için gönderimler arası gecikme — son alıcıdan sonra bekleme
      if (i < alicilar.length - 1) await bekle(600)
    }

    const basarili = sonuclar.filter((s) => s.ok).length
    const basarisiz = sonuclar.length - basarili

    return NextResponse.json({
      ok: true,
      toplam: sonuclar.length,
      basarili,
      basarisiz,
      sonuclar,
    })
  } catch (error) {
    console.error('studyo-mail-gonder beklenmeyen hata:', error)
    return NextResponse.json(
      { error: error?.message || 'Beklenmeyen bir sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}
