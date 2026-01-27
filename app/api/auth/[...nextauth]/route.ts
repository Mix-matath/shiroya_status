import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        /* 1️⃣ หา user */
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) return null;

        /* 2️⃣ ตรวจ password */
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        /* 3️⃣ return user (id ต้องเป็น string) */
        return {
          id: user.id,
          username: user.username,
        };
      },
    }),
  ],

  /* ===============================
     SESSION / JWT
     =============================== */
  session: {
    strategy: "jwt",
    maxAge: 11 * 60 * 60, // 11 ชั่วโมง
  },

  jwt: {
    maxAge: 11 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
