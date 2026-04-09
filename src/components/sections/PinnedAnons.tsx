import { createClient } from '@supabase/supabase-js'

interface AnonsItem {
  id: string
  label: string
  text: string
  active: boolean
}

const FALLBACK_TEXT =
  `Modern ticaret dünyasında müşteri alışkanlıklarının kökten değiştiğini ve fiziksel etkileşimin yerini artık tamamen dijital platformların aldığını bizzat gözlemliyorum. İşletmenizin sadece ayakta kalması değil, rekabette öne geçmesi için geleneksel yöntemleri bir kenara bırakıp teknolojiye tam uyum sağlamanız gerektiğine inanıyorum. Benim stratejimde hedef kitleye ulaşmanın yolu, artık sadece "orada olmak" değil, sanal dünyada güçlü ve akıllı bir varlık göstermekten geçiyor.`

export default async function PinnedAnons() {
  let activeText = FALLBACK_TEXT

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('dijital_anons')
      .select('items')
      .eq('id', 1)
      .single()

    const active = (data?.items as AnonsItem[] | null)?.find(i => i.active)
    if (active?.text) activeText = active.text
  } catch {
    // tablo henüz yoksa fallback göster
  }

  return (
    <div className="hidden lg:flex items-start justify-center pt-2">
      {/* Pano zemin */}
      <div
        style={{
          position: 'relative',
          padding: '48px 36px 40px',
          background: 'linear-gradient(145deg, #f3eeff 0%, #ede6fc 100%)',
          borderRadius: 20,
          boxShadow: 'inset 0 2px 12px rgba(168,85,247,0.07), inset 0 -1px 4px rgba(168,85,247,0.04)',
          width: '100%',
          maxWidth: 420,
        }}
      >
        {/* Köşe raptiye detayları — küçük nokta */}
        {[
          { top: 12, left: 12 },
          { top: 12, right: 12 },
          { bottom: 12, left: 12 },
          { bottom: 12, right: 12 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'rgba(168,85,247,0.18)',
              ...pos,
            }}
          />
        ))}

        {/* Asılı not kağıdı */}
        <div
          style={{
            background: '#fff',
            borderRadius: 3,
            padding: '32px 24px 24px',
            transform: 'rotate(-1.4deg)',
            boxShadow:
              '0 6px 24px rgba(0,0,0,0.11), 0 2px 6px rgba(0,0,0,0.07), 0 -1px 0 rgba(0,0,0,0.04)',
            position: 'relative',
          }}
        >
          {/* Raptiye (pin) */}
          <div
            style={{
              position: 'absolute',
              top: -14,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 38% 38%, #c084fc, #a855f7 55%, #7e22ce)',
              boxShadow:
                '0 3px 10px rgba(168,85,247,0.55), 0 1px 3px rgba(0,0,0,0.25)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.35)',
              }}
            />
          </div>

          {/* Başlık */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              marginBottom: 14,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#e879a0',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#e879a0',
                textTransform: 'uppercase',
              }}
            >
              Dijital Anons
            </span>
          </div>

          {/* Ayırıcı çizgi — soluk mor */}
          <div
            style={{
              height: 1,
              background: 'linear-gradient(90deg, #e9d5ff 0%, transparent 100%)',
              marginBottom: 18,
            }}
          />

          {/* Metin */}
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.85,
              color: '#3d2a55',
              fontFamily: 'inherit',
              margin: 0,
            }}
          >
            {activeText}
          </p>

          {/* Alt not — kağıt alt köşe efekti */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '0 0 18px 18px',
              borderColor: 'transparent transparent #f3eeff transparent',
              filter: 'drop-shadow(-1px -1px 1px rgba(0,0,0,0.06))',
            }}
          />
        </div>
      </div>
    </div>
  )
}
