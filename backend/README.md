# TheEyeBall Backend

Node.js/Express backend API for TheEyeBall movie discovery platform.

## Quick Start

### Development
```bash
npm run dev
```
Runs the server with nodemon for hot-reloading.

### Production
```bash
npm start
```
Runs the production server directly from source (standard Node.js behavior).

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Environment Setup

1. Copy the environment template:
   ```bash
   cp env.template .env
   ```

2. Edit `.env` with your configuration values.

## Project Structure

```
backend/
├── bin/           # Server entry point
├── routes/        # API routes
├── services/      # Business logic
├── models/        # Mongoose models
├── middleware/    # Express middleware
├── providers/     # External service integrations (TMDB)
├── auth/          # Authentication strategies
├── database/      # Database initialization
├── utils/         # Utility functions
└── scripts/       # Utility scripts
```

## Notes

- The backend runs directly without a build step (standard Node.js behavior)
- Node.js executes JavaScript directly, so no compilation or bundling is needed
- Code runs from the source directory in both development and production
