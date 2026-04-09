import { createClient } from '@supabase/supabase-js'

interface AnonsItem {
  id: string
  label: string
  text: string
  active: boolean
}

const FALLBACK_TEXT =
  `Modern ticaret dünyasında müşteri alışkanlıklarının kökten değiştiğini ve fiziksel etkileşimin yerini artık tamamen dijital platformların aldığını bizzat gözlemliyorum. İşletmenizin sadece ayakta kalması değil, rekabette öne geçmesi için geleneksel yöntemleri bir kenara bırakıp teknolojiye tam uyum sağlamanız gerektiğine inanıyorum. Benim stratejimde hedef kitleye ulaşmanın yolu, artık sadece "orada olmak" değil, sanal dünyada güçlü ve akıllı bir varlık göstermekten geçiyor. Yeni tüketiciler kazanmanız ve pazar payınızı artırmanız için dijitalleşme stratejilerini bir an önce iş süreçlerinize entegre etmenizi sağlıyorum. Özetle; ticaretin geleceğinin tamamen internet ekosisteminde olduğunu biliyor ve başarınızı bu dijital dönüşümün hızı ve kalitesi üzerine inşa ediyorum.`

export default async function MarqueeText() {
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
    // Tablo henüz yoksa veya bağlantı hatası → fallback metin göster
  }

  const segment = (
    <span className="inline-flex items-center whitespace-nowrap">
      <span className="mx-8 text-[#e879a0] opacity-50 select-none">{"// >"}</span>
      {activeText}
    </span>
  )

  return (
    <div className="relative w-full bg-white border-y border-[#e879a0]/40 py-[10px] select-none overflow-visible">

      {/* Dijital Anons badge — üst border üzerinde, solda */}
      <div className="absolute left-6 top-0 -translate-y-1/2 z-20 flex items-center">
        <div className="bg-[#e879a0] px-3 py-[3px] rounded-sm flex items-center gap-2 shadow-sm">
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-white animate-pulse" />
          <span className="text-white font-bold text-[0.72rem] tracking-[2px] uppercase whitespace-nowrap">
            Dijital Anons
          </span>
        </div>
      </div>

      {/* Sağ fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-white to-transparent" />

      {/* Kayan metin */}
      <div className="overflow-hidden">
        <div className="marquee-track">
          {segment}
          {segment}
          {segment}
          {segment}
        </div>
      </div>
    </div>
  )
}
