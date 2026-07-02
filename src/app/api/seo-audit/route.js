// app/api/seo-audit/route.js
// Bir URL'in HTML'ini sunucudan çekip SEO meta denetimi yapar:
// title/description/viewport/canonical/robots, Open Graph, başlık hiyerarşisi,
// alt'sız görseller, robots.txt & sitemap.xml kontrolü.

import { NextResponse } from 'next/server'

function normalizeUrl(raw) {
  let url = String(raw || '').trim()
  if (!url) return null
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url
  try {
    new URL(url)
    return url
  } catch {
    return null
  }
}

const UA =
  'Mozilla/5.0 (compatible; StudyoSEOBot/1.0; +https://sukrugencoglu.com)'

async function fetchText(url, timeoutMs = 15000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,*/*' },
      redirect: 'follow',
      signal: ctrl.signal,
    })
    const text = await res.text()
    return { ok: res.ok, status: res.status, text, finalUrl: res.url || url }
  } finally {
    clearTimeout(t)
  }
}

// Bir <meta> etiketinin attribute'larını basitçe ayrıştır
function parseAttrs(tag) {
  const attrs = {}
  const re = /([a-zA-Z:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g
  let m
  while ((m = re.exec(tag))) {
    attrs[m[1].toLowerCase()] = (m[3] ?? m[4] ?? '').trim()
  }
  return attrs
}

function extractMeta(html) {
  const meta = {} // name/property -> content
  const re = /<meta\b[^>]*>/gi
  let m
  while ((m = re.exec(html))) {
    const a = parseAttrs(m[0])
    const key = (a.name || a.property || a.itemprop || '').toLowerCase()
    if (key && a.content != null) meta[key] = decode(a.content)
    if (a.charset != null) meta['charset'] = a.charset
  }
  return meta
}

function decode(str = '') {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim()
}

export async function POST(request) {
  try {
    const body = await request.json()
    const url = normalizeUrl(body?.url)
    if (!url) {
      return NextResponse.json({ error: 'Geçerli bir site adresi girin (ör. https://ornek.com)' }, { status: 400 })
    }

    let page
    try {
      page = await fetchText(url)
    } catch (e) {
      const msg = e?.name === 'AbortError'
        ? 'Site yanıt vermedi (zaman aşımı). Adresi kontrol edin.'
        : 'Siteye erişilemedi. Adres doğru mu, site çevrimiçi mi?'
      return NextResponse.json({ error: msg }, { status: 502 })
    }
    if (!page.ok) {
      return NextResponse.json({ error: `Site ${page.status} döndürdü — sayfa açılamadı.` }, { status: 502 })
    }

    const html = page.text
    const head = (html.match(/<head[\s\S]*?<\/head>/i) || [html])[0]
    const meta = extractMeta(head)

    // title
    const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const title = titleMatch ? decode(titleMatch[1]) : ''

    // canonical
    const canonMatch = head.match(/<link\b[^>]*rel\s*=\s*["']canonical["'][^>]*>/i)
    const canonical = canonMatch ? parseAttrs(canonMatch[0]).href || '' : ''

    // html lang
    const langMatch = html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i)
    const lang = langMatch ? langMatch[1] : ''

    // hreflang
    const hreflangCount = (head.match(/rel\s*=\s*["']alternate["'][^>]*hreflang/gi) || []).length

    // başlıklar
    const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => decode(m[1].replace(/<[^>]+>/g, '')))
    const h2Count = (html.match(/<h2\b[^>]*>/gi) || []).length

    // görseller
    const imgs = html.match(/<img\b[^>]*>/gi) || []
    const imgsNoAlt = imgs.filter(t => {
      const a = parseAttrs(t)
      return a.alt == null || a.alt === ''
    }).length

    const desc = meta['description'] || ''
    const isHttps = url.startsWith('https://')

    // ── robots.txt & sitemap.xml ──
    const origin = new URL(url).origin
    const [robotsRes, sitemapRes] = await Promise.allSettled([
      fetchText(`${origin}/robots.txt`, 8000),
      fetchText(`${origin}/sitemap.xml`, 8000),
    ])
    const robotsOk = robotsRes.status === 'fulfilled' && robotsRes.value.ok
    const robotsTxt = robotsOk ? robotsRes.value.text : ''
    const sitemapInRobots = /sitemap\s*:/i.test(robotsTxt)
    const sitemapOk = (sitemapRes.status === 'fulfilled' && sitemapRes.value.ok) || sitemapInRobots

    // ── Denetim sonuçları ──
    const S = (status, label, value, hint) => ({ status, label, value, hint })

    const temel = [
      title
        ? (title.length >= 30 && title.length <= 65
            ? S('ok', 'Sayfa başlığı (title)', `${title} (${title.length} krk)`)
            : S('warn', 'Sayfa başlığı (title)', `${title} (${title.length} krk)`, 'İdeal uzunluk 30–65 karakter.'))
        : S('fail', 'Sayfa başlığı (title)', 'Yok', '<title> etiketi eksik — SEO için kritik.'),
      desc
        ? (desc.length >= 70 && desc.length <= 160
            ? S('ok', 'Meta açıklama', `${desc.length} karakter`)
            : S('warn', 'Meta açıklama', `${desc.length} karakter`, 'İdeal uzunluk 70–160 karakter.'))
        : S('fail', 'Meta açıklama', 'Yok', 'meta description ekleyin — arama sonucu özetini etkiler.'),
      meta['viewport']
        ? S('ok', 'Viewport (mobil)', meta['viewport'])
        : S('fail', 'Viewport (mobil)', 'Yok', 'Mobil uyumluluk için viewport meta etiketi gerekli.'),
      meta['charset']
        ? S('ok', 'Karakter seti', meta['charset'])
        : S('warn', 'Karakter seti', 'Belirtilmemiş', 'charset=UTF-8 önerilir.'),
      lang
        ? S('ok', 'Dil (html lang)', lang)
        : S('warn', 'Dil (html lang)', 'Yok', '<html lang="tr"> ekleyin.'),
      canonical
        ? S('ok', 'Canonical URL', canonical)
        : S('warn', 'Canonical URL', 'Yok', 'Yinelenen içerik için canonical link önerilir.'),
      meta['robots']
        ? (/noindex/i.test(meta['robots'])
            ? S('fail', 'Robots meta', meta['robots'], 'Sayfa "noindex" — arama motorları indekslemez!')
            : S('ok', 'Robots meta', meta['robots']))
        : S('ok', 'Robots meta', 'Varsayılan (index, follow)'),
    ]

    const sosyal = [
      meta['og:title'] ? S('ok', 'og:title', meta['og:title']) : S('warn', 'og:title', 'Yok', 'Sosyal paylaşım başlığı.'),
      meta['og:description'] ? S('ok', 'og:description', `${meta['og:description'].length} krk`) : S('warn', 'og:description', 'Yok'),
      meta['og:image'] ? S('ok', 'og:image', meta['og:image']) : S('fail', 'og:image', 'Yok', 'Paylaşımlarda görsel çıkmaz — og:image ekleyin.'),
      meta['og:url'] ? S('ok', 'og:url', meta['og:url']) : S('warn', 'og:url', 'Yok'),
      meta['twitter:card'] ? S('ok', 'twitter:card', meta['twitter:card']) : S('warn', 'twitter:card', 'Yok', 'Twitter/X paylaşım kartı.'),
    ]

    const yapi = [
      h1s.length === 1
        ? S('ok', 'H1 başlık', `1 adet: "${h1s[0].slice(0, 60)}"`)
        : h1s.length === 0
          ? S('fail', 'H1 başlık', 'Yok', 'Her sayfada tam 1 adet H1 olmalı.')
          : S('warn', 'H1 başlık', `${h1s.length} adet`, 'Birden fazla H1 var — tek H1 önerilir.'),
      h2Count > 0
        ? S('ok', 'H2 başlıklar', `${h2Count} adet`)
        : S('warn', 'H2 başlıklar', 'Yok', 'İçerik hiyerarşisi için H2 kullanın.'),
      imgsNoAlt === 0
        ? S('ok', 'Görsel alt metni', `${imgs.length} görselin tümü alt metinli`)
        : S('warn', 'Görsel alt metni', `${imgsNoAlt}/${imgs.length} görselde alt yok`, 'Erişilebilirlik ve SEO için alt ekleyin.'),
      hreflangCount > 0
        ? S('ok', 'hreflang', `${hreflangCount} dil bağlantısı`)
        : S('warn', 'hreflang', 'Yok', 'Çok dilli site değilse gerekmez.'),
    ]

    const teknik = [
      isHttps ? S('ok', 'HTTPS', 'Güvenli bağlantı') : S('fail', 'HTTPS', 'Yok', 'Site HTTPS kullanmıyor — SEO ve güven için şart.'),
      robotsOk ? S('ok', 'robots.txt', 'Mevcut') : S('warn', 'robots.txt', 'Bulunamadı', 'Tarama yönergeleri için robots.txt ekleyin.'),
      sitemapOk ? S('ok', 'sitemap.xml', sitemapInRobots ? 'robots.txt içinde tanımlı' : 'Mevcut') : S('warn', 'sitemap.xml', 'Bulunamadı', 'İndeksleme için site haritası ekleyin.'),
    ]

    const groups = [
      { title: 'Temel Meta', checks: temel },
      { title: 'Sosyal Medya (Open Graph)', checks: sosyal },
      { title: 'İçerik Yapısı', checks: yapi },
      { title: 'Teknik', checks: teknik },
    ]

    const all = groups.flatMap(g => g.checks)
    const summary = {
      ok: all.filter(c => c.status === 'ok').length,
      warn: all.filter(c => c.status === 'warn').length,
      fail: all.filter(c => c.status === 'fail').length,
      total: all.length,
    }

    return NextResponse.json({
      finalUrl: page.finalUrl,
      title,
      summary,
      groups,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
