// src/firebase/linkService.ts
import { db } from "./firebaseClient";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth } from "./firebaseClient";
export async function saveLinkToFirebase(
  uid: string,
  link: { title: string; url: string; timestamp: number }
): Promise<void> {
  try {
    console.log("LinkService: Starting save operation", { 
      uid,
      link,
      isAuthenticated: !!auth.currentUser 
    });

    const userRef = doc(db, "users", uid);
    console.log("LinkService: Getting user document");
    
    const userDoc = await getDoc(userRef);
    console.log("LinkService: User document exists:", userDoc.exists());

    if (userDoc.exists()) {
      console.log("LinkService: Updating existing document");
      await updateDoc(userRef, {
        savedLinks: arrayUnion(link),
      });
    } else {
      console.log("LinkService: Creating new document");
      await setDoc(userRef, {
        savedLinks: [link],
      });
    }
    
    console.log("LinkService: Save operation completed successfully");
  } catch (error) {
    console.error("LinkService: Error in saveLinkToFirebase:", error);
    throw error;
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