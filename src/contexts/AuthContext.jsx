import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useMsal, useIsAuthenticated, useAccount } from '@azure/msal-react';
import { loginRequest, tokenRequest } from '../authConfig';
import {
  setAccessTokenCookie,
  getAccessTokenCookie,
  setIdTokenCookie,
  getIdTokenCookie,
  setUserInfoCookie,
  getUserInfoCookie,
  setAuthStateCookie,
  getAuthStateCookie,
  clearAuthCookies,
  isTokenExpired,
  isValidTokenStructure
} from '../utils/cookieUtils';

/**
 * Authentication Context to manage user authentication state across the application
 */
const AuthContext = createContext({});

/**
 * Custom hook to use the AuthContext
 * @returns {object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * Manages authentication state and provides methods for login/logout
 */
export const AuthProvider = ({ children }) => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount(accounts[0] || {});
  
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    accessToken: null,
    error: null
  });

  /**
   * Update authentication state
   */
  const updateAuthState = useCallback((newState) => {
    setAuthState(prevState => ({ ...prevState, ...newState }));
  }, []);

  /**
   * Acquire access token silently
   */
  const acquireToken = useCallback(async () => {
    if (accounts.length === 0) {
      console.log('No signed-in account found');
      return null;
    }

    try {
      const response = await instance.acquireTokenSilent({
        ...tokenRequest,
        account: accounts[0],
      });

      if (response.accessToken) {
        setAccessTokenCookie(response.accessToken);
        if (response.idToken) {
          setIdTokenCookie(response.idToken);
        }
        return response.accessToken;
      }
    } catch (error) {
      console.error('Silent token acquisition failed:', error);
      
      // If silent acquisition fails, try to acquire token interactively
      try {
        const interactiveResponse = await instance.acquireTokenPopup(tokenRequest);
        if (interactiveResponse.accessToken) {
          setAccessTokenCookie(interactiveResponse.accessToken);
          if (interactiveResponse.idToken) {
            setIdTokenCookie(interactiveResponse.idToken);
          }
          return interactiveResponse.accessToken;
        }
      } catch (interactiveError) {
        console.error('Interactive token acquisition failed:', interactiveError);
        updateAuthState({ error: 'Failed to acquire token' });
      }
    }
    
    return null;
  }, [instance, accounts, updateAuthState]);

  /**
   * Handle user login
   */
  const login = useCallback(async () => {
    try {
      updateAuthState({ isLoading: true, error: null });
      
      const response = await instance.loginPopup(loginRequest);
      
      if (response && response.account) {
        console.log('Login successful:', response);
        
        // Store tokens in cookies
        if (response.accessToken) {
          setAccessTokenCookie(response.accessToken);
        }
        if (response.idToken) {
          setIdTokenCookie(response.idToken);
        }
        
        // Store user info
        const userInfo = {
          id: response.account.homeAccountId,
          name: response.account.name,
          username: response.account.username,
          email: response.account.username, // Usually the email for Azure AD
        };
        setUserInfoCookie(userInfo);
        setAuthStateCookie(true);
        
        updateAuthState({
          isAuthenticated: true,
          user: userInfo,
          accessToken: response.accessToken,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      updateAuthState({
        isLoading: false,
        error: error.message || 'Login failed'
      });
    }
  }, [instance, updateAuthState]);

  /**
   * Handle user logout
   */
  const logout = useCallback(async () => {
    try {
      updateAuthState({ isLoading: true });
      
      // Clear cookies first
      clearAuthCookies();
      
      // Update state
      updateAuthState({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        isLoading: false,
        error: null
      });
      
      // Perform MSAL logout
      await instance.logoutPopup({
        postLogoutRedirectUri: window.location.origin,
        mainWindowRedirectUri: window.location.origin
      });
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      clearAuthCookies();
      updateAuthState({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        isLoading: false,
        error: null
      });
    }
  }, [instance, updateAuthState]);

  /**
   * Get a valid access token (refresh if needed)
   */
  const getValidToken = useCallback(async () => {
    const storedToken = getAccessTokenCookie();
    
    if (storedToken && isValidTokenStructure(storedToken) && !isTokenExpired(storedToken)) {
      return storedToken;
    }
    
    // Token is invalid or expired, try to get a new one
    const newToken = await acquireToken();
    return newToken;
  }, [acquireToken]);

  /**
   * Initialize authentication state from cookies and MSAL
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated via MSAL
        if (isAuthenticated && account) {
          const userInfo = {
            id: account.homeAccountId,
            name: account.name,
            username: account.username,
            email: account.username,
          };
          
          setUserInfoCookie(userInfo);
          setAuthStateCookie(true);
          
          // Try to get a fresh token
          const token = await acquireToken();
          
          updateAuthState({
            isAuthenticated: true,
            user: userInfo,
            accessToken: token,
            isLoading: false,
            error: null
          });
        } else {
          // Check cookies for stored auth state
          const cookieAuthState = getAuthStateCookie();
          const storedUser = getUserInfoCookie();
          const storedToken = getAccessTokenCookie();
          
          if (cookieAuthState && storedUser) {
            // Validate stored token
            if (storedToken && isValidTokenStructure(storedToken) && !isTokenExpired(storedToken)) {
              updateAuthState({
                isAuthenticated: true,
                user: storedUser,
                accessToken: storedToken,
                isLoading: false,
                error: null
              });
            } else {
              // Token invalid, clear state
              clearAuthCookies();
              updateAuthState({
                isAuthenticated: false,
                user: null,
                accessToken: null,
                isLoading: false,
                error: null
              });
            }
          } else {
            // No authentication found
            updateAuthState({
              isAuthenticated: false,
              user: null,
              accessToken: null,
              isLoading: false,
              error: null
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthCookies();
        updateAuthState({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          isLoading: false,
          error: 'Authentication initialization failed'
        });
      }
    };

    initializeAuth();
  }, [isAuthenticated, account, acquireToken, updateAuthState]);

  /**
   * Context value object
   */
  const contextValue = {
    // State
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    accessToken: authState.accessToken,
    error: authState.error,
    
    // Methods
    login,
    logout,
    getValidToken,
    acquireToken,
    
    // MSAL objects (for advanced use cases)
    instance,
    accounts,
    account
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;