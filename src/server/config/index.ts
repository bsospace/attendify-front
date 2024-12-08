export const config = {
  port: import.meta.env.VITE_PORT || 3000,
  jwtSecret: import.meta.env.VITE_JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: '1d',
  cookieMaxAge: 24 * 60 * 60 * 1000, // 1 day
  email: {
    host: import.meta.env.VITE_EMAIL_HOST,
    port: parseInt(import.meta.env.VITE_EMAIL_PORT || '587'),
    user: import.meta.env.VITE_EMAIL_USER,
    pass: import.meta.env.VITE_EMAIL_PASS,
  },
  clientUrl: import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173',
  appName: import.meta.env.VITE_APP_NAME || 'Your App Name',
  appTagline: import.meta.env.VITE_APP_TAGLINE || 'Your App Tagline',
  appLogo: import.meta.env.VITE_APP_LOGO || '/logo.svg',
} as const;