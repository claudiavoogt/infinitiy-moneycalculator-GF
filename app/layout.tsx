import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mijn Tool',
  description: 'Interactieve kennis tool',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  );
}
