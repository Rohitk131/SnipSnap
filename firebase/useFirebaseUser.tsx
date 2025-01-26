// src/firebase/useFirebaseUser.tsx
import { type User, browserLocalPersistence, onAuthStateChanged, setPersistence } from "firebase/auth";
import { useEffect, useState } from "react";
import { sendToBackground } from "@plasmohq/messaging";
import { auth } from "./firebaseClient";

setPersistence(auth, browserLocalPersistence);

export default function useFirebaseUser() {
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
  const [user, setUser] = useState<User | null>(null);

  const onLogout = async () => {
    setIsLoading(true);
    if (user) {
      await auth.signOut();
      await sendToBackground({
        name: "removeAuth",
        body: {},
      });
    }
    setIsLoading(false);
  };

  const onLogin = async () => {
    if (!user) return;

    const uid = user.uid;
    const token = await user.getIdToken(true);

    await sendToBackground({
      name: "saveAuth",
      body: {
        token,
        uid,
        refreshToken: user.refreshToken,
      },
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false); // Set loading to false once the user state is resolved
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  useEffect(() => {
    if (user) {
      onLogin();
    }
  }, [user]);

  return {
    isLoading,
    user,
    onLogout,
  };
}