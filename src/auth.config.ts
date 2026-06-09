import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = nextUrl.pathname === "/admin/login";

      if (isAdminRoute && !isLoginRoute) {
        if (isLoggedIn) return true;
        return false; // Redirects to sign-in page
      } else if (isLoginRoute && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Configured in auth.ts to keep middleware edge-compatible
} satisfies NextAuthConfig;
