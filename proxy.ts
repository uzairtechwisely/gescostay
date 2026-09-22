import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUBDOMAIN_ROUTES: Record<string, string> = {
  [process.env.NEXT_PUBLIC_LAGOS_HOSTS_SUBDOMAIN ?? "lagos-hosts"]:
    "/lp/lagos/hosts",
  [process.env.NEXT_PUBLIC_LAGOS_TRAVEL_SUBDOMAIN ?? "lagos-travel"]:
    "/lp/lagos/travellers",
};

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const subdomain = host.split(".")[0];
  const destination = SUBDOMAIN_ROUTES[subdomain];

  if (!destination) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = destination;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|lp/).*)",
  ],
};
