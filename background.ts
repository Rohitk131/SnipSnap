import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_LINK") {
    const linkDoc = doc(db, "links", new Date().toISOString());
    setDoc(linkDoc, { url: message.url })
      .then(() => {
        sendResponse({ message: "Link saved successfully!" });
      })
      .catch((error) => {
        console.error("Error saving link:", error);
        sendResponse({ message: "Failed to save the link." });
      });
    return true; // Required to use sendResponse asynchronously
  }
});
