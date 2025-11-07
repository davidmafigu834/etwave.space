# EtWave - Production Deployment Guide

## 🚀 Deploying to Shared Hosting

This guide will help you deploy EtWave to a shared hosting environment.

### Prerequisites

- PHP 8.1 or higher
- MySQL 5.7 or higher
- Node.js 18 or higher (for building assets)
- SSH access to your hosting server
- Domain name configured

### 📋 Pre-Deployment Checklist

- [ ] Domain purchased and configured
- [ ] Hosting account created
- [ ] Database created on hosting server
- [ ] FTP/SFTP credentials ready
- [ ] SSL certificate (Let's Encrypt or purchased)

### 🛠️ Step 1: Prepare Your Local Environment

1. **Clone your repository** (if using Git):
   ```bash
   git clone your-repository-url
   cd your-project-directory
   ```

2. **Install dependencies locally**:
   ```bash
   composer install
   npm install
   ```

3. **Build production assets**:
   ```bash
   npm run build
   ```

4. **Copy environment file**:
   ```bash
   cp .env.production .env
   ```

5. **Configure your .env file** with production values:
   - Database credentials
   - App URL
   - Payment gateway keys
   - Email settings
   - Other service configurations

### 📤 Step 2: Upload Files to Server

**Option A: Using the deployment script (Recommended)**

1. Make the deployment script executable:
   ```bash
   chmod +x deploy-production.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy-production.sh
   ```

3. Upload the entire project directory to your server

**Option B: Manual Upload**

Upload all files except those in `.gitignore.production` to your server using FTP/SFTP.

### ⚙️ Step 3: Server Configuration

1. **Set document root** to the `public` directory
2. **Configure PHP settings** (if needed):
   - Memory limit: 256M or higher
   - Max execution time: 300 seconds
   - Max file upload size: 50M
   - Max post size: 50M

3. **Database setup**:
   - Create database on your hosting panel
   - Update `.env` with database credentials
   - Run migrations: `php artisan migrate`

### 🔐 Step 4: Security Setup

1. **File permissions**:
   ```bash
   chmod -R 755 storage/
   chmod -R 755 bootstrap/cache/
   chmod 644 .env
   ```

2. **SSL Certificate**:
   - Install SSL certificate
   - Update APP_URL to use HTTPS
   - Force HTTPS in .htaccess if needed

### 🏃‍♂️ Step 5: Final Setup

1. **Generate app key** (if not done):
   ```bash
   php artisan key:generate
   ```

2. **Create storage link**:
   ```bash
   php artisan storage:link
   ```

3. **Clear and cache config**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

4. **Test your application**:
   - Visit your domain
   - Test user registration
   - Test payment flows
   - Check all features

### 📊 Step 6: Post-Deployment Tasks

1. **Set up backups**:
   - Database backups
   - File backups
   - Automated backup scripts

2. **Configure monitoring**:
   - Error logging
   - Performance monitoring
   - Uptime monitoring

3. **SEO and Analytics**:
   - Set up Google Analytics
   - Configure meta tags
   - Submit sitemap to search engines

### 🔧 Troubleshooting

**Common Issues:**

1. **404 Errors**: Check document root is set to `public/`
2. **500 Errors**: Check file permissions and `.env` configuration
3. **Assets not loading**: Run `npm run build` and upload assets
4. **Database connection**: Verify database credentials in `.env`

**Debug Commands:**
```bash
# Check PHP version
php -v

# Check Laravel version
php artisan --version

# Clear all caches
php artisan optimize:clear

# Check environment
php artisan env
```

### 📞 Support

If you encounter issues during deployment:

1. Check the Laravel logs: `storage/logs/laravel.log`
2. Verify your `.env` configuration
3. Ensure all dependencies are installed
4. Check file and folder permissions

### 🎉 Success!

Your EtWave application is now live! Make sure to:

- Regularly update dependencies
- Monitor performance and errors
- Keep backups current
- Stay updated with security patches

**Happy deploying! 🚀**
