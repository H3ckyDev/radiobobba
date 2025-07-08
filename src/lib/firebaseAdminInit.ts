import { getApps, initializeApp, cert } from "firebase-admin/app";

if (!getApps().length) {
  if (!process.env.FIREBASE_ADMIN_KEY) {
    throw new Error("FIREBASE_ADMIN_KEY no está definida 📛");
  }
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY)),
  });
}
