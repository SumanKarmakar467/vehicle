import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import connectDb from "./lib/db";
import User from "./models/user.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "*****",
        },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and Password are required");
          }

          await connectDb();

          const user = await User.findOne({
            email: credentials.email,
          });

          if (!user) {
            throw new Error("User does not exist");
          }

          // Email verification check
          if (!user.isEmailVerified) {
            throw new Error("Please verify your email first");
          }

          // Google account check
          if (!user.password) {
            throw new Error(
              "This account uses Google Sign In"
            );
          }

          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isMatch) {
            throw new Error("Incorrect Password");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error: any) {
          console.log("AUTH ERROR:", error.message);
          throw new Error(error.message);
        }
      },
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          await connectDb();

          let dbUser = await User.findOne({
            email: user.email,
          });

          if (!dbUser) {
            dbUser = await User.create({
              name: user.name,
              email: user.email,
              role: "user",
              isEmailVerified: true,
            });
          }

          user.id = dbUser._id.toString();
          user.role = dbUser.role;
        }

        return true;
      } catch (error) {
        console.log("SIGNIN CALLBACK ERROR:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/signIn",
    error: "/signIn",
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60,
  },

  secret: process.env.AUTH_SECRET,
});