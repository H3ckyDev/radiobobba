"use client";

import { useEffect, useRef, useState } from "react";
import {
    PlayCircle,
    PauseCircle,
    Volume2,
    VolumeX,
} from "lucide-react";

const STREAM_URL = "https://server2.ejeserver.com:7012/stream";
const LS_KEY = "radiobobba-volume";

export default function RadioPlayer() {
    /* ---------- refs & state ---------- */
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(true);
    const [volume, setVolume] = useState<number>(() => {
        const saved = localStorage.getItem(LS_KEY);
        return saved ? Number(saved) : 0.5;
    });
    const [listeners, setListeners] = useState<number>(0);

    /* ---------- effects ---------- */
    /* inicializa audio + listeners polling */
    useEffect(() => {
        const audio = audioRef.current!;
        audio.volume = volume;
        audio.play().catch(() => setPlaying(false)); // por si el navegador bloquea autoplay

        /* Poll oyentes cada 20 s */
        const poll = async () => {
            try {
                const res = await fetch("/api/streaminfo");
                const { listeners, dj } = await res.json();
                setListeners(listeners);
            } catch {
                /* silencio */
            }
        };
        poll();
        const id = setInterval(poll, 40_000);
        return () => clearInterval(id);
    }, []);

    /* guarda volumen en localStorage */
    useEffect(() => {
        localStorage.setItem(LS_KEY, volume.toString());
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    /* ---------- handlers ---------- */
    const togglePlay = () => {
        const audio = audioRef.current!;
        if (playing) {
            audio.pause();
        } else {
            audio.play().catch(() => {/* ignored */ });
        }
        setPlaying(!playing);
    };

    const toggleMute = () => setVolume(v => (v === 0 ? 0.5 : 0));

    /* ---------- UI ---------- */
    return (
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-black/40 p-6 shadow-lg">
            {/* Audio tag */}
            <audio ref={audioRef} src={STREAM_URL} autoPlay />

            {/* Controles */}
            <div className="flex items-center gap-4">
                {/* Play / Pause */}
                <button
                    onClick={togglePlay}
                    className="text-primary hover:opacity-90"
                    title={playing ? "Pausar" : "Reproducir"}
                >
                    {playing ? <PauseCircle size={48} /> : <PlayCircle size={48} />}
                </button>

                {/* Volumen */}
                <button
                    onClick={toggleMute}
                    className="text-primary hover:opacity-90"
                    title={volume === 0 ? "Restaurar volumen" : "Silenciar"}
                >
                    {volume === 0 ? <VolumeX /> : <Volume2 />}
                </button>

                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    className="h-1 w-32 cursor-pointer accent-primary"
                />
            </div>

            {/* Oyentes */}
            <p className="text-sm text-white/80">👥 Oyentes en vivo: {listeners}</p>
        </div>
    );
}
