"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Username or Password is incorrect");
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {/* ===== Header ===== */}
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-1">
          Admin Panel
        </h1>
        <p className="text-center text-sm text-slate-500 mb-6">
          Sign in to manage the system
        </p>

        {/* ===== Username ===== */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full rounded-md border border-slate-300
              px-3 py-2
              text-slate-900
              placeholder-slate-400
              focus:outline-none
              focus:ring-2
              focus:ring-blue-600
            "
          />
        </div>

        {/* ===== Password + Show ===== */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full rounded-md border border-slate-300
                px-3 py-2 pr-16
                text-slate-900
                placeholder-slate-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-600
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                text-sm text-slate-500 hover:text-slate-800
              "
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* ===== Error ===== */}
        {error && (
          <div className="mb-4 rounded-md bg-red-100 text-red-700 text-sm px-4 py-2 text-center">
            {error}
          </div>
        )}

        {/* ===== Button ===== */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full bg-blue-600 hover:bg-blue-700
            disabled:bg-blue-400
            text-white font-medium
            py-2.5 rounded-md
            transition
          "
        >
          {loading ? "Signing in..." : "Log in"}
        </button>

        {/* ===== Footer ===== */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}


/*"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Username or Password is incorrect");
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Admin Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-400 p-3 w-full mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-400 p-3 w-full mb-4"
        />

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700"
        >
          {loading ? "Loading" : "Log in"}
        </button>
      </div>
    </div>
  );
}
*/