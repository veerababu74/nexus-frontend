/**
 * Microsoft Authentication Library (MSAL) configuration
 * This file contains the configuration for Azure AD authentication
 */

// The main MSAL configuration object
export const msalConfig = {
  auth: {
    clientId: "4f1608fc-16b4-4569-8867-5729673a2b3e", // Application (client) ID from Azure portal
    authority: "https://login.microsoftonline.com/14500012-acb8-476c-8e40-f225d32c70d3", // Your tenant ID or 'common' for multi-tenant
    redirectUri: window.location.origin, // Use current origin for redirect (works for both dev and prod)
    postLogoutRedirectUri: window.location.origin, // Where to redirect after logout
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: true, // Set to true for IE 11 or Edge compatibility
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case "Error":
            console.error(message);
            return;
          case "Info":
            console.info(message);
            return;
          case "Verbose":
            console.debug(message);
            return;
          case "Warning":
            console.warn(message);
            return;
          default:
            return;
        }
      }
    }
  }
};

// Request configuration for login
export const loginRequest = {
  scopes: ["api://4f1608fc-16b4-4569-8867-5729673a2b3e/user_impersonation"],
  prompt: "select_account", // Forces account selection on login
};

// Request configuration for silent token requests
export const tokenRequest = {
  scopes: ["api://4f1608fc-16b4-4569-8867-5729673a2b3e/user_impersonation"],
  forceRefresh: false, // Set to true to skip cache and make a fresh request
};

// Graph API endpoints
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphPhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value"
};

// Navigation configuration
export const navigationConfig = {
  protectedRoutes: [
    "/home",
    "/regular",
    "/improved", 
    "/knowledge",
    "/tone-safety",
    "/settings",
    "/publishing",
    "/leads-logs"
  ],
  loginRoute: "/login",
  defaultProtectedRoute: "/home"
};