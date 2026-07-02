// app/api/broken-links/route.js
// Bir sayfanın HTML'ini çekip içindeki <a href> linklerini toplar ve her birini
// kontrol ederek kırık (4xx/5xx) ve erişilemeyen (timeout/ağ hatası) linkleri raporlar.

import { NextResponse } from 'next/server'

const UA = 'Mozilla/5.0 (compatible; StudyoLinkBot/1.0; +https://sukrugencoglu.com)'
const MAX_LINKS = 80
const CONCURRENCY = 8

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

async function fetchHtml(url, timeoutMs = 15000) {
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

async function checkLink(link, timeoutMs = 9000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    let res = await fetch(link, { method: 'HEAD', headers: { 'User-Agent': UA }, redirect: 'follow', signal: ctrl.signal })
    // Bazı sunucular HEAD'i reddeder — GET ile tekrar dene
    if ([403, 405, 501].includes(res.status)) {
      res = await fetch(link, { method: 'GET', headers: { 'User-Agent': UA }, redirect: 'follow', signal: ctrl.signal })
    }
    let state = 'ok'
    if (res.status >= 400) state = 'broken'
    return { status: res.status, state }
  } catch (e) {
    return { status: 0, state: 'error', err: e?.name === 'AbortError' ? 'Zaman aşımı' : 'Erişilemedi' }
  } finally {
    clearTimeout(t)
  }
}

// Basit eşzamanlılık havuzu
async function pool(items, limit, worker) {
  const out = new Array(items.length)
  let i = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++
      out[idx] = await worker(items[idx], idx)
    }
  })
  await Promise.all(runners)
  return out
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
      page = await fetchHtml(url)
    } catch (e) {
      const msg = e?.name === 'AbortError'
        ? 'Site yanıt vermedi (zaman aşımı). Adresi kontrol edin.'
        : 'Siteye erişilemedi. Adres doğru mu, site çevrimiçi mi?'
      return NextResponse.json({ error: msg }, { status: 502 })
    }
    if (!page.ok) {
      return NextResponse.json({ error: `Site ${page.status} döndürdü — sayfa açılamadı.` }, { status: 502 })
    }

    const base = page.finalUrl
    const baseHost = new URL(base).hostname

    // href'leri topla
    const hrefs = [...page.text.matchAll(/<a\b[^>]*\bhref\s*=\s*("([^"]*)"|'([^']*)')/gi)]
      .map((m) => (m[2] ?? m[3] ?? '').trim())

    const seen = new Set()
    const links = []
    for (const href of hrefs) {
      if (!href || /^(mailto:|tel:|javascript:|#|data:)/i.test(href)) continue
      let abs
      try {
        abs = new URL(href, base).toString()
      } catch {
        continue
      }
      if (!/^https?:\/\//i.test(abs)) continue
      const clean = abs.split('#')[0]
      if (seen.has(clean)) continue
      seen.add(clean)
      links.push(clean)
    }

    const truncated = links.length > MAX_LINKS
    const toCheck = links.slice(0, MAX_LINKS)

    const results = await pool(toCheck, CONCURRENCY, async (link) => {
      const r = await checkLink(link)
      let host = ''
      try { host = new URL(link).hostname } catch { /* yoksay */ }
      return {
        url: link,
        status: r.status,
        state: r.state,
        err: r.err || null,
        type: host === baseHost ? 'internal' : 'external',
      }
    })

    // Kırık ve hatalı olanlar üstte
    const rank = { broken: 0, error: 1, ok: 2 }
    results.sort((a, b) => (rank[a.state] - rank[b.state]) || a.url.localeCompare(b.url))

    const summary = {
      total: results.length,
      ok: results.filter((r) => r.state === 'ok').length,
      broken: results.filter((r) => r.state === 'broken').length,
      error: results.filter((r) => r.state === 'error').length,
      foundOnPage: links.length,
      truncated,
    }

    return NextResponse.json({ finalUrl: base, summary, links: results })
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
