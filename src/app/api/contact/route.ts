import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing');
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası: API Anahtarı eksik. Vercel veya .env.local ayarlarınızı kontrol edin.' }, { status: 500 });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Ad, e-posta ve mesaj alanları zorunludur.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
       return NextResponse.json(
        { error: 'Lütfen geçerli bir e-posta adresi girin. (Örn: ornek@mail.com)' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Change this to your verified domain later
      to: ['sukrugencoglu10@gmail.com'],
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email, // Set the reply-to address to the sender's email
    });

    if (error) {
      console.error('Error sending email via Resend:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Unexpected error in /api/contact:', error);
    return NextResponse.json({ 
      error: error?.message || 'Beklenmeyen bir sunucu hatası oluştu. (Internal Server Error)' 
    }, { status: 500 });
  }
}
