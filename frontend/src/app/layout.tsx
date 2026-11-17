import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
export const metadata: Metadata = {
  title: "Savory Nest | Fresh Groceries & Organic Essentials",
  description: "Shop fresh, organic groceries and everyday essentials with Savory Nest.",
  referrer: "no-referrer",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
