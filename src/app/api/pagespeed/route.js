// app/api/pagespeed/route.js
// Google PageSpeed Insights (PSI) API çağrısı — API anahtarı tarayıcıya gönderilmez.
// pagespeed.web.dev'in arkasındaki resmi Lighthouse motoru kullanılır.

import { NextResponse } from 'next/server'

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'

// Ekranda göstereceğimiz Core Web Vitals / hız metrikleri
const METRIC_AUDITS = [
  'largest-contentful-paint',
  'cumulative-layout-shift',
  'total-blocking-time',
  'first-contentful-paint',
  'speed-index',
  'interactive',
]

const METRIC_LABELS = {
  'largest-contentful-paint': 'LCP (En Büyük İçerik)',
  'cumulative-layout-shift': 'CLS (Görsel Kayma)',
  'total-blocking-time': 'TBT (Toplam Engelleme)',
  'first-contentful-paint': 'FCP (İlk İçerik)',
  'speed-index': 'Speed Index (Hız Endeksi)',
  'interactive': 'TTI (Etkileşim Süresi)',
}

function normalizeUrl(raw) {
  let url = String(raw || '').trim()
  if (!url) return null
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url
  try {
    // eslint-disable-next-line no-new
    new URL(url)
    return url
  } catch {
    return null
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const url = normalizeUrl(body?.url)
    const strategy = body?.strategy === 'desktop' ? 'desktop' : 'mobile'

    if (!url) {
      return NextResponse.json({ error: 'Geçerli bir site adresi girin (ör. https://ornek.com)' }, { status: 400 })
    }

    const params = new URLSearchParams()
    params.set('url', url)
    params.set('strategy', strategy)
    for (const c of ['performance', 'seo', 'accessibility', 'best-practices']) {
      params.append('category', c)
    }
    // Anahtar opsiyonel — varsa günlük kota artar, yoksa anonim kotayla çalışır.
    // Not: Gemini/AI Studio anahtarları PSI için kullanılamaz (API etkin değil),
    // bu yüzden yalnızca PSI için yetkili bir Google Cloud anahtarı kullanılmalı.
    const apiKey = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_API_KEY
    if (apiKey) {
      params.set('key', apiKey)
    }

    const res = await fetch(`${PSI_ENDPOINT}?${params.toString()}`)

    if (!res.ok) {
      let detail = ''
      try {
        const err = await res.json()
        detail = err?.error?.message || ''
      } catch { /* yoksay */ }

      let message
      if (res.status === 429) {
        message = 'Google PageSpeed günlük kotası doldu. Bir süre sonra tekrar deneyin veya .env.local içine PAGESPEED_API_KEY ekleyin.'
      } else if (res.status === 403) {
        message = 'PageSpeed API erişimi reddedildi. Kullanılan Google anahtarında "PageSpeed Insights API" etkin olmalı.'
      } else if (res.status === 400) {
        message = 'Adres analiz edilemedi — siteye erişilemiyor veya geçersiz. Adresi kontrol edin.'
      } else {
        message = detail || 'PageSpeed analizi başarısız oldu'
      }
      return NextResponse.json({ error: message }, { status: res.status })
    }

    const data = await res.json()
    const lh = data?.lighthouseResult
    if (!lh) {
      return NextResponse.json({ error: 'Analiz sonucu okunamadı' }, { status: 502 })
    }

    const cat = lh.categories || {}
    const score = (c) => (c && typeof c.score === 'number' ? Math.round(c.score * 100) : null)
    const scores = {
      performance: score(cat.performance),
      seo: score(cat.seo),
      accessibility: score(cat.accessibility),
      'best-practices': score(cat['best-practices']),
    }

    const audits = lh.audits || {}
    const metrics = METRIC_AUDITS
      .filter((id) => audits[id])
      .map((id) => ({
        id,
        label: METRIC_LABELS[id] || audits[id].title,
        displayValue: audits[id].displayValue || '—',
        score: audits[id].score,
      }))

    // İyileştirme fırsatları — Lighthouse'un kendi önerileri (en çok kazanç üstte)
    const opportunities = Object.values(audits)
      .filter((a) => a && a.details?.type === 'opportunity' && typeof a.score === 'number' && a.score < 1)
      .map((a) => ({
        id: a.id,
        title: a.title,
        displayValue: a.displayValue || '',
        description: a.description || '',
        savingsMs: a.details?.overallSavingsMs || 0,
      }))
      .sort((a, b) => b.savingsMs - a.savingsMs)

    // Tanılama uyarıları — skoru düşük, fırsat olmayan denetimler
    const diagnostics = Object.values(audits)
      .filter((a) =>
        a && typeof a.score === 'number' && a.score < 0.9 &&
        a.scoreDisplayMode === 'metricSavings' &&
        a.details?.type !== 'opportunity' &&
        !METRIC_AUDITS.includes(a.id)
      )
      .map((a) => ({
        id: a.id,
        title: a.title,
        displayValue: a.displayValue || '',
        description: a.description || '',
      }))

    // Gerçek kullanıcı verisi (CrUX) — varsa
    const fieldData = data?.loadingExperience?.metrics
      ? {
          overall: data.loadingExperience.overall_category || null,
          metrics: data.loadingExperience.metrics,
        }
      : null

    return NextResponse.json({
      finalUrl: lh.finalUrl || url,
      strategy,
      fetchTime: lh.fetchTime || null,
      scores,
      metrics,
      opportunities,
      diagnostics,
      fieldData,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
