// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Your Firebase configuration - REPLACE WITH YOUR CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyDG38A1Lw7tPzWfLPaNvuEumi89Ku_8TtA",
  authDomain: "n--c-3dceb.firebaseapp.com",
  projectId: "n--c-3dceb",
  storageBucket: "n--c-3dceb.firebasestorage.app",
  messagingSenderId: "63447153564",
  appId: "1:63447153564:web:8e88db6d6a9afc3ab3e659",
  measurementId: "G-6ZCT5KJNRB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
// Only request public_profile - no email (email requires app review)
facebookProvider.setCustomParameters({
  'display': 'popup'
});

// Microsoft OAuth Provider
const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  prompt: 'select_account',
  tenant: 'common' // Allows both personal and work/school accounts
});

// Make Firebase available globally
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseAddDoc = addDoc;
window.firebaseCollection = collection;
window.firebaseServerTimestamp = serverTimestamp;
window.firebaseAuth = auth;
window.firebaseProvider = provider;
window.firebaseFacebookProvider = facebookProvider;
window.firebaseMicrosoftProvider = microsoftProvider;

console.log('Firebase initialized successfully');

// Export for module imports
export { app, db, auth, provider, facebookProvider, microsoftProvider };
