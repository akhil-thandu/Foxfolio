"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { Eye, EyeOff, KeyRound, ArrowRight, ShieldCheck, Lock, Fingerprint } from "lucide-react";
import styles from "./login.module.css";

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
    <div className={styles.page}>
      {/* Ambient Background */}
      <div className={styles.ambientBg}>
        <div className={styles.glowViolet} />
        <div className={styles.glowCyan} />
      </div>

      {/* Main Login Container */}
      <main className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.brand}>
            <span className={styles.brandName}>Foxfolio</span>
            <span className={styles.brandTagline}>Your wealth. Unified.</span>
          </div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your portfolio</p>
        </header>

        {/* Form Panel */}
        <section className={styles.formPanel}>
          <div className={styles.decorativeIcon}>
            <Lock />
          </div>

          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="password">
                Security Key
              </label>
              <div className={styles.inputWrapper}>
                <KeyRound className={styles.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••••••"
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePassword}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className={styles.panelFooter}>
            <a href="#" className={styles.forgotLink}>Forgot Access?</a>
            <div className={styles.secureIndicator}>
              <span className={styles.secureDot} />
              <span className={styles.secureText}>Vault Secured</span>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <div className={styles.trustBadges}>
          <div className={styles.badgeRow}>
            <div className={styles.badge}>
              <ShieldCheck />
              <span>256-bit AES</span>
            </div>
            <div className={styles.badge}>
              <Lock />
              <span>SAML 2.0</span>
            </div>
            <div className={styles.badge}>
              <Fingerprint />
              <span>Bio-Auth</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className={styles.bottomFooter}>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>Security</a>
          <a href="#" className={styles.footerLink}>Privacy</a>
          <a href="#" className={styles.footerLink}>Support</a>
        </div>
        <p className={styles.copyright}>© 2024 Foxfolio. Your wealth. Unified.</p>
      </footer>
    </div>
  );
}
