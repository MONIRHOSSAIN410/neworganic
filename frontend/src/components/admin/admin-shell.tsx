"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Tags, ShoppingCart, LogOut, Leaf, Store } from "lucide-react";
const nav=[["/admin","Overview",LayoutDashboard],["/admin/products","Products",Package],["/admin/categories","Categories",Tags],["/admin/orders","Orders",ShoppingCart]] as const;
export function AdminShell({children}:{children:React.ReactNode}){
 const path=usePathname();const router=useRouter();
 function logout(){localStorage.removeItem("gb-token");router.push("/admin/login");}
 if (path === "/admin/login") return <>{children}</>;
 return <div className="min-h-screen bg-muted/40 md:grid md:grid-cols-[240px_1fr]"><aside className="border-b bg-card p-4 md:min-h-screen md:border-b-0 md:border-r"><Link href="/" className="flex items-center gap-2 text-lg font-black text-emerald-800"><span className="rounded-lg bg-emerald-100 p-2"><Leaf size={18}/></span>greenbasket</Link><p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Workspace</p><nav className="flex gap-2 overflow-x-auto md:flex-col">{nav.map(([href,label,Icon])=><Link key={href} href={href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${path===href?"bg-emerald-700 text-white":"hover:bg-muted"}`}><Icon size={17}/>{label}</Link>)}</nav><div className="mt-8 hidden border-t pt-4 md:block"><Link href="/" className="flex items-center gap-3 px-3 py-3 text-sm"><Store size={17}/> View store</Link><button onClick={logout} className="flex w-full items-center gap-3 px-3 py-3 text-sm text-red-600"><LogOut size={17}/> Sign out</button></div></aside><div className="min-w-0"><header className="flex h-16 items-center justify-between border-b bg-card px-5"><b className="text-sm">Store administration</b><div className="flex items-center gap-3 text-xs text-muted-foreground"><span>Admin</span><button onClick={logout} className="md:hidden"><LogOut size={17}/></button></div></header><main className="p-4 sm:p-7">{children}</main></div></div>;
}
