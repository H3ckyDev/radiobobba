"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        className="rounded-xl bg-primary px-4 py-2 text-white hover:opacity-90"
        onClick={() => signOut()}
      >
        👋 Cerrar sesión
      </button>
    );
  }
  return (
    <button
      className="rounded-xl bg-primary px-4 py-2 text-white hover:opacity-90"
      onClick={() => signIn("discord")}
    >
      Iniciar sesión con Discord
    </button>
  );
}
