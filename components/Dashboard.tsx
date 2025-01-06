import React from "react"

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="w-80 p-6 backdrop-blur-sm bg-slate-900/50 rounded-xl border border-slate-800/50 shadow-lg text-center">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Welcome to <span className="text-emerald-400">SNIPSNAP</span>
        </h2>
        <p className="text-slate-400">You're successfully signed in!</p>
      </div>
      <button
        onClick={onLogout}
        className="px-6 py-2.5 text-white font-medium bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900">
        Sign Out
      </button>
      {/* Add your saved links or other dashboard features here */}
    </div>
  )
}
