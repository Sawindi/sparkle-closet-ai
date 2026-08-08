import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atelier — AI Visual Wardrobe & Outfit Stylist',
  description:
    'A premium developer dashboard for an AI visual wardrobe and outfit styling platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
