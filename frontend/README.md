# Frontend

## Overview
React frontend application with Asgardeo authentication.

## Setup
1. Install dependencies:
```bash
npm install
```

2. Configure Asgardeo in `src/asgardeoConfig.js`:
   - Update `clientID` with your Asgardeo application's Client ID
   - Update `signInRedirectURL` and `signOutRedirectURL` if needed

## Run
```bash
npm start        # Start development server
npm run build    # Create production build
```

The app will run at `http://localhost:3000`
