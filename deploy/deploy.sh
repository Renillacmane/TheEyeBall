#!/bin/bash

# TheEyeBall Production Deployment Script
# Automated deployment script for production server

set -e  # Exit on any error

# Configuration
APP_NAME="theeyeball"
DEPLOY_USER="deploy"
SERVER_HOST="your-server.com"
APP_PATH="/var/www/$APP_NAME"
BACKUP_PATH="/var/backups/$APP_NAME"
LOG_PATH="/var/log/$APP_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root"
   exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
check_requirements() {
    log "Checking requirements..."
    
    if ! command_exists docker; then
        error "Docker is not installed"
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    if ! command_exists pm2; then
        error "PM2 is not installed"
        exit 1
    fi
    
    success "All requirements met"
}

# Backup current deployment
backup_current() {
    log "Creating backup of current deployment..."
    
    if [ -d "$APP_PATH" ]; then
        BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
        sudo mkdir -p "$BACKUP_PATH"
        sudo cp -r "$APP_PATH" "$BACKUP_PATH/$BACKUP_NAME"
        success "Backup created: $BACKUP_PATH/$BACKUP_NAME"
    else
        warning "No existing deployment found to backup"
    fi
}

# Pull latest code
pull_code() {
    log "Pulling latest code..."
    
    cd "$APP_PATH"
    git fetch origin
    git reset --hard origin/main
    success "Code updated to latest version"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd "$APP_PATH"
    
    # Backend dependencies
    cd backend
    npm ci --production
    success "Backend dependencies installed"
    
    # Frontend dependencies and build
    cd ../frontend
    npm ci
    npm run build
    success "Frontend built successfully"
    
    cd ..
}

# Build and start Docker containers
deploy_containers() {
    log "Building and starting Docker containers..."
    
    cd "$APP_PATH"
    
    # Stop existing containers
    docker-compose down || true
    
    # Build and start new containers
    docker-compose up -d --build
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        success "Docker containers started successfully"
    else
        error "Failed to start Docker containers"
        docker-compose logs
        exit 1
    fi
}

# Setup PM2 for backend
setup_pm2() {
    log "Setting up PM2 process management..."
    
    cd "$APP_PATH"
    
    # Create logs directory
    mkdir -p logs
    
    # Stop existing PM2 processes
    pm2 stop all || true
    pm2 delete all || true
    
    # Start with PM2
    pm2 start deploy/ecosystem.config.js --env production
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    success "PM2 setup completed"
}

# Setup Nginx
setup_nginx() {
    log "Setting up Nginx reverse proxy..."
    
    # Copy nginx configuration
    sudo cp "$APP_PATH/deploy/nginx.conf" /etc/nginx/sites-available/$APP_NAME
    sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    
    # Remove default nginx site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    if sudo nginx -t; then
        sudo systemctl reload nginx
        success "Nginx configuration updated"
    else
        error "Nginx configuration test failed"
        exit 1
    fi
}

# Setup SSL certificates (Let's Encrypt)
setup_ssl() {
    log "Setting up SSL certificates..."
    
    if command_exists certbot; then
        sudo certbot --nginx -d your-domain.com -d www.your-domain.com --non-interactive --agree-tos --email admin@your-domain.com
        success "SSL certificates configured"
    else
        warning "Certbot not found. Please install and configure SSL certificates manually"
    fi
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Check if backend is responding
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        success "Backend health check passed"
    else
        error "Backend health check failed"
        exit 1
    fi
    
    # Check if frontend is responding
    if curl -f http://localhost:80 >/dev/null 2>&1; then
        success "Frontend health check passed"
    else
        error "Frontend health check failed"
        exit 1
    fi
}

# Cleanup old backups
cleanup_backups() {
    log "Cleaning up old backups..."
    
    # Keep only last 5 backups
    sudo find "$BACKUP_PATH" -maxdepth 1 -type d -name "backup-*" | sort -r | tail -n +6 | sudo xargs rm -rf
    
    success "Old backups cleaned up"
}

# Main deployment function
main() {
    log "Starting TheEyeBall deployment..."
    
    check_requirements
    backup_current
    pull_code
    install_dependencies
    deploy_containers
    setup_pm2
    setup_nginx
    setup_ssl
    health_check
    cleanup_backups
    
    success "Deployment completed successfully!"
    log "Application is now running at: https://your-domain.com"
}

# Run main function
main "$@"
