# Authentication Implementation Guide

## Overview

This document provides a comprehensive guide to the Azure AD authentication system implemented for the Nexus frontend application. The system uses Microsoft Authentication Library (MSAL) with React for secure user authentication and JWT token management.

## Features

- **Azure AD Integration**: Secure authentication using Microsoft Azure Active Directory
- **Cookie-based Token Storage**: JWT tokens stored securely in browser cookies
- **Automatic Token Refresh**: Tokens are automatically refreshed when they expire
- **Protected Routes**: Route-level authentication protection
- **Beautiful Login UI**: Modern, responsive login interface
- **User Profile Management**: Display user information and logout functionality
- **Enhanced API Client**: Automatic token injection for API requests

## Architecture

### Components Structure

```
src/
├── authConfig.js                    # MSAL configuration
├── contexts/
│   └── AuthContext.jsx             # Authentication state management
├── components/
│   ├── Login/
│   │   ├── Login.jsx              # Login component
│   │   └── Login.css              # Login styles
│   ├── UserHeader/
│   │   ├── UserHeader.jsx         # User info & logout
│   │   └── UserHeader.css         # User header styles
│   └── ProtectedRoute.jsx         # Route protection wrapper
├── pages/
│   └── LoginPage.jsx              # Login page wrapper
└── utils/
    ├── cookieUtils.js             # Cookie management
    └── apiClient.js               # Enhanced API client
```

## Configuration

### Azure AD Configuration (`authConfig.js`)

```javascript
export const msalConfig = {
  auth: {
    clientId: "4f1608fc-16b4-4569-8867-5729673a2b3e",
    authority: "https://login.microsoftonline.com/14500012-acb8-476c-8e40-f225d32c70d3",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  }
};
```

### Environment Setup

Ensure these values are correctly configured in your Azure AD app registration:
- **Client ID**: Your app's unique identifier
- **Tenant ID**: Your organization's tenant identifier
- **Redirect URI**: Must match your application's URL
- **Scopes**: API permissions your app requires

## Usage

### Authentication Context

The `AuthContext` provides the following methods and state:

```javascript
const {
  // State
  isAuthenticated,  // Boolean: user login status
  isLoading,       // Boolean: authentication check in progress
  user,           // Object: user profile information
  accessToken,    // String: current access token
  error,         // String: authentication error message
  
  // Methods
  login,         // Function: initiate login flow
  logout,        // Function: sign out user
  getValidToken, // Function: get valid access token
} = useAuth();
```

### Protecting Routes

Wrap components that require authentication with `ProtectedRoute`:

```javascript
import ProtectedRoute from './components/ProtectedRoute';

<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardComponent />
  </ProtectedRoute>
} />
```

### Making Authenticated API Calls

Use the enhanced API client for automatic token injection:

```javascript
import { api } from './utils/apiClient';

// GET request with automatic auth header
const response = await api.get('/api/user/profile');

// POST request with data
const result = await api.post('/api/data', { 
  key: 'value' 
});

// File upload with progress
const upload = await api.upload('/api/upload', formData, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

### Cookie Management

The system automatically handles cookie operations, but you can use utilities directly:

```javascript
import { 
  setAccessTokenCookie, 
  getAccessTokenCookie, 
  clearAuthCookies 
} from './utils/cookieUtils';

// Store token
setAccessTokenCookie(token);

// Retrieve token
const token = getAccessTokenCookie();

