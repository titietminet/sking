import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sking — Trouvez votre ligne",
  description: "Le bon ski, les bonnes fixations. Recommandés pour vous.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
