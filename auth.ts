import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import {db} from "./db/db.js"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow OAuth sign-ins
      if (account?.provider === "google" || account?.provider === "github") {
        return "/api/auth/oauth-callback";
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // This event fires after successful OAuth sign-in
      console.log("OAuth sign-in successful:", { user: user.id, provider: account?.provider });
    }
  }
})