import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AJK PowerMeter — Dashboard Monitoring Kelistrikan",
  description:
    "Web Dashboard monitoring kelistrikan real-time PT. Adi Joyo Kusumo. Pantau tegangan, arus, daya, energi, frekuensi, dan power factor dari browser.",
  keywords: [
    "power meter",
    "monitoring listrik",
    "dashboard kelistrikan",
    "AJK",
    "PT Adi Joyo Kusumo",
    "ESP32",
    "PZEM-004T",
  ],
  authors: [{ name: "Teguh Imam Subarkah — R&D, PT. Adi Joyo Kusumo" }],
  icons: {
    icon: "/logo-ajk.png",
    apple: "/logo-ajk.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: 'var(--bg-card)',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'var(--bg-card)',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
