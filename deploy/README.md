# TheEyeBall-BE Production Deployment

This directory contains all the necessary files for deploying TheEyeBall-BE to a production server.

## Files Overview

### Core Configuration Files
- `nginx.conf` - Nginx reverse proxy configuration with SSL support
- `ecosystem.config.js` - PM2 process management configuration
- `deploy.sh` - Automated deployment script

### SSL Directory
- `ssl/` - Directory for SSL certificates (create this directory and add your certificates)

## Prerequisites

### Server Requirements
- Ubuntu 20.04+ or CentOS 8+
- Docker and Docker Compose
- Node.js 18+ and PM2
- Nginx
- Git
- SSL certificates (Let's Encrypt recommended)

### Domain Setup
- Point your domain to the server IP
- Ensure ports 80, 443, and 22 are open

## Quick Deployment

1. **Clone the repository on your server:**
   ```bash
   git clone https://github.com/your-username/theeyeball.git /var/www/theeyeball
   cd /var/www/theeyeball
   ```

2. **Set up environment variables:**
   ```bash
   cp TheEyeBall-BE/env.template TheEyeBall-BE/.env
   cp TheEyeBall-FE/env.template TheEyeBall-FE/.env
   # Edit the .env files with your actual values
   ```

3. **Make deployment script executable:**
   ```bash
   chmod +x deploy/deploy.sh
   ```

4. **Run the deployment script:**
   ```bash
   ./deploy/deploy.sh
   ```

## Manual Deployment Steps

### 1. Environment Setup
```bash
# Create application directory
sudo mkdir -p /var/www/theeyeball
sudo chown $USER:$USER /var/www/theeyeball

# Clone repository
git clone https://github.com/your-username/theeyeball.git /var/www/theeyeball
cd /var/www/theeyeball
```

### 2. Install Dependencies
```bash
# Backend
cd TheEyeBall-BE
npm ci --production

# Frontend
cd ../TheEyeBall-FE
npm ci
npm run build
```

### 3. Docker Deployment
```bash
# Build and start containers
docker-compose -f docker/docker-compose.yml up -d --build

# Check status
docker-compose ps
```

### 4. PM2 Setup
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start deploy/ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

### 5. Nginx Configuration
```bash
# Copy nginx configuration
sudo cp deploy/nginx.conf /etc/nginx/sites-available/theeyeball
sudo ln -s /etc/nginx/sites-available/theeyeball /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test and reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Setup (Let's Encrypt)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Environment Variables

### Backend (.env)
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secure-jwt-secret-key
APP_NAME=TheEyeBall-BE
MONGODB_URI=mongodb://username:password@localhost:27017/theeyeball
TMDB_API_KEY=your-tmdb-api-key
DEBUG_PRINT=false
LOG_LEVEL=info
```

### Frontend (.env)
```bash
VITE_BE_ADDRESS=https://your-api-domain.com
VITE_APP_NAME=TheEyeBall-BE-BE
VITE_NODE_ENV=production
```

## Monitoring and Maintenance

### Health Checks
- Backend: `curl http://localhost:3000/health`
- Frontend: `curl http://localhost:80`
- Full stack: `curl https://your-domain.com/health`

### Logs
- PM2 logs: `pm2 logs`
- Nginx logs: `sudo tail -f /var/log/nginx/access.log`
- Docker logs: `docker-compose logs -f`

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or use PM2
pm2 restart all
```

## Security Considerations

1. **Firewall Setup:**
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **Regular Updates:**
   - Keep system packages updated
   - Update Docker images regularly
   - Monitor security advisories

3. **Backup Strategy:**
   - Database backups
   - Application code backups
   - SSL certificate backups

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Check if ports 80, 443, 3000 are available
   - Use `netstat -tulpn | grep :PORT` to check

2. **Permission issues:**
   - Ensure proper file ownership
   - Check SELinux/AppArmor settings

3. **SSL certificate issues:**
   - Verify domain DNS settings
   - Check certificate expiration
   - Ensure proper nginx SSL configuration

### Log Locations
- Application logs: `/var/log/theeyeball/`
- Nginx logs: `/var/log/nginx/`
- PM2 logs: `~/.pm2/logs/`
- Docker logs: `docker-compose logs`

## Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Ensure all services are running
4. Check network connectivity
5. Review security group/firewall settings
