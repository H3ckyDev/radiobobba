import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      dateOfBirth: string | null;     // ISO string
      habboNickname: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    dateOfBirth: string | null;
    habboNickname: string | null;
  }
}