import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'] 
});

export const metadata: Metadata = {
  title: 'WOD[X] PRO',
  description: 'Transforme esforço físico em valor digital real.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={spaceGrotesk.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

