import admin from "firebase-admin";
// import { firebaseConfig } from "./client";
export const runtime = "nodejs";



const firebaseConfig = {
    type: "service_account",
    project_id: process.env.PROJECT_ID!,
    private_key_id: process.env.PRIVATE_KEY_ID!,
    private_key: process.env.PRIVATE_KEY!,
    client_email: process.env.CLIENT_EMAIL!,
    client_id: process.env.CLIENT_ID!,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL!,
    universe_domain: "googleapis.com",
};
// firebaseConfig
const sa = (firebaseConfig as any).default ?? firebaseConfig;

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(sa),
        databaseURL:
            process.env.NEXT_PUBLIC_URL_DB_URL ||
            process.env.NEXT_PUBLIC_URL_DATABASE_URL ||
            sa.databaseURL,
    });
}

export const db = admin.database();
