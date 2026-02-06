import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { WorkoutProvider } from '@/hooks/use-workout-log';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import InstallPrompt from '@/components/pwa/InstallPrompt';

export const metadata: Metadata = {
  title: 'DEFIT 2026',
  description: 'Annual DEFIT Fitness Challenge',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DEFIT',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F0A30A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body suppressHydrationWarning className={cn("font-body antialiased min-h-screen bg-background")}>
        <FirebaseClientProvider>
          <WorkoutProvider>
            {children}
          </WorkoutProvider>
        </FirebaseClientProvider>
        <Toaster />
        <ServiceWorkerRegistration />
        <InstallPrompt />
      </body>
    </html>
  );
}
