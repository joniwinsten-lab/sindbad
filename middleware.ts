import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};

export async function middleware(req: NextRequest) {
  const supaToken = req.cookies.get("sb-access-token")?.value;

  // jos ei tokenia → login
  if (!supaToken) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  // jos haluat tarkistaa roolin serverillä, hae profiili täällä
  return NextResponse.next();
}
