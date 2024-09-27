import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Minimal RAG Next.js',
  description: 'Minimal RAG Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} pt-16`}>
        {' '}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-4xl font-thin text-primary">Minimal RAG</h1>
            <nav>
              <a
                href="https://martinkondor.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Made by Martin Kondor
              </a>
            </nav>
          </div>
        </header>
        <main className="min-h-screen -mt-1">{children}</main>
      </body>
    </html>
  );
}
