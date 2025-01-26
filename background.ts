import { saveLinkToFirebase } from "./firebase/linkService";
import { auth } from "./firebase/firebaseClient";
import { onAuthStateChanged, signInWithCustomToken } from "firebase/auth";

// Initialize auth state
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  console.log("Background: Auth state changed", { 
    isAuthenticated: !!user,
    uid: user?.uid 
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SAVE_LINK') {
    console.log("Background: Received save link request", message.payload);
    
    (async () => {
      try {
        // Get auth state from storage
        const result = await chrome.storage.local.get(['authUser']);
        console.log("Background: Auth state from storage", result.authUser);

        if (!result.authUser) {
          throw new Error("No authenticated user found");
        }

        // Check Firebase auth state
        console.log("Background: Current Firebase auth state", { 
          currentUser,
          isAuthenticated: !!auth.currentUser 
        });

        // Try to save the link
        await saveLinkToFirebase(result.authUser.uid, {
          title: message.payload.title,
          url: message.payload.url,
          timestamp: message.payload.timestamp
        });

        console.log("Background: Link saved successfully");
        sendResponse({ success: true });
      } catch (error) {
        console.error("Background: Error saving link", error);
        sendResponse({ success: false, error: error.message });
      }
    })();

    return true;
  }
});