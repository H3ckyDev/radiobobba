import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        // 👉 manda a la página de login global
        redirect("/api/auth/signin");
    }

    return (
        <section className="space-y-4">
            <h1 className="text-3xl font-bold">Panel de control</h1>
            <p>Bienvenido, {session.user?.name}. 🎉</p>
            {/* Aquí meteremos stats, crear post, etc. */}
        </section>
    );
}
