/**
 * Asgardeo Authentication Configuration
 */
export const authConfig = {
  jwksUri: "https://api.asgardeo.io/t/testforfinalproject/oauth2/jwks",
  audience: "KYEfJzks5uXRratlXxNpS9dvpRQa",
  issuer: "https://api.asgardeo.io/t/testforfinalproject/oauth2/token",
  algorithms: ["RS256"] as const
};

/**
 * Server Configuration
 */
export const serverConfig = {
  port: process.env.PORT || 8080,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000"
};
