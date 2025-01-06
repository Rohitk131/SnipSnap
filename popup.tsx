"use client"

import React, { useEffect, useState } from "react"

import "./style.css"

import AuthForm from "components/AuthForm"

import { getSavedLinks } from "./firebase/linkService"
import useFirebaseUser from "./firebase/useFirebaseUser"

export default function Dashboard() {
  const { user, onLogout } = useFirebaseUser()
  const [links, setLinks] = useState([])

  useEffect(() => {
    // Fetch saved links from Firebase or local storage
    const fetchLinks = async () => {
      const linksData = await getSavedLinks(user.uid)
      setLinks(linksData)
    }
    fetchLinks()
  }, [user])

  return (
    <div className="min-h-[400px] w-[400px] bg-slate-950 text-slate-100 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBvcGFjaXR5PSIwLjEiPgo8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CiAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPgo8L2ZpbHRlcj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIvPgo8L3N2Zz4=')]">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {!user ? (
          // Show AuthForm if the user is not signed in
          <AuthForm />
        ) : (
          // Show Dashboard if the user is signed in
          <Dashboard user={user} onLogout={onLogout} />
        )}
      </div>
    </div>
  )
}
