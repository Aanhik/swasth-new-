import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import RouteProgress from '@/components/route-progress'
import RouteLoading from '@/components/route-loading'

export const metadata: Metadata = {
  title: 'SWASTH',
  description: 'Your friendly AI health assistant.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
  <RouteProgress />
  <RouteLoading />
  {children}
        <Toaster />
      </body>
    </html>
  );
}
