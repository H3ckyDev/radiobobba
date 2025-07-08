import RadioPlayer from "./components/RadioPlayer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-primary to-secondary p-6">
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
        🎙️ RadioBobba
      </h1>
      <RadioPlayer />
    </main>
  );
}
