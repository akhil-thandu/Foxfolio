"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!password) {
      setError("Password is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(password);
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Invalid password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="w-[60%] bg-bg-primary flex flex-col items-center justify-center relative px-16">
        <div className="text-center">
          <div className="text-7xl mb-6">🦊</div>
          <h1 className="font-mono font-bold text-5xl text-text-primary tracking-widest mb-4">
            FOXFOLIO
          </h1>
          <p className="text-text-secondary text-lg font-light tracking-wide">
            Your wealth. Unified.
          </p>
        </div>
        <div className="absolute bottom-8 left-8">
          <span className="font-mono text-xs text-text-secondary">v1.0.0</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[40%] bg-bg-raised flex flex-col items-center justify-center px-12">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome back</h2>
          <p className="text-text-secondary text-sm mb-8">
            Sign in to your portfolio
          </p>

          {/* Password input */}
          <div className="mb-4">
            <label className="block text-text-secondary text-sm mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
                className="w-full h-12 bg-bg-surface border border-border-subtle rounded-lg pl-10 pr-10 text-text-primary text-sm outline-none focus:border-accent-violet transition-colors placeholder:text-text-secondary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-loss text-sm mb-4">{error}</p>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-12 bg-accent-violet hover:opacity-90 disabled:opacity-50 text-white font-medium rounded-lg transition-opacity"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
