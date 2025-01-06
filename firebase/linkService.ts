// src/firebase/linkService.ts
import { db } from "./firebaseClient";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";


export async function saveLinkToFirebase(
  uid: string,
  link: { title: string; url: string; timestamp: number }
): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        savedLinks: arrayUnion(link),
      });
    } else {
      await setDoc(userRef, {
        savedLinks: [link],
      });
    }
  } catch (error) {
    console.error("Error in saveLinkToFirebase:", error);
    throw error; // Re-throw the error to handle it in the component
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