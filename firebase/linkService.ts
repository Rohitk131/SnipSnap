import { db } from "./firebaseClient";
import { doc, setDoc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

export async function saveLinkToFirebase(
  uid: string,
  link: { title: string; url: string; timestamp: number }
): Promise<void> {
  const userRef = doc(db, "users", uid);
  
  try {
    const userDoc = await getDoc(userRef);
    const linkWithId = {
      ...link,
      id: Date.now().toString() // Generate unique ID
    };
    
    if (userDoc.exists()) {
      const links = userDoc.data().links || [];
      await updateDoc(userRef, {
        links: [...links, linkWithId]
      });
    } else {
      await setDoc(userRef, { links: [linkWithId] });
    }
  } catch (error) {
    console.error("Error saving link:", error);
    throw error;
  }
}

export async function updateLinkInFirebase(
  uid: string,
  linkId: string,
  updatedLink: any
): Promise<void> {
  const userRef = doc(db, "users", uid);
  
  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) throw new Error("User document not found");

    const links = userDoc.data().links || [];
    const updatedLinks = links.map(link => 
      link.id === linkId ? { ...updatedLink, id: linkId } : link
    );

    await updateDoc(userRef, { links: updatedLinks });
  } catch (error) {
    console.error("Error updating link:", error);
    throw error;
  }
}

export async function deleteLinkFromFirebase(
  uid: string,
  linkId: string
): Promise<void> {
  const userRef = doc(db, "users", uid);
  
  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) throw new Error("User document not found");

    const links = userDoc.data().links || [];
    const updatedLinks = links.filter(link => link.id !== linkId);

    await updateDoc(userRef, { links: updatedLinks });
  } catch (error) {
    console.error("Error deleting link:", error);
    throw error;
  }
}

export async function getSavedLinks(uid: string): Promise<any[]> {
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? (userDoc.data().links || []) : [];
}