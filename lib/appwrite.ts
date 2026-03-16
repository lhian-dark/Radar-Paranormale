import { Client, Account, Databases, OAuthProvider, ID, Query } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);

export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
export const LUOGHI_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_LUOGHI_ID || '';

// ---- Auth ----

export async function loginGoogle() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  account.createOAuth2Session(
    OAuthProvider.Google,
    `${origin}/`,
    `${origin}/`
  );
}

export async function getSession() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function logout() {
  await account.deleteSession('current');
}

// ---- User Places ----

export interface UserPlace {
  $id?: string;
  name: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  proofUrl?: string;
  userId: string;
  userName: string;
  createdAt: string;
  views: number;
}

export async function getUserPlaces(lat: number, lng: number, radiusKm: number = 100) {
  try {
    const all = await databases.listDocuments(DB_ID, LUOGHI_COLLECTION, [
      Query.limit(100),
      Query.orderDesc('$createdAt'),
    ]);

    const R = 6371;
    return all.documents.filter((doc: any) => {
      const dLat = ((doc.lat - lat) * Math.PI) / 180;
      const dLng = ((doc.lng - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((doc.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return dist <= radiusKm;
    });
  } catch (err) {
    console.error('Appwrite error:', err);
    return [];
  }
}

export async function addUserPlace(place: Omit<UserPlace, '$id'>) {
  return databases.createDocument(DB_ID, LUOGHI_COLLECTION, ID.unique(), place);
}

export { client };
