// Import necessary Firebase functions
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiKey } from '@env';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: 'newreactnative-a2795.firebaseapp.com',
  projectId: 'newreactnative-a2795',
  storageBucket: 'gs://newreactnative-a2795.firebasestorage.app',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

// Export everything at once
export { auth, db, storage };