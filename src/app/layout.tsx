import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Your Blog Name',
    default: 'Your Blog Name',
  },
  description: 'A simple and elegant blog',
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