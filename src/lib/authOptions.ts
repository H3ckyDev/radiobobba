import "@/lib/firebaseAdminInit";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import DiscordProvider from "next-auth/providers/discord";
import type { NextAuthOptions } from "next-auth";

const db = getFirestore();

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  adapter: FirestoreAdapter(),
  session: { strategy: "jwt" },
  events: {
    /** Se dispara justo DESPUÉS de que el adapter creó el user */
    async createUser({ user }) {
      await db.doc(`users/${user.id}`).set(
        {
          dateOfBirth: null,
          habboNickname: null,
        },
        { merge: true }
      );
    },
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const snap = await db.doc(`users/${token.sub}`).get();
      const data = snap.data() ?? {};

      // 🔑  Convierte Timestamp → ISO string
      const dob = data.dateOfBirth;
      token.dateOfBirth =
        dob instanceof Timestamp ? dob.toDate().toISOString() : dob ?? null;

      token.habboNickname = data.habboNickname ?? null;
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub as string;

      // Aquí ya llega como string o null
      session.user.dateOfBirth = token.dateOfBirth as string | null;
      session.user.habboNickname = token.habboNickname ?? null;
      return session;
    },
  },
};
