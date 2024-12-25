interface IEnv {
    apiUrl: string;
    apiOpenIdConnectUrl: string;
    appUrlCallback: string;
}

const requireEnv = (key: string): string => {
    const value = import.meta.env[key];
    if (!value) {
        alert(`Missing required environment variable: ${key}`);
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

// Explicitly validate environment variables
export const envConfig: IEnv = {
    apiUrl: requireEnv('VITE_API_URL'),
    apiOpenIdConnectUrl: requireEnv('VITE_API_OPENIDCONNECT_URL'),
    appUrlCallback: requireEnv('VITE_APP_URL_CALLBACK'),
};
