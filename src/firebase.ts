import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  arrayUnion,
  increment,
  Timestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyCbCb5aOCaswXNeVtvsTdjF8DwYQnup034",
  authDomain: "studio-7759055776-def43.firebaseapp.com",
  projectId: "studio-7759055776-def43",
  storageBucket: "studio-7759055776-def43.firebasestorage.app",
  messagingSenderId: "627519041285",
  appId: "1:627519041285:web:42e6657f56ed42e4f2116c"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  'client_id': '627519041285-11gjuvd3k6fk0kkm7qim9s8mrlg6t9rc.apps.googleusercontent.com'
});

export {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  increment,
  Timestamp,
  signInWithPopup,
  onAuthStateChanged,
  signOut
};
export type { User };
