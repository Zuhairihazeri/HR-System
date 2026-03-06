import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/") && nextUrl.pathname !== "/login"
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false 
      } else if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/", nextUrl))
      }
      return true
    },
  },
  providers: [], // Add empty providers array as it's required
} satisfies NextAuthConfig
