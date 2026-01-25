import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const [rows]: any = await db.query(
          "SELECT id, username, password FROM admins WHERE username = ?",
          [credentials.username]
        );

        if (rows.length === 0) return null;

        const admin = rows[0];

        const isValid = await bcrypt.compare(
          credentials.password,
          admin.password
        );

        if (!isValid) return null;

        return {
          id: admin.id.toString(), // ✅ แปลงเป็น string ตั้งแต่ตรงนี้
          username: admin.username,
        };
      },
    }),
  ],

  /* ===============================
     SESSION (11 ชั่วโมง)
     =============================== */
  session: {
    strategy: "jwt",
    maxAge: 11 * 60 * 60, // ✅ 11 ชั่วโมง
  },

  jwt: {
    maxAge: 11 * 60 * 60, // ✅ 11 ชั่วโมง
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: undefined, // ⭐ session cookie → ปิด browser = logout
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // string
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; // ✅ ถูก type
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
