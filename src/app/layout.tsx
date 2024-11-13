import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | OG Generation Experiment',
    default: 'OG Generation Experiment',
  },
  description: 'Your blog description here - make it compelling for search results',
  authors: [{ name: 'Whadayanow' }],
  creator: 'Whadayanow',
  publisher: 'OG Generation Experiment',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'OG Generation Experiment',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@alserembani',
    site: '@alserembani',
  },
  verification: {
    // Add your verification tokens here
    google: 'your-google-verification-token',
    // other verification tokens as needed
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                Your Blog
              </Link>
              <Link 
                href="/blog" 
                className="text-gray-600 hover:text-gray-900"
              >
                Blog
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}