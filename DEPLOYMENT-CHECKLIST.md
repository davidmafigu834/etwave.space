# 🚀 EtWave Shared Hosting Deployment Checklist

## 📋 Pre-Deployment Preparation

### ✅ Local Development Setup
- [x] Build production assets: `npm run build`
- [x] Test application locally
- [x] Create production .env template
- [x] Remove development files

### ✅ Hosting Account Setup
- [ ] Domain purchased and registered
- [ ] Shared hosting account created
- [ ] FTP/SFTP credentials obtained
- [ ] Hosting control panel access (cPanel/Plesk/DirectAdmin)
- [ ] SSL certificate (Let's Encrypt or paid)

### ✅ Server Requirements Check
- [ ] PHP 8.2 or higher available
- [ ] MySQL 5.7+ or MariaDB available
- [ ] Required PHP extensions:
  - [ ] pdo_mysql
  - [ ] mbstring
  - [ ] openssl
  - [ ] tokenizer
  - [ ] xml
  - [ ] ctype
  - [ ] json
  - [ ] bcmath
  - [ ] fileinfo
  - [ ] gd (for image processing)

## 📤 File Upload Process

### ✅ Upload Method Selection
- [ ] **FTP/SFTP** - Recommended for large files
- [ ] **File Manager** - Use hosting control panel
- [ ] **Git Deployment** - If supported by host

### ✅ File Upload Checklist
- [ ] Upload all project files to server
- [ ] Set document root to `public/` directory
- [ ] Verify file permissions:
  - [ ] Files: 644
  - [ ] Directories: 755
  - [ ] Storage: 755 (recursive)
- [ ] Confirm build assets are in `public/build/`

## ⚙️ Server Configuration

### ✅ Document Root Setup
```
Hosting Panel → Websites/Domains → Document Root
Set to: /home/username/public_html/public
OR
Set to: /home/username/domains/yourdomain.com/public_html/public
```

### ✅ PHP Configuration
```
Hosting Panel → PHP Settings/Selectors
- PHP Version: 8.2 or higher
- Memory Limit: 256M or higher
- Max Execution Time: 300 seconds
- Max Upload Size: 50M
- Max POST Size: 50M
```

### ✅ Database Setup
- [ ] Create MySQL database
- [ ] Create database user with full privileges
- [ ] Note down credentials for .env

## 🔧 Application Configuration

### ✅ Environment File Setup
- [ ] Copy `.env.production` to `.env`
- [ ] Configure database settings:
  ```
  DB_CONNECTION=mysql
  DB_HOST=localhost
  DB_PORT=3306
  DB_DATABASE=your_database_name
  DB_USERNAME=your_database_user
  DB_PASSWORD=your_database_password
  ```
- [ ] Set application URL:
  ```
  APP_URL=https://yourdomain.com
  ```
- [ ] Configure payment gateways (Stripe, PayPal, etc.)
- [ ] Set up email service (SMTP, Mailgun, etc.)

### ✅ SSL Certificate
- [ ] Install SSL certificate via hosting panel
- [ ] Update APP_URL to use HTTPS
- [ ] Force HTTPS redirects if needed

## 🏃‍♂️ Deployment Execution

### ✅ Run Deployment Script
```bash
# Make script executable
chmod +x deploy-to-server.sh

# Run deployment
./deploy-to-server.sh
```

### ✅ Manual Setup (Alternative)
```bash
# Install dependencies
composer install --no-dev --optimize-autoloader

# Generate app key
php artisan key:generate

# Create storage link
php artisan storage:link

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Seed database (if needed)
php artisan db:seed --force
```

## 🧪 Testing & Verification

### ✅ Basic Functionality Tests
- [ ] **Homepage loads:** https://yourdomain.com
- [ ] **Assets load correctly:**
  - CSS: No styling issues
  - JS: No console errors
  - Images: All display properly
- [ ] **Navigation works:** All links functional
- [ ] **Authentication:** Login/Register forms work

### ✅ Core Features Test
- [ ] **Landing page:** etwave landing displays
- [ ] **User registration:** New user signup
- [ ] **Login system:** User authentication
- [ ] **Dashboard:** User dashboard loads
- [ ] **Business Directory:** Directory pages work
- [ ] **Payment flows:** Test payment integration

### ✅ Performance Tests
- [ ] **Page load speed:** Under 3 seconds
- [ ] **Mobile responsiveness:** All devices
- [ ] **Browser compatibility:** Chrome, Firefox, Safari, Edge
- [ ] **SSL certificate:** HTTPS working properly

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### ❌ **404 Errors on Assets**
```
Cause: Wrong document root or missing files
Solution:
1. Verify document root points to public/
2. Check files exist in public/build/
3. Clear browser cache (Ctrl+F5)
```

#### ❌ **500 Internal Server Error**
```
Cause: PHP errors, missing dependencies, or config issues
Solution:
1. Check Laravel logs: storage/logs/laravel.log
2. Verify .env configuration
3. Check PHP version and extensions
4. Run: php artisan config:clear
```

#### ❌ **Database Connection Error**
```
Cause: Wrong database credentials
Solution:
1. Verify .env database settings
2. Check database exists and user has permissions
3. Test connection: php artisan tinker
```

#### ❌ **Assets Not Loading**
```
Cause: Build files not uploaded or wrong paths
Solution:
1. Verify files in public/build/
2. Check network tab for 404 errors
3. Test direct URL: https://domain.com/build/manifest.json
```

#### ❌ **PHP Memory/Time Limits**
```
Cause: Large operations exceed limits
Solution:
1. Increase PHP limits in hosting panel
2. Optimize images and assets
3. Use queue for heavy operations
```

## 📊 Performance Optimization

### ✅ Post-Deployment Optimizations
- [ ] **Enable compression:** Gzip/Brotli
- [ ] **Set up CDN:** For assets (optional)
- [ ] **Configure caching:** Browser and server-side
- [ ] **Database optimization:** Indexes and queries
- [ ] **Image optimization:** WebP format, lazy loading

### ✅ Monitoring Setup
- [ ] **Error monitoring:** Log analysis
- [ ] **Performance monitoring:** Page speed
- [ ] **Uptime monitoring:** Service availability
- [ ] **Security monitoring:** Failed login attempts

## 🔒 Security Checklist

- [ ] **File permissions** set correctly
- [ ] **Environment variables** secured
- [ ] **Database credentials** not exposed
- [ ] **SSL certificate** properly installed
- [ ] **Security headers** configured
- [ ] **Regular backups** scheduled
- [ ] **Updates** applied regularly

## 🎉 Go-Live Checklist

- [ ] **All tests passed**
- [ ] **Domain properly configured**
- [ ] **SSL certificate active**
- [ ] **Email notifications working**
- [ ] **Payment gateways tested**
- [ ] **Backup system in place**
- [ ] **Monitoring tools configured**
- [ ] **Support contact information updated**

---

## 📞 Emergency Contacts

**If you encounter issues:**
1. Check this checklist first
2. Review SERVER-CONFIG-GUIDE.md
3. Check Laravel logs
4. Contact hosting support
5. Consult deployment documentation

**Your EtWave application is ready for production! 🚀**
