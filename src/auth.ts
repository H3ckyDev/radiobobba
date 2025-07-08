import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { cert, getApps, initializeApp } from "firebase-admin/app";

// 👉 Inicializa Firebase Admin una sola vez
if (!getApps().length && process.env.FIREBASE_ADMIN_KEY) {
    initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY)) });
}

export const {
    handlers: { GET, POST },
    auth,                 // helper para proteger páginas en el servidor
} = NextAuth({
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        }),
    ],
    adapter: FirestoreAdapter(),   // usuarios a Firestore
    session: { strategy: "jwt" },  // lighter que database sessions
});
