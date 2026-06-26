// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";

// const client = new MongoClient(process.env.MONGODB_URI);
// const db = client.db(process.env.AUTH_DB_NAME);

// export const auth = betterAuth({
//   emailAndPassword: { 
//     enabled: true, 
//   }, 
//   database: mongodbAdapter(db, {
//     client
//   }),
  
//   user: {
//     additionalFields: {
//       bloodGroup: {
//         type: "string",
//         required: false, 
//       },
//       district: {
//         type: "string",
//         required: false,
//       },
//       upazila: {
//         type: "string",
//         required: false,
//       },
//       role: {
//         type: "string",
//         defaultValue: "donor", 
//       },
//       status: {
//         type: "string",
//         defaultValue: "active", 
//       },
//     },
//   },
// });




import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// dev-এ HMR থেকে একাধিক connection তৈরি ঠেকাতে global cache
const globalForMongo = globalThis;

const client =
  globalForMongo._mongoClient ??
  new MongoClient(process.env.MONGODB_URI);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = client;
}

const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://blood-link-chi-wine.vercel.app",
  ],
  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      bloodGroup: {
        type: "string",
        required: false,
      },
      district: {
        type: "string",
        required: false,
      },
      upazila: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        defaultValue: "donor",
      },
      status: {
        type: "string",
        defaultValue: "active",
      },
    },
  },
});