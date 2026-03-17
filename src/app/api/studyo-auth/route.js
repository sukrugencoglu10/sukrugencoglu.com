// app/api/studyo-auth/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { username, password } = await request.json()

  const validUser = process.env.STUDYO_USER
  const validPass = process.env.STUDYO_PASS

  if (!validUser || !validPass) {
    return NextResponse.json({ ok: false, error: 'Sunucu yapılandırması eksik' }, { status: 500 })
  }

  if (username === validUser && password === validPass) {
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: false, error: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 })
}
