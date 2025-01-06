import React, { useState, useEffect } from "react";
import AuthForm from "components/AuthForm";
import useFirebaseUser from "~firebase/useFirebaseUser";
import { getSavedLinks } from "./firebase/linkService";
import "./style.css";

export default function Options() {
  const { user, onLogout } = useFirebaseUser();
  const [links, setLinks] = useState([]);

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

  return (
    <div className="min-h-[400px] w-[400px] bg-slate-950 text-slate-100 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBvcGFjaXR5PSIwLjEiPgo8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CiAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPgo8L2ZpbHRlcj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIvPgo8L3N2Zz4=')]">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {!user ? (
          <AuthForm />
        ) : (
          <div className="w-80 p-6 backdrop-blur-sm bg-slate-900/50 rounded-xl border border-slate-600/50 shadow-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">
              Welcome, {user?.email}
            </h2>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-white font-medium bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Sign Out
            </button>
            <div className="mt-8">
              <h3 className="text-xl font-bold">Your Saved Links</h3>
              <div className="mt-4">
                {links.length > 0 ? (
                  <ul className="space-y-4">
                    {links.map((link, index) => (
                      <li
                        key={index}
                        className="p-4 bg-slate-800/50 rounded-lg"
                      >
                        <h4 className="text-lg font-medium">{link.title}</h4>
                        <p className="text-slate-400">{link.url}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(link.timestamp).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400">No links saved yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
