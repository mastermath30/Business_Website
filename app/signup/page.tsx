"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getUser, saveUser } from "@/lib/localStorage";
import { TypingText } from "@/components/TypingText";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getUser()) router.replace("/study");
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    saveUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    });
    router.push("/study");
  }

  return (
    <div className="surface-base flex min-h-screen items-center justify-center px-6 py-10">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-50 dark:opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="surface-card border-soft w-full max-w-md rounded-3xl p-10 shadow-soft"
      >
        <div className="mb-8 flex flex-col items-center gap-2">
          <img
            src="/TeslaSTEMlogo.png"
            alt="Tesla STEM"
            style={{ height: 52, width: 52 }}
            className="object-contain"
          />
          <span className="text-soft text-xs">Nikola Tesla STEM High School</span>
        </div>

        <TypingText
          text="Create your account"
          className="text-strong mb-2 text-center text-2xl font-bold tracking-tight"
        />
        <p className="text-soft mb-8 text-center text-sm">
          Start studying smarter with BusinessBoost
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <FormField label="Name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="field-base w-full rounded-xl px-4 py-2.5 text-[15px]"
            />
          </FormField>

          <FormField label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="field-base w-full rounded-xl px-4 py-2.5 text-[15px]"
            />
          </FormField>

          <FormField label="Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="field-base w-full rounded-xl px-4 py-2.5 text-[15px]"
            />
          </FormField>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="btn-primary mt-1 px-6 py-3"
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Creating account…" : "Create account"}
          </motion.button>
        </form>

        <p className="text-soft mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#16a34a] hover:text-[#15803d] transition-colors"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-mid mb-1.5 block text-[13px] font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
