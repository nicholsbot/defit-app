// Demo mode is enabled explicitly via env var, or as fallback when Firebase config is missing
// Now that we have env vars with defaults in config.ts, we need an explicit flag
export const DEMO_MODE =
  process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
  (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
   !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

// Demo user data for when Firebase is not available
export const DEMO_USER = {
  uid: 'demo-user-123',
  email: 'demo@example.com',
  displayName: 'Demo Soldier',
  photoURL: null,
  emailVerified: false,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => Promise.resolve(),
  getIdToken: async () => 'demo-token',
  getIdTokenResult: async () => ({
    authTime: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 3600000).toISOString(),
    issuedAtTime: new Date().toISOString(),
    signInProvider: 'demo',
    signInSecondFactor: null,
    token: 'demo-token',
    claims: {},
  }),
  reload: async () => Promise.resolve(),
  toJSON: () => ({}),
};

// Demo workout data - matches WorkoutLog interface
export const DEMO_WORKOUTS = [
  {
    id: '1',
    userProfileId: 'demo-user-123',
    week: 1,
    workoutDate: new Date().toISOString(),
    tmarMMinutes: 45,
    resistanceLbs: 200,
    cardioMilesRunning: 3,
    cardioMilesRucking: 0,
    cardioMilesWalking: 1,
    cardioMilesElliptical: 2,
    cardioMilesRowing: 0,
    cardioMetersSwimming: 500,
    cardioMilesCycling: 5,
    hiitMinutes: 25,
  },
  {
    id: '2',
    userProfileId: 'demo-user-123',
    week: 1,
    workoutDate: new Date(Date.now() - 86400000).toISOString(),
    tmarMMinutes: 30,
    resistanceLbs: 150,
    cardioMilesRunning: 2,
    cardioMilesRucking: 1,
    cardioMilesWalking: 0.5,
    cardioMilesElliptical: 1,
    cardioMilesRowing: 1,
    cardioMetersSwimming: 300,
    cardioMilesCycling: 3,
    hiitMinutes: 20,
  },
  {
    id: '3',
    userProfileId: 'demo-user-123',
    week: 2,
    workoutDate: new Date(Date.now() - 172800000).toISOString(),
    tmarMMinutes: 60,
    resistanceLbs: 250,
    cardioMilesRunning: 4,
    cardioMilesRucking: 2,
    cardioMilesWalking: 1.5,
    cardioMilesElliptical: 3,
    cardioMilesRowing: 2,
    cardioMetersSwimming: 800,
    cardioMilesCycling: 8,
    hiitMinutes: 35,
  },
];

export function isDemoMode(): boolean {
  return DEMO_MODE;
}

export function logDemoMessage(message: string) {
  if (DEMO_MODE) {
    console.log(`[DEMO MODE] ${message}`);
  }
}