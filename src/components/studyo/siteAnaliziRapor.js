// components/studyo/siteAnaliziRapor.js
// Site Analizi sonuçlarından (Hız / SEO / Kırık Linkler / AI Öneriler) yazdırılabilir
// bir HTML rapor üretir ve yeni sekmede açar. Kullanıcı tarayıcıdan "PDF olarak kaydet" yapar.

const ACCENT = '#12b347'
const ORANGE = '#ff6b00'
const RED = '#e5484d'

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function scoreColor(s) {
  if (s == null) return '#999'
  if (s >= 90) return ACCENT
  if (s >= 50) return ORANGE
  return RED
}

const STATUS_COLOR = { ok: ACCENT, warn: ORANGE, fail: RED }
const STATUS_ICON = { ok: '✓', warn: '!', fail: '✕' }

// Basit markdown → HTML (başlık, madde, kalın, kod)
function mdToHtml(md) {
  const inline = (s) => esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
  const lines = String(md || '').split('\n')
  let html = ''
  let inList = false
  const closeList = () => { if (inList) { html += '</ul>'; inList = false } }
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (/^#{1,6}\s/.test(line)) {
      closeList()
      const level = line.match(/^#+/)[0].length
      const tag = level <= 1 ? 'h3' : level === 2 ? 'h3' : 'h4'
      html += `<${tag}>${inline(line.replace(/^#+\s/, ''))}</${tag}>`
    } else if (/^[-*]\s/.test(line)) {
      if (!inList) { html += '<ul>'; inList = true }
      html += `<li>${inline(line.replace(/^[-*]\s/, ''))}</li>`
    } else if (line === '') {
      closeList()
    } else {
      closeList()
      html += `<p>${inline(line)}</p>`
    }
  }
  closeList()
  return html
}

function hizSection(hiz) {
  if (!hiz) return ''
  const labels = { performance: 'Performans', seo: 'SEO', accessibility: 'Erişilebilirlik', 'best-practices': 'En İyi Uyg.' }
  const order = ['performance', 'accessibility', 'best-practices', 'seo']
  const scores = order.map((k) => {
    const v = hiz.scores?.[k]
    return `<div class="ring"><div class="ring-num" style="color:${scoreColor(v)}">${v == null ? '—' : v}</div><div class="ring-lbl">${labels[k]}</div></div>`
  }).join('')
  const metrics = (hiz.metrics || []).map((m) =>
    `<tr><td>${esc(m.label)}</td><td class="r">${esc(m.displayValue)}</td></tr>`).join('')
  const opps = (hiz.opportunities || []).slice(0, 8).map((o) =>
    `<tr><td>${esc(o.title)}</td><td class="r">${esc(o.displayValue || '')}</td></tr>`).join('')
  return `
    <section>
      <h2>⚡ Hız (PageSpeed / Lighthouse)</h2>
      <div class="sub">${esc(hiz.strategy === 'desktop' ? 'Masaüstü' : 'Mobil')}</div>
      <div class="rings">${scores}</div>
      ${metrics ? `<h4>Core Web Vitals</h4><table>${metrics}</table>` : ''}
      ${opps ? `<h4>İyileştirme Fırsatları</h4><table>${opps}</table>` : ''}
    </section>`
}

function seoSection(seo) {
  if (!seo) return ''
  const s = seo.summary || {}
  const groups = (seo.groups || []).map((g) => {
    const rows = g.checks.map((c) =>
      `<tr><td><span class="dot" style="background:${STATUS_COLOR[c.status]}">${STATUS_ICON[c.status]}</span> ${esc(c.label)}</td><td class="r">${esc(c.value)}</td></tr>`).join('')
    return `<h4>${esc(g.title)}</h4><table>${rows}</table>`
  }).join('')
  return `
    <section>
      <h2>🔎 SEO Meta Denetimi</h2>
      <div class="sub">Geçti: <b style="color:${ACCENT}">${s.ok ?? 0}</b> · Uyarı: <b style="color:${ORANGE}">${s.warn ?? 0}</b> · Sorun: <b style="color:${RED}">${s.fail ?? 0}</b></div>
      ${groups}
    </section>`
}

