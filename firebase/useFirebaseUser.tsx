import { type User, browserLocalPersistence, onAuthStateChanged, setPersistence } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebaseClient";

setPersistence(auth, browserLocalPersistence);

export default function useFirebaseUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // First, try to get the auth state from storage
    chrome.storage.local.get(['authUser'], (result) => {
      if (result.authUser) {
        setUser(result.authUser);
        setIsLoading(false);
      }
    });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        // Get the user data we want to store
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
        };

        // Store in chrome.storage for content scripts
        await chrome.storage.local.set({ authUser: userData });
        setUser(firebaseUser);
      } else {
        // Clear the stored user data
        await chrome.storage.local.remove(['authUser']);
        setUser(null);
      }
      
      setIsLoading(false);
    });

    // Also listen for auth state changes from other contexts
    const messageListener = (message) => {
      if (message.type === 'AUTH_STATE_CHANGED') {
        setUser(message.user);
      }
    };
    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      unsubscribe();
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const onLogout = async () => {
    setIsLoading(true);
    if (user) {
      await auth.signOut();
      await chrome.storage.local.remove(['authUser']);
      chrome.runtime.sendMessage({ type: 'AUTH_STATE_CHANGED', user: null });
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    user,
    onLogout,
  };
}