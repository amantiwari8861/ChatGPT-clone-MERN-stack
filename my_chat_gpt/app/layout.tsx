import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My AI — Chat",
  description: "A dark, production style AI chat interface.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-app text-ink">{children}</body>
    </html>
  );
}
