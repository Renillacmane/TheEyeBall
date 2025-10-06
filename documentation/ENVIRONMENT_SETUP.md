# TheEyeBall-BE Environment Configuration Guide

## Overview

TheEyeBall-BE uses a **simple environment configuration system** with separate `.env` files for each service:

1. **Backend `.env`** - Backend-specific configuration
2. **Frontend `.env`** - Frontend-specific configuration

## Environment File Structure

```
/Users/renillacmane/Documents/Runtime/Projects/TheEyeBall/
├── configs/
│   ├── backend/
│   │   ├── .env              # Backend environment
│   │   └── env.template      # Backend environment template
│   └── frontend/
│       ├── .env              # Frontend environment
│       └── env.template      # Frontend environment template
├── TheEyeBall-BE/               # Backend application
└── TheEyeBall-FE/            # Frontend application
```

## 1. Backend Environment File (`configs/backend/.env`)

**Purpose**: Backend-specific configuration for:
- Node.js application runtime
- Database connections
- API keys and secrets
- Logging configuration

**Usage**:
```bash
cd configs/backend
cp env.template .env
nano .env
```

**Key Variables**:
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your-jwt-secret
MONGODB_URI=mongodb://localhost:27017/theeyeball
TMDB_API_KEY=your-tmdb-api-key
DEBUG_PRINT=false
LOG_LEVEL=info
```

## 2. Frontend Environment File (`configs/frontend/.env`)

**Purpose**: Frontend-specific configuration for:
- Vite build process
- API endpoints
- Application metadata
- External service URLs

**Usage**:
```bash
cd configs/frontend
cp env.template .env
nano .env
```

**Key Variables**:
```bash
VITE_BE_ADDRESS=http://localhost:3000
VITE_APP_NAME=TheEyeBall-BE
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

## Docker Integration

### How Environment Variables Flow in Docker

1. **Root `.env`** → **Docker Compose** → **Container Environment**
2. **Build Arguments** → **Dockerfile** → **Build-time Environment**
3. **Runtime Environment** → **Application**

### Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.backend
    #env_file:
      #- ../configs/backend/.env

  frontend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.frontend
    #env_file:
      #- ../configs/frontend/.env
```

### Dockerfile Build Arguments

**Backend Dockerfile**:
```dockerfile
# Accept build arguments
ARG NODE_ENV=production

# Use in build process
RUN npm run build 2>/dev/null || echo "No build script found, skipping..."
```

**Frontend Dockerfile**:
```dockerfile
# Accept Vite environment variables as build arguments
ARG VITE_BE_ADDRESS=http://localhost:3000
ARG VITE_APP_NAME=TheEyeBall-BE

# Set as environment variables for build
ENV VITE_BE_ADDRESS=$VITE_BE_ADDRESS
ENV VITE_APP_NAME=$VITE_APP_NAME

# Build with environment variables
RUN npm run build
```

## Environment Variable Priority

1. **Container environment** (highest priority)
2. **env_file** in docker-compose
3. **environment** in docker-compose
4. **Build arguments** in Dockerfile
5. **Default values** in templates (lowest priority)

## Setup Instructions

### 1. Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd theeyeball

# Create backend environment file
cp configs/backend/env.template configs/backend/.env
nano configs/backend/.env  # Edit with your values

# Create frontend environment file
cp configs/frontend/env.template configs/frontend/.env
nano configs/frontend/.env  # Edit with your values
```

### 2. Development Setup
```bash
# Start development environment
docker-compose -f docker/docker-compose.yml up -d

# Or run locally
cd TheEyeBall-BE && npm run dev
cd TheEyeBall-FE && npm run dev
```

### 3. Production Setup
```bash
# Start production environment
docker-compose -f docker/docker-compose.yml up -d

# Or use deployment script
./deploy/deploy.sh
```

## Security Best Practices

### 1. Environment File Security
- **Never commit `.env` files** to version control
- **Use strong, unique secrets** for JWT_SECRET
- **Rotate secrets regularly** in production
- **Use different secrets** for different environments

### 2. Production Secrets
```bash
# Generate secure JWT secret
openssl rand -base64 32

# Use environment-specific values
NODE_ENV=production
DEBUG_PRINT=false
LOG_LEVEL=info
```

### 3. Docker Security
- **Use multi-stage builds** to reduce image size
- **Run as non-root user** in containers
- **Use secrets management** for sensitive data
- **Enable health checks** for monitoring

## Troubleshooting

### Common Issues

1. **Environment variables not loading**:
   ```bash
   # Check if .env file exists and has correct format
   cat .env
   
   # Verify docker-compose is loading the file
   docker-compose config
   ```

2. **Build-time vs Runtime variables**:
   - **Vite variables** (VITE_*) must be available at **build time**
   - **Node.js variables** are available at **runtime**

3. **Variable substitution not working**:
   ```bash
   # Check variable syntax in docker-compose.yml
   # Use ${VARIABLE_NAME} not $VARIABLE_NAME
   ```

### Debug Commands
```bash
# Check environment variables in container
docker-compose exec backend env
docker-compose exec frontend env

# Check build arguments
docker-compose build --no-cache --progress=plain

# Verify configuration
docker-compose config
```

## Environment-Specific Configurations

### Development
```bash
NODE_ENV=development
DEBUG_PRINT=true
LOG_LEVEL=debug
VITE_BE_ADDRESS=http://localhost:3000
```

### Staging
```bash
NODE_ENV=staging
DEBUG_PRINT=false
LOG_LEVEL=info
VITE_BE_ADDRESS=https://staging-api.yourdomain.com
```

### Production
```bash
NODE_ENV=production
DEBUG_PRINT=false
LOG_LEVEL=warn
VITE_BE_ADDRESS=https://api.yourdomain.com
```

This hierarchical environment system provides flexibility, security, and maintainability for TheEyeBall-BE across different deployment scenarios.
