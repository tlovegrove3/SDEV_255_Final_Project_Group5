# API Configuration

This directory contains the centralized API configuration for the frontend application.

## Environment-Based Configuration

The application automatically switches between development and production API URLs based on the environment:

- **Development**: `http://localhost:3000/api`
- **Production**: `https://sdev-255-final-project-group5.onrender.com/api`

## Files

### `api.js`
Main configuration file that exports:
- `apiConfig` - Centralized API configuration object
- Helper functions for making authenticated and public API requests
- Environment detection utilities

### Environment Variables
The app uses Vite environment variables:
- `VITE_API_BASE_URL` - Base URL for API requests
- `VITE_NODE_ENV` - Current environment (development/production)

## Usage

```javascript
import { apiConfig } from '../config/api';

// Make a public API request
const response = await apiConfig.fetchPublic('/courses');

// Make an authenticated API request (includes JWT token)
const response = await apiConfig.fetchWithAuth('/courses', {
  method: 'POST',
  body: JSON.stringify(data)
});

// Get API endpoint URL
const url = apiConfig.getEndpoint('/courses');

// Get headers with optional authentication
const headers = apiConfig.getHeaders(true); // true = include auth
```

## Environment Files

- `.env` - Default development configuration
- `.env.development` - Development-specific variables
- `.env.production` - Production-specific variables
- `.env.local` - Local overrides (gitignored)

## Development vs Production

**Development** (`npm run dev`):
- Uses `http://localhost:3000/api`
- Shows debug logging in console
- Loads `.env.development` variables

**Production** (`npm run build`):
- Uses `https://sdev-255-final-project-group5.onrender.com/api`
- No debug logging
- Loads `.env.production` variables

## Authentication

The `apiConfig` automatically includes JWT tokens from localStorage in authenticated requests:

```javascript
// Token is automatically included from localStorage
const response = await apiConfig.fetchWithAuth('/students/enroll', {
  method: 'POST',
  body: JSON.stringify({ courseId })
});
```

## Error Handling

All API requests should handle responses appropriately:

```javascript
const response = await apiConfig.fetchPublic('/courses');
const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || 'Request failed');
}
```