import React, { useState, useEffect } from "react";
import AuthForm from "components/AuthForm";
import useFirebaseUser from "~firebase/useFirebaseUser";
import { getSavedLinks, saveLinkToFirebase } from "./firebase/linkService";
import "./style.css";

export default function Options() {
  const { user, onLogout } = useFirebaseUser();
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
  const [linkTitle, setLinkTitle] = useState("");

  useEffect(() => {
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

  return (
    <div className="min-h-[400px] w-[400px] bg-slate-950 text-slate-100 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBvcGFjaXR5PSIwLjEiPgo8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CiAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPgo8L2ZpbHRlcj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIvPgo8L3N2Zz4=')]">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {!user ? (
          <AuthForm />
        ) : (
          <div className="min-h-[400px] w-[400px] bg-black shadow-[0_0_40px_rgba(0,0,0,0.3)] rounded-2xl border border-slate-800/30">
            <div className="relative">
              <div className="absolute -top-3 -left-2 w-12 h-12 bg-blue-500/10 rounded-full blur-xl" />
              <div className="absolute -top-3 left-8 w-12 h-12 bg-purple-500/10 rounded-full blur-xl" />
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                Welcome back
              </h2>
              <p className="text-sm text-slate-400 mb-4">{user?.email}</p>
            </div>

            <button
              onClick={onLogout}
              className="px-6 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
            >
              Sign Out
            </button>

            {/* New Link Section */}
            <div className="mt-10 relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
              <h3 className="text-xl font-semibold mb-6 text-white/90">Add New Link</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Enter title"
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800/50 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:bg-slate-900 transition-all duration-300 placeholder:text-slate-600 text-slate-300 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                />
                <input
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="Enter URL"
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800/50 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:bg-slate-900 transition-all duration-300 placeholder:text-slate-600 text-slate-300 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                />
                <button
                  onClick={handleSaveLink}
                  className="w-full py-3 text-white font-medium bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.4)]"
                >
                  Save Link
                </button>
              </div>
            </div>

            {/* Saved Links Section */}
            <div className="mt-10 relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
              <h3 className="text-xl font-semibold mb-6 text-white/90">Saved Links</h3>
              <div className="mt-4">
                {links.length > 0 ? (
                  <ul className="space-y-4">
                    {links.map((link, index) => (
                      <li
                        key={index}
                        className="group p-4 bg-slate-900/50 rounded-xl border border-slate-800/50 hover:bg-slate-800/50 hover:border-slate-700/50 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                      >
                        <h4 className="text-lg font-medium text-white/90 mb-1 group-hover:text-emerald-400 transition-colors duration-300">
                          {link.title}
                        </h4>
                        <p className="text-slate-400 text-sm mb-2 break-all group-hover:text-slate-300 transition-colors duration-300">
                          {link.url}
                        </p>
                        <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                          {new Date(link.timestamp).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 px-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                    <p className="text-slate-500">No links saved yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}