import 'server-only';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

function loadServiceAccount() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey: rawKey.replace(/\\n/g, '\n')
  };
}

let adminApp: App | null = null;

function getAdminApp(): App {
  if (adminApp) return adminApp;

  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      'Firebase Admin غير مُعدّ. الرجاء ضبط FIREBASE_PROJECT_ID و FIREBASE_CLIENT_EMAIL و FIREBASE_PRIVATE_KEY.'
    );
  }

  adminApp = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
  return adminApp;
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(loadServiceAccount());
}

let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

export function getAdminDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getAdminApp());
  }
  return dbInstance;
}

export function getAdminAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getAdminApp());
  }
  return authInstance;
}

/**
 * Verifies the Firebase ID token sent from the client in the
 * `Authorization: Bearer <token>` header. Throws if missing/invalid.
 */
export async function requireAuthedUid(request: Request): Promise<string> {
  const header = request.headers.get('authorization') || request.headers.get('Authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new AuthError('يجب تسجيل الدخول أولاً');
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return decoded.uid;
  } catch {
    throw new AuthError('جلسة الدخول غير صالحة، الرجاء تسجيل الدخول مجدداً');
  }
}

export class AuthError extends Error {}
