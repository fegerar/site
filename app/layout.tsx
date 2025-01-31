import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ViewTransitions } from 'next-view-transitions';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Github, Linkedin, TwitterX } from 'react-bootstrap-icons';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://federicogerardi.ovh'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Federico Gerardi',
    template: '%s | Federico Gerardi',
  },
  description: 'Computer Scientist, Data Scientist, Systems Engineer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${inter.className}`}>
        <body className="antialiased tracking-tight">
          <div className="min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8 bg-white text-gray-900">
            <main className="max-w-[60ch] mx-auto w-full space-y-6">
              {children}
            </main>
            <Footer />
            <Analytics />
            <SpeedInsights />
          </div>
        </body>
      </html>
    </ViewTransitions>
  );
}

function Footer() {
  const links = [
    { icon: <TwitterX size={25} />, url: 'https://x.com/f3gerar' },
    { icon: <Linkedin size={25} />, url: 'https://www.linkedin.com/in/federico-gerardi-81407a1a1/' },
    { icon: <Github size={25} />, url: 'https://github.com/fegerar' },
  ];

  return (
    <footer className="mt-12 text-center">
      <div className="flex justify-center space-x-4 tracking-tight">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </footer>
  );
}
