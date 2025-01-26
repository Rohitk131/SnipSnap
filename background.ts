import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { saveLinkToFirebase } from "./firebase/linkService";

// Initialize Firebase in background
const firebaseConfig = {
  // Your firebase config here - same as in firebaseClient.ts
  apiKey: process.env.PLASMO_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PLASMO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PLASMO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.PLASMO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SAVE_LINK') {
    console.log("Background: Received save link request");
    
    (async () => {
      try {
        // Get stored auth data
        const { authUser } = await chrome.storage.local.get(['authUser']);
        
        if (!authUser) {
          throw new Error("User not authenticated");
        }

        // Save link using the stored user ID
        await saveLinkToFirebase(authUser.uid, {
          title: message.payload.title,
          url: message.payload.url,
          timestamp: Date.now()
        });

        sendResponse({ success: true });
      } catch (error) {
        console.error("Error:", error);
        sendResponse({ success: false, error: error.message });
      }
    })();

    return true;
  }
});