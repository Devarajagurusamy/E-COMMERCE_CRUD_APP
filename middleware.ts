import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    const pathname = request.nextUrl.pathname;

    if (
        (pathname.startsWith("/cart") ||
            pathname.startsWith("/admin")) &&
        !token
    ) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/cart/:path*",
        "/admin/:path*",
    ],
};