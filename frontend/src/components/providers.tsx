"use client";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "./store/cart-provider";
import { Toaster } from "sonner";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <CartProvider>
        {children}
        <Toaster richColors position="top-right" />
      </CartProvider>
    </ThemeProvider>
  );
}
