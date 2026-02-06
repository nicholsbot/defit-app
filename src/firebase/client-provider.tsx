'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { DEMO_MODE, logDemoMessage } from '@/firebase/demo-mode';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    try {
      // Initialize Firebase on the client side, once per component mount.
      if (DEMO_MODE) {
        logDemoMessage('Running in demo mode - Firebase disabled');
        return null;
      }
      return initializeFirebase();
    } catch (error) {
      console.warn('Firebase initialization failed, falling back to demo mode:', error);
      logDemoMessage('Firebase initialization failed, using demo mode');
      return null;
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices?.firebaseApp || null}
      auth={firebaseServices?.auth || null}
      firestore={firebaseServices?.firestore || null}
      demoMode={DEMO_MODE || !firebaseServices}
    >
      {children}
    </FirebaseProvider>
  );
}