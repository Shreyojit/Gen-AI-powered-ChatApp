import Providers from '@/lib/Providers';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'chatgram',
  description: 'this is a telegram clone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          
        <div className="min-h-screen flex flex-col">
                
                {children}
               
              </div>
         
        </Providers>
      </body>
    </html>
  );
}
