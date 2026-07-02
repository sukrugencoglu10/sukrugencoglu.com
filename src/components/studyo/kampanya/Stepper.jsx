'use client'

// Yatay adım göstergesi — 8 adıma kadar genişleyebilir
// adimlar: [{ no, label }]
// aktif: aktif adım no
// tamamlanan: tamamlanmış adım no'larının array'i (geri tıklanabilir)
export default function Stepper({ adimlar, aktif, tamamlanan = [], onAdimTik }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        marginBottom: '1.5rem',
        overflowX: 'auto',
        paddingBottom: 6,
      }}
    >
      {adimlar.map((adim, i) => {
        const isAktif = adim.no === aktif
        const isTamamlanan = tamamlanan.includes(adim.no)
        const isClickable = isTamamlanan && onAdimTik

        return (
          <div key={adim.no} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={isClickable ? () => onAdimTik(adim.no) : undefined}
              disabled={!isClickable && !isAktif}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 20,
                border: '0.5px solid',
                borderColor: isAktif ? '#111' : isTamamlanan ? '#1D9E75' : '#e0e0e0',
                background: isAktif ? '#111' : isTamamlanan ? '#E1F5EE' : 'transparent',
                color: isAktif ? '#fff' : isTamamlanan ? '#0F6E56' : '#999',
                fontSize: 12,
                fontFamily: 'inherit',
                cursor: isClickable ? 'pointer' : isAktif ? 'default' : 'not-allowed',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: isAktif ? '#fff' : isTamamlanan ? '#1D9E75' : '#e0e0e0',
                  color: isAktif ? '#111' : '#fff',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {isTamamlanan ? '✓' : adim.no}
              </span>
              {adim.label}
            </button>
            {i < adimlar.length - 1 && (
              <span style={{ color: '#ccc', fontSize: 11, padding: '0 4px' }}>›</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
