// ============================================================
// Firebase Configuration — AJK PowerMeter Dashboard
// Inisialisasi Firebase App, Auth, dan Realtime Database
// ============================================================

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';

/**
 * Firebase configuration dari environment variables
 * Semua value diset di file .env.local
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Initialize Firebase App (singleton pattern)
 * Mencegah re-initialization saat hot reload di development
 */
const app: FirebaseApp = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApp();

/**
 * Firebase Auth instance
 * Digunakan untuk autentikasi user dashboard
 * (akun terpisah dari akun device di firmware)
 */
const auth: Auth = getAuth(app);

/**
 * Firebase Realtime Database instance
 * Digunakan untuk membaca data dari:
 * - /powermonitor/devices/{deviceId}/realtime (data real-time)
 * - /powermonitor/devices/{deviceId}/logs (data historis)
 * - /powermonitor/devices/{deviceId}/settings (info device)
 */
const database: Database = getDatabase(app);

export { app, auth, database };
