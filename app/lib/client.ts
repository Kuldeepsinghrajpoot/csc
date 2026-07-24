"use client";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Initialize Firebase only in the browser to avoid server-side hydration
// problems (reCAPTCHA / widgetId access to `document`/`window`).
// If this module is imported on the server, `rtdb` will be null.

export const runtime = "nodejs";

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  databaseURL: process.env.NEXT_PUBLIC_URL_DB_URL!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
};

let _rtdb: ReturnType<typeof getDatabase> | null = null;

if (typeof window !== "undefined") {
  try {
    const app = initializeApp(firebaseConfig);
    _rtdb = getDatabase(app);
  } catch (e) {
    // Swallow init errors on server/build or when env is missing; keep _rtdb null
    // so imports don't throw during SSR.
    // eslint-disable-next-line no-console
    console.warn("Firebase client initialization skipped:", e);
    _rtdb = null;
  }
}

export const rtdb = _rtdb;
