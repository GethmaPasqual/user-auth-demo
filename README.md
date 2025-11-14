# User Auth Demo

A full-stack application demonstrating user authentication with **Asgardeo**.

## Project Structure
```
user-auth-demo/
├── backend/              # Express.js API server
│   ├── src/
│   │   └── server.js    # Main server file
│   ├── config/
│   │   └── .env         # Backend environment variables
│   ├── package.json
│   └── README.md
│
├── frontend/            # React application
│   ├── src/             # React components and logic
│   ├── public/          # Static assets
│   ├── config/
│   │   └── .env         # Frontend environment variables
│   ├── package.json
│   └── README.md
│
└── README.md            # This file
```

## Quick Start

### Backend Setup
```bash
cd backend
npm install
# Configure backend/config/.env with Asgardeo settings
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
# Configure frontend/src/asgardeoConfig.js with your Client ID
npm start
```

## Asgardeo Configuration
1. Go to [Asgardeo Console](https://console.asgardeo.io)
2. Create a **Single Page Application (SPA)**
3. Add `http://localhost:3000` to Allowed Origins and Redirect URLs
4. Copy the **Client ID** and update it in `frontend/src/asgardeoConfig.js`

## Features
- ✅ User login/logout with Asgardeo
- ✅ JWT token validation
- ✅ Protected API routes
- ✅ React-based frontend

## Documentation
- Backend: See [backend/README.md](backend/README.md)
- Frontend: See [frontend/README.md](frontend/README.md)
