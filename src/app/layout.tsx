import "./globals.css";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Providers from "./components/Providers";
import NavBar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RadioBobba",
  description: "Tu radio sin censura",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 👇 Recuperamos la sesión en el servidor una sola vez
  const session = await getServerSession(authOptions);

  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white`}>
        {/* Provider global: habilita useSession() en todo el cliente */}
        <Providers session={session}>
          <NavBar /> {/* NavBar puede seguir siendo Server Component */}
          <main className="mx-auto max-w-6xl p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
