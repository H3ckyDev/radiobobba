import NextAuth from "next-auth/next";      // 👈 ruta para App Router
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

// Next.js exige nombrar los handlers así
export { handler as GET, handler as POST };
