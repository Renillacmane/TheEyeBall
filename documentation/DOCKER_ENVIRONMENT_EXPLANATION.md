# Docker Environment Variables - Why Both `env_file` and `environment`?

## **You're Absolutely Right to Question This!**

I made an error by removing the `environment` sections from the docker-compose files. Both `env_file` and `environment` sections are needed for different purposes.

## **Why We Need Both**

### **1. `env_file` Section**
```yaml
env_file:
  - ../configs/backend/.env
```
**Purpose**: Loads environment variables from the service's `.env` file
- ✅ **Service-specific configuration** (database URLs, API keys, etc.)
- ✅ **Sensitive data** (JWT secrets, passwords)
- ✅ **Development vs Production** settings
- ✅ **Persistent configuration** that doesn't change between deployments

### **2. `environment` Section**
```yaml
environment:
  NODE_ENV: ${NODE_ENV:-production}
  PORT: 3000
```
**Purpose**: Provides runtime environment variables
- ✅ **Docker-specific variables** (container networking, ports)
- ✅ **Build-time overrides** (from host environment)
- ✅ **Default values** for missing variables
- ✅ **Container orchestration** settings

## **How They Work Together**

### **Variable Precedence** (highest to lowest):
1. **`environment`** section (highest priority)
2. **`env_file`** section
3. **Dockerfile ENV** statements
4. **System defaults**

### **Example Configuration**:
```yaml
services:
  backend:
    env_file:
      - ../backend/.env          # Loads: JWT_SECRET, MONGODB_URI, TMDB_API_KEY
    environment:
      NODE_ENV: ${NODE_ENV:-production}  # Overrides NODE_ENV from .env if set
      PORT: 3000                          # Docker-specific port setting
```

## **What Each Section Provides**

### **Backend Service**:
```yaml
env_file:
  - ../configs/backend/.env         # Service configuration
environment:
  NODE_ENV: ${NODE_ENV:-production} # Environment override
  PORT: 3000                        # Container port
```

**From `.env` file**:
- `JWT_SECRET=your-secret-key`
- `MONGODB_URI=mongodb://localhost:27017/theeyeball`
- `TMDB_API_KEY=your-api-key`
- `NODE_ENV=development` (can be overridden)

**From `environment`**:
- `NODE_ENV=production` (overrides .env if host has NODE_ENV set)
- `PORT=3000` (Docker container port)

### **Frontend Service**:
```yaml
env_file:
  - ../configs/frontend/.env        # Service configuration
environment:
  VITE_BE_ADDRESS: ${VITE_BE_ADDRESS:-http://localhost:3000}
  VITE_APP_NAME: ${VITE_APP_NAME:-TheEyeBall}
  VITE_NODE_ENV: ${NODE_ENV:-production}
```

**From `.env` file**:
- `VITE_BE_ADDRESS=http://localhost:3000`
- `VITE_APP_NAME=TheEyeBall`
- `VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p`

**From `environment`**:
- `VITE_BE_ADDRESS` (can be overridden from host)
- `VITE_APP_NAME` (can be overridden from host)
- `VITE_NODE_ENV` (inherited from host NODE_ENV)

## **Benefits of This Approach**

### **1. Flexibility**
- ✅ **Host environment** can override service settings
- ✅ **Docker-specific** variables are clearly defined
- ✅ **Service configuration** remains in service files

### **2. Security**
- ✅ **Sensitive data** stays in `.env` files (not in docker-compose)
- ✅ **Public variables** can be in `environment` section
- ✅ **Clear separation** of concerns

### **3. Maintainability**
- ✅ **Service configs** are self-contained
- ✅ **Docker orchestration** is explicit
- ✅ **Easy to understand** what overrides what

## **Example Usage Scenarios**

### **Development**:
```bash
# Set host environment
export NODE_ENV=development
export VITE_BE_ADDRESS=http://localhost:3000

# Run with overrides
docker-compose -f docker/docker-compose.dev.yml up
```

### **Production**:
```bash
# Set host environment
export NODE_ENV=production
export VITE_BE_ADDRESS=https://api.yourdomain.com

# Run with overrides
docker-compose -f docker/docker-compose.yml up
```

### **CI/CD Pipeline**:
```yaml
# GitHub Actions example
- name: Deploy
  env:
    NODE_ENV: production
    VITE_BE_ADDRESS: https://api.production.com
  run: docker-compose up -d
```

## **Summary**

**Both sections are needed because**:

- **`env_file`** = Service-specific configuration (persistent)
- **`environment`** = Docker orchestration + host overrides (dynamic)

This gives us the best of both worlds:
- ✅ **Clean separation** of concerns
- ✅ **Flexible deployment** options
- ✅ **Secure configuration** management
- ✅ **Easy maintenance** and understanding

**Thank you for catching my mistake!** 🙏
