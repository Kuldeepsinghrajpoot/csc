import { StandardCheckoutClient, Env } from 'pg-sdk-node';

// const clientId = process.env.PHONEPE_CLIENT_ID!;
// const clientSecret = process.env.PHONEPE_CLIENT_SECRET!;
const clientId = process.env.PHONEPE_CLIENT_ID!;
const clientSecret = process.env.PHONEPE_CLIENT_SECRET!;
const clientVersion = 1; 
const env = process.env.NODE_ENV === 'production' ? Env.PRODUCTION : Env.SANDBOX;

// Using a global variable to prevent re-initialization during Next.js Hot Reloading
const globalForPhonePe = global as unknown as { phonePeClient: StandardCheckoutClient };

export const client = globalForPhonePe.phonePeClient || StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);

if (process.env.NODE_ENV !== 'production') globalForPhonePe.phonePeClient = client;