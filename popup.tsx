import React, { useState, useEffect } from "react";
import AuthForm from "components/AuthForm";
import Dashboard from "./components/Dashboard";
import useFirebaseUser from "./firebase/useFirebaseUser";
import { getSavedLinks, saveLinkToFirebase } from './firebase/linkService';
import "./style.css";
import { auth } from "./firebase/firebaseClient";

export default function Options() {
  const { user, isLoading } = useFirebaseUser();
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
  const [linkTitle, setLinkTitle] = useState("");

  useEffect(() => {
    console.log("Current user state:", user); 
    
    if (!user?.uid) return;

    const fetchLinks = async () => {
      try {
        const linksData = await getSavedLinks(user.uid);
        setLinks(linksData);
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    fetchLinks();
  }, [user]);

  const handleSaveLink = async () => {
    if (!newLink || !linkTitle) {
      alert("Please enter both a title and a link.");
      return;
    }

    try {
      await saveLinkToFirebase(user.uid, {
        title: linkTitle,
        url: newLink,
        timestamp: Date.now(),
      });

      const updatedLinks = await getSavedLinks(user.uid);
      setLinks(updatedLinks);

      setNewLink("");
      setLinkTitle("");
    } catch (error) {
      console.error("Error saving link:", error);
      alert(`Failed to save the link. Error: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  return (
    <div className="min-h-[400px] w-[400px] bg-white text-gray-900">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {!user ? (
          <AuthForm />
        ) : (
          <Dashboard
            user={user}
            onLogout={async () => {
              try {
                await auth.signOut();
                await chrome.storage.local.remove(['authUser']);
              } catch (error) {
                console.error("Logout error:", error);
              }
            }}
            links={links}
            setLinks={setLinks}
            newLink={newLink}
            setNewLink={setNewLink}
            linkTitle={linkTitle}
            setLinkTitle={setLinkTitle}
            handleSaveLink={handleSaveLink}
          />
        )}
      </div>
     

    </div>
  );
}