// Clear all auth cookies
clearAuthCookies();
```

## Security Features

### Token Security
- **Automatic Expiration Check**: Tokens are validated before use
- **Secure Cookie Settings**: Cookies configured with security flags
- **Automatic Cleanup**: Invalid tokens are automatically cleared

### Route Protection
- **Redirect on Unauthorized**: Users redirected to login when not authenticated
- **Loading States**: Proper loading indicators during auth checks
- **Error Handling**: Graceful error handling for failed authentication

### API Security
- **Automatic Token Injection**: All API requests include valid tokens
- **401 Handling**: Automatic logout on unauthorized responses
- **Request Interceptors**: Built-in error handling and logging

## User Interface

### Login Page Features
- **Modern Design**: Clean, professional login interface
- **Responsive Layout**: Works on all device sizes
- **Loading States**: Visual feedback during authentication
- **Error Display**: Clear error messages for failed logins
- **Feature Highlights**: Showcase of application benefits

### User Header Features
- **User Avatar**: Displays user initials in styled avatar
- **User Information**: Shows name and email
- **Dropdown Menu**: Expandable menu with profile and logout options
- **Responsive Design**: Adapts to different screen sizes

## Customization

### Theming
The login component supports both light and dark themes automatically:

```css
/* Dark mode styles are automatically applied */
@media (prefers-color-scheme: dark) {
  .login-card {
    background: rgba(17, 24, 39, 0.95);
    color: white;
  }
}
```

### Configuration Options
Modify `authConfig.js` to customize:
- **Scopes**: Change requested permissions
- **Cache Location**: Switch between localStorage/sessionStorage
- **Redirect URIs**: Update for different environments

## Troubleshooting

### Common Issues

1. **Login Popup Blocked**
   - Ensure popup blockers are disabled
   - Check browser security settings

2. **Token Expired Errors**
   - Tokens automatically refresh
   - Check network connectivity
   - Verify Azure AD configuration

3. **Redirect Issues**
   - Verify redirect URIs in Azure AD
   - Check domain configuration
   - Ensure HTTPS in production

### Debug Mode
Enable detailed logging by modifying `authConfig.js`:

```javascript
system: {
  loggerOptions: {
    logLevel: "Verbose",
    piiLoggingEnabled: true
  }
}
```

## Deployment Considerations

### Production Setup
1. **HTTPS Required**: Azure AD requires HTTPS in production
2. **Environment Variables**: Use environment-specific configurations
3. **Cookie Security**: Enable secure flags in production
4. **CORS Configuration**: Ensure proper CORS setup on backend

### Environment Configuration
Create environment-specific config files:

```javascript
// config/production.js
export const productionConfig = {
  ...msalConfig,
  auth: {
    ...msalConfig.auth,
    redirectUri: "https://your-production-domain.com"
  }
};
```

## Best Practices

1. **Always Use ProtectedRoute**: Wrap sensitive components
2. **Handle Loading States**: Show appropriate loading indicators
3. **Error Boundaries**: Implement error boundaries for auth failures
4. **Token Validation**: Always validate tokens before API calls
5. **Logout Cleanup**: Clear all user data on logout
6. **Security Headers**: Implement proper security headers

## API Integration

### Backend Requirements
Your backend should:
1. **Validate JWT Tokens**: Verify token signature and expiration
2. **Handle 401 Responses**: Return 401 for invalid/expired tokens
3. **CORS Configuration**: Allow authentication headers
4. **Rate Limiting**: Implement proper rate limiting

### Example Backend Validation (Node.js)
```javascript
const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

## Testing

### Unit Testing
Test authentication components with mocked MSAL:

```javascript
import { render, screen } from '@testing-library/react';
import { AuthProvider } from './contexts/AuthContext';

const MockAuthProvider = ({ children, value }) => (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
```

### Integration Testing
Test full authentication flow:

```javascript
test('redirects to login when not authenticated', () => {
  render(
    <MemoryRouter initialEntries={['/protected']}>
      <App />
    </MemoryRouter>
  );
  
  expect(screen.getByText('Sign in with Microsoft')).toBeInTheDocument();
});
```

## Support

For issues or questions:
1. Check Azure AD app registration
2. Verify network connectivity
3. Review browser console for errors
4. Check MSAL documentation for advanced scenarios

## Version Compatibility

- **React**: 18+
- **@azure/msal-react**: 2.0+
- **@azure/msal-browser**: 3.0+
- **Node.js**: 16+

This authentication system provides a robust, secure foundation for your application with modern UX and enterprise-grade security.