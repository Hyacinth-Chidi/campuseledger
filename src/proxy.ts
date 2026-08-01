import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type SessionData } from "@/lib/session";

const ROLE_PREFIXES: Partial<Record<NonNullable<SessionData["role"]>, string>> = {
  student: "/student/dashboard",
  institution: "/institution/dashboard",
  admin: "/admin/dashboard",
};

// Next.js 16 renamed middleware.ts -> proxy.ts. Unlike the old Edge-only
// middleware, proxy.ts runs on the Node.js runtime by default, which is
// required here: cookies() from next/headers throws outside a Node.js
// request scope (it doesn't work under the old Edge middleware runtime).
export default async function proxy(req: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  const path = req.nextUrl.pathname;
  const dashboardMatch = Object.entries(ROLE_PREFIXES).find(([, prefix]) =>
    path.startsWith(prefix)
  );

  if (dashboardMatch) {
    const [role] = dashboardMatch;
    if (!session.userId || session.role !== role) {
      const loginUrl = new URL(`/${role}/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/dashboard/:path*",
    "/institution/dashboard/:path*",
    "/admin/dashboard/:path*",
  ],
};
