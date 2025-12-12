// Configuration file to help debug environment variables
export const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    aiUrl: import.meta.env.VITE_AI_URL || 'http://localhost:5001',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
};

// Log configuration on load (only in development)
if (config.isDevelopment) {
    console.log('🔧 App Configuration:', config);
    console.log('📝 All env vars:', import.meta.env);
}
