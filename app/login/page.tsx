"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUser, saveUser } from "@/lib/localStorage";

const field: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  fontSize: "15px",
  color: "#0a0a0a",
  background: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getUser()) router.replace("/dashboard");
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const stored = getUser();
    if (!stored || stored.email !== email.trim().toLowerCase()) {
      setError("No account found with that email. Sign up first.");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "24px",
          padding: "40px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          <img
            src="/TeslaSTEMlogo.png"
            alt="Tesla STEM"
            style={{ height: "52px", width: "52px", objectFit: "contain" }}
          />
          <span style={{ fontSize: "12px", color: "#6b7280" }}>
            Nikola Tesla STEM High School
          </span>
        </div>

        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#0a0a0a",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          Log in to your BusinessBoost account
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={field}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={field}
            />
          </div>

          {error && (
            <div
              style={{
                fontSize: "13px",
                color: "#dc2626",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                padding: "10px 14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#8dc63f",
              color: "#0f2338",
              border: "none",
              borderRadius: "9999px",
              padding: "12px 24px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "4px",
            }}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            style={{ color: "#8dc63f", fontWeight: 600, textDecoration: "none" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
