"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
export default function AdminLogin(){
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [busy,setBusy]=useState(false);const router=useRouter();
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);try{const result=await api<{token:string}>("/auth/login",{method:"POST",body:JSON.stringify({email,password})});localStorage.setItem("gb-token",result.token);router.push("/admin");}catch(err){toast.error(err instanceof Error?err.message:"Sign in failed");}finally{setBusy(false);}}
 return <div className="grid min-h-screen place-items-center bg-gradient-to-br from-[#f4f8ef] to-background p-5"><form onSubmit={submit} className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-xl sm:p-10"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><ArrowLeft size={16}/> Back to store</Link><div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><Leaf size={28}/></div><h1 className="text-3xl font-black">Admin sign in</h1><p className="mt-2 text-sm text-muted-foreground">Sign in to manage products and your store catalogue.</p><label className="label mt-8">Email address</label><div className="relative"><Mail className="absolute left-3 top-3.5 text-slate-400" size={17}/><input required type="email" className="field pl-10" placeholder="admin@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></div><label className="label mt-5">Password</label><div className="relative"><LockKeyhole className="absolute left-3 top-3.5 text-slate-400" size={17}/><input required type="password" className="field pl-10" placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)}/></div><button disabled={busy} className="btn-primary mt-6 w-full">{busy?"Signing in…":"Sign in to dashboard"}</button></form></div>;
}
