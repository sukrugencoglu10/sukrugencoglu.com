import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const validLangs = ["tr", "en"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Zaten geçerli bir dil prefix'i varsa geç
  const hasValidLang = validLangs.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  if (hasValidLang) return NextResponse.next();

  // Kök path → /tr
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/tr", request.url));
  }

  // Diğer path'ler → /tr/{path}
  return NextResponse.redirect(new URL(`/tr${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
