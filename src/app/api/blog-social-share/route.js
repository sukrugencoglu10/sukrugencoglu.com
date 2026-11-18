import crypto from 'crypto'
import { NextResponse } from 'next/server'

// RFC 3986 percent-encoding for OAuth 1.0a
function rfc3986Encode(str) {
  return encodeURIComponent(String(str)).replace(/[!'()*]/g, (c) =>
    '%' + c.charCodeAt(0).toString(16).toUpperCase()
  )
}

// OAuth 1.0a Authorization Header generator for X (Twitter) API v2
function buildXAuthHeader({ method, url, apiKey, apiSecret, accessToken, accessSecret }) {
  const oauthParams = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  }

  const paramString = Object.keys(oauthParams)
    .sort()
    .map((k) => `${rfc3986Encode(k)}=${rfc3986Encode(oauthParams[k])}`)
    .join('&')

  const baseString = [
    method.toUpperCase(),
    rfc3986Encode(url),
    rfc3986Encode(paramString),
  ].join('&')

  const signingKey = `${rfc3986Encode(apiSecret)}&${rfc3986Encode(accessSecret)}`
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64')

  const headerParams = { ...oauthParams, oauth_signature: signature }
  const headerString = Object.keys(headerParams)
    .sort()
    .map((k) => `${rfc3986Encode(k)}="${rfc3986Encode(headerParams[k])}"`)
    .join(', ')

  return `OAuth ${headerString}`
}

async function postToX(text) {
  const apiKey = process.env.X_API_KEY
  const apiSecret = process.env.X_API_SECRET
  const accessToken = process.env.X_ACCESS_TOKEN
  const accessSecret = process.env.X_ACCESS_SECRET

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return { skipped: true, reason: 'X API anahtarları (.env) tanımlı değil' }
  }

  const endpoint = 'https://api.twitter.com/2/tweets'
  const authHeader = buildXAuthHeader({
    method: 'POST',
    url: endpoint,
    apiKey,
    apiSecret,
    accessToken,
    accessSecret,
  })

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.detail || data.title || `X API hatası (${res.status})`)
  }
  return { ok: true, id: data.data?.id }
}

async function resolveLinkedInAuthorUrn(accessToken) {
  if (process.env.LINKEDIN_PERSON_URN) {
    const raw = process.env.LINKEDIN_PERSON_URN.trim()
    return raw.startsWith('urn:li:') ? raw : `urn:li:person:${raw}`
  }

  // OpenID Connect /v2/userinfo üzerinden otomatik URN çek
  const infoRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (infoRes.ok) {
    const info = await infoRes.json()
    if (info?.sub) return `urn:li:person:${info.sub}`
  }

  // Fallback: /v2/me
  const meRes = await fetch('https://api.linkedin.com/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (meRes.ok) {
    const me = await meRes.json()
    if (me?.id) return `urn:li:person:${me.id}`
  }

  throw new Error('LinkedIn kullanıcı URN bulunamadı. LINKEDIN_PERSON_URN tanımlayın.')
}

async function postToLinkedIn({ text, url, title, summary }) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN
  if (!accessToken) {
    return { skipped: true, reason: 'LINKEDIN_ACCESS_TOKEN (.env) tanımlı değil' }
  }

  const author = await resolveLinkedInAuthorUrn(accessToken)

  const payload = {
    author,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: url ? 'ARTICLE' : 'NONE',
        ...(url
          ? {
              media: [
                {
                  status: 'READY',
                  originalUrl: url,
                  ...(title ? { title: { text: title } } : {}),
                  ...(summary ? { description: { text: summary } } : {}),
                },
              ],
            }
          : {}),
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  }

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `LinkedIn API hatası (${res.status})`)
  }
  return { ok: true, id: data.id }
}

const DEFAULT_MAKE_WEBHOOK = 'https://hook.eu1.make.com/d1ws7384dmljqz62bwic2idrmiyus5yq'

async function postToWebhook(payload) {
  const webhookUrl = process.env.SOCIAL_WEBHOOK_URL || DEFAULT_MAKE_WEBHOOK
  if (!webhookUrl) {
    return { skipped: true }
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error(`Webhook hatası (${res.status})`)
  }
  return { ok: true }
}

export async function GET() {
  const linkedinConfigured = Boolean(process.env.LINKEDIN_ACCESS_TOKEN)
  const xConfigured = Boolean(
    process.env.X_API_KEY &&
      process.env.X_API_SECRET &&
      process.env.X_ACCESS_TOKEN &&
      process.env.X_ACCESS_SECRET
  )
  const webhookConfigured = Boolean(process.env.SOCIAL_WEBHOOK_URL || DEFAULT_MAKE_WEBHOOK)

  return NextResponse.json({
    linkedinConfigured,
    xConfigured,
    webhookConfigured,
    anyConfigured: linkedinConfigured || xConfigured || webhookConfigured,
  })
}

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      title = '',
      summary = '',
      url = '',
      coverImage = '',
      linkedinText = '',
      xText = '',
      tags = [],
      platforms = ['linkedin', 'x'],
    } = body

    const results = {}

    // 1) LinkedIn
    if (platforms.includes('linkedin') && linkedinText.trim()) {
      try {
        results.linkedin = await postToLinkedIn({
          text: linkedinText.trim(),
          url,
          title,
          summary,
        })
      } catch (err) {
        results.linkedin = { ok: false, error: err.message }
      }
    }

    // 2) X (Twitter)
    if (platforms.includes('x') && xText.trim()) {
      try {
        results.x = await postToX(xText.trim())
      } catch (err) {
        results.x = { ok: false, error: err.message }
      }
    }

    // 3) Make.com / Zapier / n8n Webhook
    if (process.env.SOCIAL_WEBHOOK_URL || DEFAULT_MAKE_WEBHOOK) {
      try {
        results.webhook = await postToWebhook({
          title,
          summary,
          url,
          coverImage,
          linkedinText,
          xText,
          tags,
          platforms,
          sharedAt: new Date().toISOString(),
        })
      } catch (err) {
        results.webhook = { ok: false, error: err.message }
      }
    }

    return NextResponse.json({ ok: true, results })
  } catch (err) {
    console.error('blog-social-share hatası:', err)
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 })
  }
}
