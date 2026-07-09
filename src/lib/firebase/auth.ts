// ============================================================
// Firebase Auth Helpers — AJK PowerMeter Dashboard
// Login, logout, dan auth state listener
// Akun dashboard TERPISAH dari akun device di firmware
// ============================================================

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Login dengan email & password
 * @throws FirebaseError jika gagal
 */
export async function signIn(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

/**
 * Logout user dashboard
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Subscribe ke perubahan auth state
 * @returns Unsubscribe function
 */
export function onAuthChange(
  callback: (user: User | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current user (synchronous, bisa null)
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Translate Firebase auth error code ke pesan Indonesia
 */
export function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Akun tidak ditemukan. Periksa email Anda.';
    case 'auth/wrong-password':
      return 'Password salah. Silakan coba lagi.';
    case 'auth/invalid-email':
      return 'Format email tidak valid.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan. Coba lagi nanti.';
    case 'auth/user-disabled':
      return 'Akun ini telah dinonaktifkan.';
    case 'auth/network-request-failed':
      return 'Gagal terhubung ke server. Periksa koneksi internet.';
    case 'auth/invalid-credential':
      return 'Email atau password salah.';
    default:
      return 'Terjadi kesalahan. Silakan coba lagi.';
  }
}
