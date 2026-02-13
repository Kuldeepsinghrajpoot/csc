import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
export const runtime = "nodejs";

// export const firebaseConfig = {
//   apiKey: "AIzaSyC9n8sXo1l7j3mLh0a2b3c4d5e6f7g8h9i",
//   authDomain: "pradeepcsc-ec8b0.firebaseapp.com",
//   databaseURL: "https://pradeepcsc-ec8b0-default-rtdb.firebaseio.com",
//   projectId: "pradeepcsc-ec8b0",
//   storageBucket: "pradeepcsc-ec8b0.appspot.com",
//   messagingSenderId: "408159523483",
//   appId: "1:408159523483:web:07d9f7723bac391ef86c3e"
// };

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  databaseURL: process.env.NEXT_PUBLIC_URL_DB_URL!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
}

const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
