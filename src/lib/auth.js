const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// 1. ADD THIS DEBUG LINE:
console.log("Checking MONGO_URI:", process.env.MONGO_URI ? "Found it!" : "MISSING ❌");

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('ideavault');

export const auth = betterAuth({
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