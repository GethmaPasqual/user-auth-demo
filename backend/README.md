# Backend API

## Overview
Express.js backend API with Asgardeo JWT authentication.

## Setup
1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `config/.env`:
```
ASGARDEO_AUDIENCE=your_audience
ASGARDEO_ISSUER=https://api.asgardeo.io/t/YOUR_ORG
PORT=4000
```

## Run
```bash
npm start        # Production
npm run dev      # Development with auto-reload
```

## API Endpoints
- `GET /` - Public endpoint
- `GET /api/protected` - Protected endpoint (requires JWT token)
