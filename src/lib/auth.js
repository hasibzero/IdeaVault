import dns from "node:dns";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("ideavault");

const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.BETTER_AUTH_URI ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const auth = betterAuth({
  baseURL,
  trustedOrigins: [
    baseURL,
    process.env.CLIENT_URL,
    "http://localhost:3000",
  ].filter(Boolean),
  session: {
        cookieCache:{
            enabled: true,
            strategy: "jwt",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        }
    },
    plugins: [
        jwt(), 
    ],
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {    
      enabled: true
  },
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID , 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET , 
        }, 
    },
});