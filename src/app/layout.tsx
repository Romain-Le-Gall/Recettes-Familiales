import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import RouteScopedMain from "@/components/RouteScopedMain";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "La maison LE GALL",
  description: "Site privé pour partager nos recettes familiales",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 text-neutral-900`}>
        <AuthProvider>
          <div className="h-screen flex flex-col">
            <Header />
            <RouteScopedMain>
              {children}
            </RouteScopedMain>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
