import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AURA Studio — Ambient Sound Capsule & Acoustic Sanctuary',
  description:
    'A warm, architectural acoustic capsule that blends 360° studio clarity with tactile minimalist design. Hand-finished cast stone, knurled solid brass, and 18h battery.',
  keywords: [
    'UGC product landing page',
    'minimalist bluetooth speaker',
    'acoustic capsule',
    'premium audio',
    'architectural home decor',
    'studio sound',
  ],
  authors: [{ name: 'AURA Studio' }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'AURA Studio — Ambient Sound Capsule & Acoustic Sanctuary',
    description: 'Pure acoustic clarity. Crafted for everyday serenity. Explore the Travertine Edition.',
    url: 'https://aurastudio.design',
    siteName: 'AURA Studio',
    images: [
      {
        url: '/images/hero_product.jpg',
        width: 1200,
        height: 630,
        alt: 'AURA Studio Acoustic Capsule in Travertine Edition',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURA Studio — Ambient Sound Capsule',
    description: 'Pure acoustic clarity. Crafted for everyday serenity. Explore the Travertine Edition.',
    images: ['/images/hero_product.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFCF8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${outfit.variable} scroll-smooth antialiased`}>
      <body className="min-h-screen bg-[#FFFCF8] text-[#1A1918] font-sans selection:bg-[#E4FF83] selection:text-[#1A1918]">
        {children}
      </body>
    </html>
  );
}
