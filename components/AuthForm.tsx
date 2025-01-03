import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth"
import React, { useState } from "react"

import { auth } from "~firebase/firebaseClient"
import useFirebaseUser from "~firebase/useFirebaseUser"

export default function AuthForm() {
  const [showLogin, setShowLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [password, setPassword] = useState("")
  const { isLoading, onLogin } = useFirebaseUser()

  const signIn = async (e) => {
    e.preventDefault()
    if (!email || !password) return alert("Please enter email and password")
    try {
      await signInWithEmailAndPassword(auth, email, password)
      onLogin()
    } catch (error) {
      alert(error.message)
    } finally {
      setEmail("")
      setPassword("")
    }
  }

  const signUp = async (e) => {
    e.preventDefault()
    if (!email || !password || !confirmPassword) {
      return alert("Please fill out all fields")
    }
    if (password !== confirmPassword) {
      return alert("Passwords do not match")
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      onLogin()
    } catch (error) {
      alert(error.message)
    } finally {
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    }
  }

  return (
    <div className="min-h-[400px] w-[400px] bg-gray-900 text-slate-100 flex items-center justify-center ">
      <div className="w-80 p-6 backdrop-blur-sm bg-slate-900/50 rounded-xl border border-slate-600/50 shadow-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBvcGFjaXR5PSIwLjEiPgo8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CiAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPgo8L2ZpbHRlcj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIvPgo8L3N2Zz4=')]">
        <h2 className="text-2xl font-bold text-center mb-8">
          {isLoading ? (
            "Loading..."
          ) : (
            <div className="flex flex-row items-center justify-center gap-2">
              <img
                src="https://i.ibb.co/r76RLf6/extension-removebg-preview.png"
                className="w-12 h-12 "
                alt="icon"
              />
              <div>
                SNIP<span className="text-emerald-400">SNAP</span>
              </div>
            </div>
          )}
        </h2>

        <form onSubmit={showLogin ? signIn : signUp} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800/50 border shadow-xl border-slate-700/50 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors placeholder:text-slate-500"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 shadow-xl bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors placeholder:text-slate-500"
              placeholder="Password"
              required
            />
          </div>

          {!showLogin && (
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 shadow-xl bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors placeholder:text-slate-500"
                placeholder="Confirm Password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 text-white shadow-xl font-medium bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900">
            {showLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-400">
          {showLogin ? (
            <>
              New here?{" "}
              <button
                onClick={() => setShowLogin(false)}
                className="text-emerald-400  hover:text-emerald-300 transition-colors">
                Create account
              </button>
            </>
          ) : (
            <>
              Have an account?{" "}
              <button
                onClick={() => setShowLogin(true)}
                className="text-emerald-400 hover:text-emerald-300 transition-colors">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
