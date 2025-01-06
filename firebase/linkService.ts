// src/firebase/linkService.ts
import { db } from "./firebaseClient";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export async function saveLinkToFirebase(uid: string, url: string): Promise<void> {
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    await updateDoc(userRef, {
      savedLinks: arrayUnion({ url, timestamp: Date.now() })
    });
  } else {
    await setDoc(userRef, {
      savedLinks: [{ url, timestamp: Date.now() }]
    });
  }
}

export async function getSavedLinks(uid: string): Promise<any[]> {
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data()?.savedLinks || [];
  } else {
    return [];
  }
}