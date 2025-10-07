# Nginx Integration Guide

This guide explains how to integrate TheEyeBall with your existing nginx server instead of using the Docker nginx service.

## Why Use Existing Nginx?

- **Avoid port conflicts** with existing nginx
- **Centralized configuration** management
- **Better performance** with existing optimizations
- **SSL termination** at the nginx level
- **Load balancing** capabilities

## Setup Steps

### 1. Disable Docker Nginx Service

In your `docker-compose.yml`, comment out or remove the nginx service:

```yaml
# nginx:
#   image: nginx:alpine
#   container_name: theeyeball-nginx
#   # ... rest of nginx configuration
```

### 2. Configure Your Existing Nginx

Copy the configuration from `nginx-integration.conf` and adapt it:

#### Option A: Add to main nginx.conf
```bash
# Edit your main nginx configuration
sudo nano /etc/nginx/nginx.conf

# Add the server block from nginx-integration.conf
```

#### Option B: Create separate site configuration
```bash
# Copy the configuration file
sudo cp nginx-integration.conf /etc/nginx/sites-available/theeyeball

# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/theeyeball /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 3. Update Configuration Values

Edit the configuration file and update these values:

- **`server_name`**: Your actual domain name
- **`root` path**: Path to your frontend build files
- **Backend port**: Update if you changed `BACKEND_PORT`
- **SSL certificates**: If using HTTPS

### 4. Frontend Build Path

The frontend needs to be built and served by your nginx:

```bash
# Build the frontend
cd frontend
npm run build

# Copy to nginx web root (adjust path as needed)
sudo cp -r dist/* /var/www/theeyeball/
```

### 5. Environment Variables

Make sure your environment variables are set:

```bash
# Set backend port (if different from 3000)
export BACKEND_PORT=3000

# Set frontend build address
export VITE_BE_ADDRESS=http://your-domain.com/api
```

## Configuration Options

### Port Configuration
- **Backend**: Controlled by `BACKEND_PORT` environment variable
- **Frontend**: Served on your nginx's configured port (usually 80/443)

### SSL/HTTPS
- Uncomment and configure the SSL server block
- Update certificate paths
- Consider using Let's Encrypt for free SSL

### Load Balancing
- Add multiple backend servers to the upstream block
- Configure health checks and failover

## Testing

1. **Start your Docker services**:
   ```bash
   docker-compose up -d
   ```

2. **Test backend health**:
   ```bash
   curl http://your-domain.com/health
   ```

3. **Test frontend**:
   ```bash
   curl http://your-domain.com/
   ```

4. **Test API**:
   ```bash
   curl http://your-domain.com/api/
   ```

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**: Backend not running or wrong port
2. **404 on frontend**: Wrong root path or build not copied
3. **CORS errors**: Check `VITE_BE_ADDRESS` configuration

### Debug Commands

```bash
# Check nginx configuration
sudo nginx -t

# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Check if backend is running
docker ps | grep backend

# Test backend directly
curl http://localhost:3000/health
```

## Benefits of This Approach

- ✅ **No port conflicts** with existing services
- ✅ **Centralized SSL management**
- ✅ **Better performance** with existing nginx optimizations
- ✅ **Easier maintenance** with familiar nginx configuration
- ✅ **Load balancing** and high availability options
