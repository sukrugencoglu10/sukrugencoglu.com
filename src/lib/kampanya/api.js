// Claude API çağrısı + defansif JSON parser
// Kampanya Stüdyosu için ortak helper

export async function callClaude(prompt) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `API hatası (${res.status})`)
  }
  const data = await res.json()
  return data.text || ''
}

// Claude bazen markdown code fence ekleyebilir veya cümle önekleri verebilir
// İlk { ve son } arasını alıp JSON.parse dener
export function parseJsonLoose(text) {
  if (!text) throw new Error('Boş yanıt')
  const ilk = text.indexOf('{')
  const son = text.lastIndexOf('}')
  if (ilk === -1 || son === -1 || son <= ilk) {
    throw new Error('JSON bulunamadı')
  }
  const json = text.slice(ilk, son + 1)
  return JSON.parse(json)
}

// Tam akış: prompt gönder → JSON parse et
export async function callClaudeJson(prompt) {
  const text = await callClaude(prompt)
  return parseJsonLoose(text)
}
