import AuthForm from "components/AuthForm"

import useFirebaseUser from "~firebase/useFirebaseUser"

import "./style.css"

export default function Options() {
  const { user, onLogout } = useFirebaseUser()

  return (
    <div className="min-h-[400px] w-[400px] bg-slate-950 text-slate-100 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBvcGFjaXR5PSIwLjEiPgo8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CiAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPgo8L2ZpbHRlcj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIvPgo8L3N2Zz4=')]">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {!user && <AuthForm />}
        {user && (
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
          </div>
        )}
      </div>
    </div>
  )
}
