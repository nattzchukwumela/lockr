"use client";
import { useState } from "react";
import SignUp from "../components/auth/signup";
import SignIn from "../components/auth/signin";

// Demo switcher
export default function AuthPages() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowSignIn(!showSignIn)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Show {showSignIn ? "Sign Up" : "Sign In"}
        </button>
      </div>

      {showSignIn ? <SignIn /> : <SignUp />}
    </div>
  );
}
