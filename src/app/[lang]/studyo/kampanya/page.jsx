'use client'

// app/[lang]/studyo/kampanya/page.jsx
// Ince wrapper — auth gate'i kontrol edip KampanyaStudyosu component'ini render eder.
// Aynı component sidebar'dan da erişilebilir (TOOLS array'i içinde).

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import KampanyaStudyosu from '@/components/studyo/kampanya/KampanyaStudyosu'

export default function KampanyaStudyosuPage() {
  const router = useRouter()
  const params = useParams()
  const lang = params?.lang || 'tr'

  const [authed, setAuthed] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('studyo_auth') === '1') {
      setAuthed(true)
    } else {
      router.replace(`/${lang}/studyo`)
    }
    setAuthChecked(true)
  }, [router, lang])

  if (!authChecked || !authed) {
    return (
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '4rem 1rem', textAlign: 'center', color: '#888', fontSize: 13 }}>
        Yönlendiriliyor...
      </div>
    )
  }

  return <KampanyaStudyosu />
}
