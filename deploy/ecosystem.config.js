// PM2 Ecosystem configuration for TheEyeBall
// Process management for production deployment

module.exports = {
  apps: [
    {
      name: 'theeyeball-backend',
      script: './bin/www',
      cwd: './backend',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      
      // Logging
      log_file: './logs/backend-combined.log',
      out_file: './logs/backend-out.log',
      error_file: './logs/backend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Advanced features
      watch: false, // Disable in production
      ignore_watch: ['node_modules', 'logs'],
      
      // Auto restart on file changes (disabled in production)
      watch_options: {
        followSymlinks: false
      },
      
      // Source map support
      source_map_support: true,
      
      // Kill timeout
      kill_timeout: 5000,
      
      // Listen timeout
      listen_timeout: 3000,
      
      // Graceful shutdown
      shutdown_with_message: true,
      
      // Merge logs
      merge_logs: true,
      
      // Time format
      time: true
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:your-username/theeyeball.git',
      path: '/var/www/theeyeball',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'post-setup': 'npm install'
    },
    
    staging: {
      user: 'deploy',
      host: ['staging-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:your-username/theeyeball.git',
      path: '/var/www/theeyeball-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging'
      }
    }
  }
};
