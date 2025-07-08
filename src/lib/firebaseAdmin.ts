import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export function getAdminDB() {
    if (getApps().length === 0) {
        initializeApp({
            credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY!)),
        });
    }
    return getFirestore();
}
