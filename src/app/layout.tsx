import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HOMLIZ — Real Estate & Rental Marketplace in Gorakhpur',
  description: 'Find trusted residential flats, independent house rentals, and commercial spaces in Gorakhpur, Uttar Pradesh. Discover properties across Civil Lines, Golghar, Raptinagar, Medical Road & more.',
  keywords: [
    'Gorakhpur real estate',
    'Gorakhpur rental marketplace',
    'flats for rent in Gorakhpur',
    'house for rent Gorakhpur',
    'commercial shop Golghar Gorakhpur',
    'Civil Lines Gorakhpur apartments',
    'HOMLIZ Gorakhpur',
  ],
  authors: [{ name: 'HOMLIZ' }],
  openGraph: {
    title: 'HOMLIZ — Real Estate & Rental Marketplace in Gorakhpur',
    description: 'A trusted local platform for discovering and renting residential and commercial properties in Gorakhpur.',
    url: 'https://homliz.com',
    siteName: 'HOMLIZ',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth dark`}
    >
      <body className="min-h-screen bg-[#080C14] text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
