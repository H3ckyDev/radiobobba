import { NextResponse } from "next/server";

const UPSTREAM = "https://server2.ejeserver.com:2199/rpc/radiobob/streaminfo.get";

export async function GET() {
    try {
        const res = await fetch(UPSTREAM, { next: { revalidate: 15 } });
        if (!res.ok) throw new Error("Upstream error");

        const response_data = await res.json();
        const data = response_data.data[0];
        const listeners = data.listeners || 0;
        const dj = data.title === 'Radiobobba Stream' ? 'Auto DJ' : data.title || 'Desconocido';
        return NextResponse.json({ listeners, dj });
    } catch (e) {
        console.log("Error fetching stream info:", e);
        return NextResponse.json({ listeners: 0, dj: null }, { status: 200 });
    }
}