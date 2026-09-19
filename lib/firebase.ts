import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBHIgKZLYgEHyYgOLH7_zjX9zGAq9WRSfs',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'darul-uloom-siddiqia.firebaseapp.com',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://darul-uloom-siddiqia-default-rtdb.firebaseio.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'darul-uloom-siddiqia',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'darul-uloom-siddiqia.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '884082284384',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:884082284384:web:13158933f21d533b787005',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== '' &&
  (firebaseConfig.databaseURL || firebaseConfig.projectId)
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let database: Database | null = null;

if (typeof window !== 'undefined') {
  try {
    if (isFirebaseConfigured) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      auth = getAuth(app);
      database = getDatabase(app);
    }
  } catch (error) {
    console.warn('Firebase initialization notice:', error);
  }
}

export { app, auth, database };
