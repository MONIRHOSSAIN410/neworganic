"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await api<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("gb-token", result.token);
      router.push("/admin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-emerald-50/50 via-background to-emerald-100/30 p-5">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border bg-card/90 backdrop-blur-md p-8 shadow-2xl sm:p-10 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Back to store
          </Link>
        </div>

        {/* প্রিমিয়াম লোগো ডিজাইন */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-emerald-500/30 shadow-lg mb-3">
            <Image
              src="/image/savory.jpg"
              alt="Savory Nest Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-emerald-900 dark:text-emerald-400">
            Savory <span className="text-primary">Nest</span>
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-0.5">
            Admin Portal
          </p>
        </div>

        <div className="space-y-1 text-left mb-6">
          <h2 className="text-xl font-bold">Admin Sign In</h2>
          <p className="text-xs text-muted-foreground">
            Sign in to manage products and your store catalogue securely.
          </p>
        </div>

        <div>
          <label className="label">Email address</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={17} />
            <input
              required
              type="email"
              className="field pl-10"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="label">Password</label>
          <div className="relative mt-1">
            <LockKeyhole
              className="absolute left-3 top-3.5 text-slate-400"
              size={17}
            />
            <input
              required
              type="password"
              className="field pl-10"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button disabled={busy} className="btn-primary mt-6 w-full py-3 font-semibold shadow-lg shadow-primary/20">
          {busy ? "Signing in…" : "Sign in to dashboard"}
        </button>
      </form>
    </div>
  );
}