import { db } from "./firebaseClient";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function saveLinkToFirebase(
  uid: string,
  link: { title: string; url: string; timestamp: number }
): Promise<void> {
  const userRef = doc(db, "users", uid);
  
  try {
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const links = userDoc.data().links || [];
      links.push(link);
      await setDoc(userRef, { links }, { merge: true });
    } else {
      await setDoc(userRef, { links: [link] });
    }
  } catch (error) {
    console.error("Error saving link:", error);
    throw error;
  }
}

export async function getSavedLinks(uid: string): Promise<any[]> {
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? (userDoc.data().links || []) : [];
}