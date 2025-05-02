
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Add other Firebase services imports as needed (e.g., getStorage, getFunctions)

// Ensure environment variables are defined
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.error("Firebase API Key is missing in environment variables (NEXT_PUBLIC_FIREBASE_API_KEY).");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
    console.warn("Firebase Auth Domain is missing in environment variables (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN). Authentication might fail.");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase Project ID is missing in environment variables (NEXT_PUBLIC_FIREBASE_PROJECT_ID).");
}


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (!getApps().length) {
    try {
        app = initializeApp(firebaseConfig);
    } catch (error) {
        console.error("Firebase initialization error:", error);
        // Handle the error appropriately, maybe show a message to the user
        // For now, we'll re-throw or handle it based on application needs
        throw error; // Re-throwing might stop the app, consider a more graceful handling
    }
} else {
    app = getApp();
}


let firestore: ReturnType<typeof getFirestore> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;

// Initialize services only if app initialization was successful
if (app) {
    try {
        firestore = getFirestore(app);
        auth = getAuth(app);
        // Initialize other services here
    } catch (error) {
        console.error("Error initializing Firebase services:", error);
        // Handle service initialization errors
    }
}


// Export potentially null services, check for null before use in components/hooks
export { app, firestore, auth };

// NOTE: Ensure you have the corresponding NEXT_PUBLIC_FIREBASE_... environment variables set in your .env.local file.
