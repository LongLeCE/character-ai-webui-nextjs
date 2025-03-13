import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import './globals.css';

const onest = Onest({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Chat Assistant'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='no-scrollbar'>
      <body className={onest.className}>{children}</body>
    </html>
  );
}
