import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🔮 Radar Paranormale',
  description: 'Scopri i luoghi misteriosi vicino a te',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" translate="no">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </head>
      <body className="bg-[#0a0008] text-gray-100 min-h-screen antialiased">{children}</body>
    </html>
  );
}
