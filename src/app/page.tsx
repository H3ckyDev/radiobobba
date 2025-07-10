import RadioPlayer from "./components/RadioPlayer";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-gradient-to-br from-primary to-secondary">
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">

        <div className="relative inline-block">
          <div className="transition-transform duration-300 ease-out hover:scale-110 hover:z-20">
            <Image
              src="https://i.imgur.com/h8TtslF.png"
              alt="avatar"
              width={300}
              height={256}
              className="h-[256px] w-[300px] origin-center object-contain select-none pointer-events-none"
            />
          </div>
        </div>
      </h1>
      <RadioPlayer />
    </main>
  );
}
