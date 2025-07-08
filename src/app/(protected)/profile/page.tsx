import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Mi perfil</h1>
      <ProfileForm
        defaultDate={session.user.dateOfBirth}
        defaultKeko={session.user.habboNickname ?? ""}
        uid={session.user.id}
      />
    </section>
  );
}
