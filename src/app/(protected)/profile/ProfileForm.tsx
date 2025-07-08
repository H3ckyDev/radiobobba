/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseWeb";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const VERIFICATION_PHRASE = "Radiobobba"; // cámbiala si lo necesitas

type ProfileFormProps = {
    defaultDate: string | null;
    defaultKeko: string;
    uid: string;
};

const ProfileForm: React.FC<ProfileFormProps> = ({
    defaultDate,
    defaultKeko,
    uid,
}) => {
    const { update: refreshSession } = useSession();
    const router = useRouter();
    const [saved, setSaved] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            dateOfBirth: defaultDate
                ? new Date(defaultDate).toISOString().substring(0, 10)
                : "",
            habboNickname: defaultKeko,
        },
    });

    /** 🔑 Validar keko contra API oficial de Habbo */
    async function validateHabbo(nick: string) {
        try {
            const res = await fetch(
                `https://www.habbo.es/api/public/users?name=${encodeURIComponent(nick)}`
            );

            if (!res.ok) {
                throw new Error("Keko no encontrado en Habbo.");
            }

            const data = await res.json();
            // La API devuelve { "motto": "..." } entre otros campos
            if (data.moto?.toString().toLowerCase().includes(VERIFICATION_PHRASE)) {
                throw new Error(
                    `La misión debe contener: "${VERIFICATION_PHRASE}" en algún lugar.`
                );
            }
        } catch (err: any) {
            throw new Error(err.message || "No se pudo validar el keko.");
        }
    }

    async function onSubmit(values: any) {
        // 1️⃣ Si cambió el keko, valida primero
        if (values.habboNickname && values.habboNickname !== defaultKeko) {
            try {
                await validateHabbo(values.habboNickname);
            } catch (e: any) {
                setError("habboNickname", {
                    type: "manual",
                    message: e.message,
                });
                return; // abortar guardado
            }
        }

        // 2️⃣ Actualizar Firestore
        await updateDoc(doc(db, "users", uid), {
            dateOfBirth: values.dateOfBirth
                ? Timestamp.fromDate(new Date(values.dateOfBirth))
                : null,
            habboNickname: values.habboNickname || null,
        });

        // 3️⃣ Refrescar sesión + UI
        await refreshSession();
        router.refresh();

        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    /* ---------- Render ---------- */
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


            <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-300">
                Usamos tu fecha de nacimiento para que podamos felicitarte en tu cumpleaños y para
                que puedas participar en sorteos exclusivos. No la compartimos con nadie. {' ;)'}
            </div>

            {/* Aviso al usuario */}
            <div className="rounded-lg bg-yellow-500/10 p-4 text-sm text-yellow-300">
                Para verificar tu keko, entra a Habbo y cambia tu <strong>misión</strong>{' '}
                a:{' '}
                <code className="text-yellow-200">{VERIFICATION_PHRASE}</code>, guarda,
                y luego completa el formulario.
            </div>

            {/* Fecha */}
            <div>
                <label className="mb-1 block text-sm font-medium">
                    Fecha de nacimiento
                </label>
                <input
                    type="date"
                    {...register("dateOfBirth")}
                    className="w-full rounded-lg bg-black/40 p-2 outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Keko */}
            <div>
                <label className="mb-1 block text-sm font-medium">Keko de Habbo</label>
                <input
                    type="text"
                    placeholder="JulitoCrack"
                    {...register("habboNickname")}
                    className="w-full rounded-lg bg-black/40 p-2 outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.habboNickname && (
                    <p className="mt-1 text-sm text-red-400">
                        {errors.habboNickname.message as string}
                    </p>
                )}
            </div>

            {/* Botón */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl cursor-pointer bg-primary px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting ? "Guardando…" : "Guardar cambios"}
            </button>

            {/* Mensaje éxito */}
            {saved && (
                <p className="text-sm text-green-400">✅ ¡Cambios guardados con éxito!</p>
            )}
        </form>
    );
};

export default ProfileForm;
