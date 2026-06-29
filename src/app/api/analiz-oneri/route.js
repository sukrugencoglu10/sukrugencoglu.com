// app/api/analiz-oneri/route.js
// Site Analizi sonuçlarını (Hız / SEO / Kırık Linkler) alıp Claude ile
// önceliklendirilmiş Türkçe aksiyon planı üretir. API key tarayıcıya gitmez.

import { NextResponse } from 'next/server'

function buildPrompt(url, results) {
  const parts = [`Analiz edilen site: ${url || 'belirtilmemiş'}`]
  const { hiz, seo, linkler } = results || {}

  if (hiz) {
    parts.push('\n## Hız / PageSpeed (Lighthouse)')
    if (hiz.strategy) parts.push(`Cihaz: ${hiz.strategy === 'desktop' ? 'masaüstü' : 'mobil'}`)
    if (hiz.scores) {
      parts.push(`Skorlar (0-100) — Performans: ${hiz.scores.performance}, SEO: ${hiz.scores.seo}, Erişilebilirlik: ${hiz.scores.accessibility}, En İyi Uygulamalar: ${hiz.scores['best-practices']}`)
    }
    if (hiz.metrics?.length) {
      parts.push('Metrikler: ' + hiz.metrics.map((m) => `${m.label}=${m.displayValue}`).join(', '))
    }
    if (hiz.opportunities?.length) {
      parts.push('İyileştirme fırsatları: ' + hiz.opportunities.slice(0, 8).map((o) => `${o.title}${o.displayValue ? ` (${o.displayValue})` : ''}`).join('; '))
    }
  }

  if (seo) {
    parts.push('\n## SEO Meta Denetimi')
    if (seo.summary) parts.push(`Özet — Geçti: ${seo.summary.ok}, Uyarı: ${seo.summary.warn}, Sorun: ${seo.summary.fail}`)
    const problems = (seo.groups || []).flatMap((g) => g.checks).filter((c) => c.status !== 'ok')
    if (problems.length) {
      parts.push('Sorunlu/uyarılı kontroller: ' + problems.map((c) => `${c.label} (${c.value})${c.hint ? ` — ${c.hint}` : ''}`).join('; '))
    }
  }

  if (linkler) {
    parts.push('\n## Kırık Linkler')
    if (linkler.summary) parts.push(`Toplam: ${linkler.summary.total}, Sağlam: ${linkler.summary.ok}, Kırık: ${linkler.summary.broken}, Erişilemedi: ${linkler.summary.error}`)
    const bad = (linkler.links || []).filter((l) => l.state !== 'ok')
    if (bad.length) parts.push('Sorunlu linkler: ' + bad.slice(0, 15).map((l) => `[${l.status || l.err || 'hata'}] ${l.url}`).join('; '))
  }

  return parts.join('\n')
}

const SYSTEM = `Sen kıdemli bir teknik SEO ve web performans danışmanısın. Sana bir web sitesinin analiz verileri verilecek. Bu verilere dayanarak Türkçe, önceliklendirilmiş ve uygulanabilir bir aksiyon planı üret.

Kurallar:
- En kritik ve en yüksek etkili sorunları önce ele al.
- Maddeleri öncelik başlıkları altında grupla: "## Yüksek Öncelik", "## Orta Öncelik", "## Düşük Öncelik".
- Her madde için: ne yapılacağı, neden önemli olduğu (kısa) ve mümkünse nasıl yapılacağı.
- Sadece verideki gerçek sorunlara/zayıf noktalara odaklan; veri yoksa uydurma.
- Markdown kullan (başlıklar + madde işaretleri). Kısa, net ve doğrudan ol; gereksiz girişten kaçın.`

export async function POST(request) {
  try {
    const { url, results } = await request.json()
    const hasAny = results && (results.hiz || results.seo || results.linkler)
    if (!hasAny) {
      return NextResponse.json({ error: 'Önce en az bir analiz çalıştırın (Hız, SEO veya Kırık Linkler).' }, { status: 400 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: SYSTEM,
        messages: [{ role: 'user', content: buildPrompt(url, results) }],
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return NextResponse.json({ error: err.error?.message || 'AI önerisi üretilemedi' }, { status: response.status })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    return NextResponse.json({ text })
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