function linklerSection(linkler) {
  if (!linkler) return ''
  const s = linkler.summary || {}
  const bad = (linkler.links || []).filter((l) => l.state !== 'ok')
  const rows = bad.map((l) =>
    `<tr><td class="badge" style="color:${l.state === 'broken' ? RED : ORANGE}">${esc(l.status || l.err || 'hata')}</td><td>${esc(l.url)}</td></tr>`).join('')
  return `
    <section>
      <h2>🔗 Kırık Linkler</h2>
      <div class="sub">Toplam: <b>${s.total ?? 0}</b> · Sağlam: <b style="color:${ACCENT}">${s.ok ?? 0}</b> · Kırık: <b style="color:${RED}">${s.broken ?? 0}</b> · Erişilemedi: <b style="color:${ORANGE}">${s.error ?? 0}</b></div>
      ${bad.length ? `<h4>Sorunlu Linkler</h4><table>${rows}</table>` : '<p class="ok-note">✓ Kırık veya erişilemeyen link bulunamadı.</p>'}
    </section>`
}

function aiSection(ai) {
  if (!ai) return ''
  return `
    <section>
      <h2>🤖 AI Öneriler</h2>
      <div class="ai">${mdToHtml(ai)}</div>
    </section>`
}

export function openReport(url, results) {
  const { hiz, seo, linkler, ai } = results || {}
  const date = new Date().toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })
  const finalUrl = hiz?.finalUrl || seo?.finalUrl || linkler?.finalUrl || url || ''

  const body = [hizSection(hiz), seoSection(seo), linklerSection(linkler), aiSection(ai)].join('')

  const html = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8">
<title>Site Analiz Raporu — ${esc(finalUrl)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 32px 28px; line-height: 1.5; }
  header { border-bottom: 3px solid ${ACCENT}; padding-bottom: 16px; margin-bottom: 24px; }
  header h1 { font-size: 22px; margin: 0 0 6px; }
  header .url { font-size: 14px; color: #555; word-break: break-all; }
  header .date { font-size: 12px; color: #999; margin-top: 4px; }
  section { margin-bottom: 28px; page-break-inside: avoid; }
  h2 { font-size: 17px; margin: 0 0 4px; }
  .sub { font-size: 13px; color: #666; margin-bottom: 12px; }
  h4 { font-size: 13px; margin: 16px 0 6px; color: #333; }
  table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  td { padding: 6px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
  td.r { text-align: right; color: #555; white-space: nowrap; }
  .badge { font-weight: 700; white-space: nowrap; }
  .rings { display: flex; gap: 22px; margin: 12px 0; }
  .ring { text-align: center; }
  .ring-num { font-size: 28px; font-weight: 700; }
  .ring-lbl { font-size: 11px; color: #666; }
  .dot { display: inline-block; width: 15px; height: 15px; border-radius: 50%; color: #fff; font-size: 10px; font-weight: 700; text-align: center; line-height: 15px; }
  .ok-note { color: ${ACCENT}; font-size: 13px; }
  .ai h3 { font-size: 15px; margin: 16px 0 6px; }
  .ai h4 { font-size: 13px; }
  .ai ul { margin: 0 0 10px; padding-left: 20px; }
  .ai li { margin-bottom: 4px; font-size: 13px; }
  .ai p { font-size: 13px; margin: 0 0 8px; }
  code { background: #f3f3f3; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
  .toolbar { position: sticky; top: 0; background: #fff; padding: 10px 0 16px; text-align: right; }
  .toolbar button { background: ${ACCENT}; color: #fff; border: none; padding: 9px 18px; border-radius: 8px; font-size: 14px; cursor: pointer; }
  .empty { color: #999; font-size: 14px; }
  @media print { .toolbar { display: none; } body { padding: 0; } @page { margin: 16mm; } }
</style></head>
<body>
  <div class="toolbar"><button onclick="window.print()">🖨️ Yazdır / PDF olarak kaydet</button></div>
  <header>
    <h1>⚡ Site Analiz Raporu</h1>
    <div class="url">${esc(finalUrl)}</div>
    <div class="date">${esc(date)}</div>
  </header>
  ${body || '<p class="empty">Rapora dahil edilecek analiz sonucu yok. Önce Hız, SEO veya Kırık Linkler analizlerinden birini çalıştırın.</p>'}
</body></html>`

  const w = window.open('', '_blank')
  if (!w) { alert('Açılır pencere engellendi. Tarayıcıdan bu site için pop-up izni verin.'); return }
  w.document.open()
  w.document.write(html)
  w.document.close()
  w.focus()
}
