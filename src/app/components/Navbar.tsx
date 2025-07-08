import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import LoginButton from "./LoginButton";

export default async function NavBar() {

    const session = await getServerSession(authOptions);

    return (
        <header className="w-full border-b border-white/10 bg-black/50 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
                {/* Logo / Home */}
                <Link href="/" className="text-2xl font-extrabold text-white">
                    {' '}
                </Link>
                {/* Links públicos */}
                {/* <ul className="flex gap-6 text-white">
                    <li>
                        <Link href="/blog" className="hover:text-primary">
                            Blog
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="hover:text-primary">
                            Equipo
                        </Link>
                    </li>
                </ul> */}

                {/* Sesión */}
                <div className="flex items-center gap-4">
                    {session?.user ? (
                        <>
                            <span className="hidden sm:block text-white/80">
                                {session.user.name}
                                {session.user.habboNickname && (
                                    <span className="text-primary"> ({session.user.habboNickname})</span>
                                )}
                            </span>
                            {session.user.image && (
                                <Image
                                    src={session.user.image}
                                    alt="avatar"
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 rounded-full"
                                />
                            )}
                        </>
                    ) : null}
                    {/* Botón login / logout (cliente) */}
                    <LoginButton />
                </div>
            </nav>
        </header>
    );
}