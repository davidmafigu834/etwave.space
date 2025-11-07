# Shared Hosting Server Configuration Guide
# Add these configurations to your hosting control panel or .htaccess

## For cPanel/Plesk Shared Hosting:

### 1. Set Document Root
# In your hosting control panel, set document root to: /public_html/public/
# OR create a symlink: ln -s public public_html/public

### 2. Apache Configuration (.htaccess)
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Handle X-XSRF-Token Header
    RewriteCond %{HTTP:X-XSRF-Token} .
    RewriteRule .* - [E=HTTP_X_XSRF_TOKEN:%{HTTP:X-XSRF-Token}]

    # Redirect Trailing Slashes
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Handle Static Assets with Caching
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_URI} \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ [NC]
    RewriteRule ^ index.php [L]

    # Send All Other Requests To Front Controller
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>

### 3. PHP Configuration (php.ini)
# Add to your php.ini or create .user.ini:

max_execution_time = 300
max_input_time = 300
memory_limit = 256M
post_max_size = 50M
upload_max_filesize = 50M
max_file_uploads = 20

### 4. MIME Types (.htaccess)
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType text/css .css
    AddType application/font-woff .woff
    AddType application/font-woff2 .woff2
    AddType image/svg+xml .svg
    AddType image/webp .webp
</IfModule>

### 5. Compression (.htaccess)
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

### 6. Browser Caching (.htaccess)
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>

## For Nginx (if available):

server {
    listen 80;
    server_name yourdomain.com;
    root /home/username/public_html/public;

    index index.php index.html;

    # Handle PHP files
    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param SCRIPT_NAME $fastcgi_script_name;
    }

    # Handle static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Handle all other requests
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}

## For DirectAdmin/Other Panels:

### 1. Custom HTTPD Configuration
# Add to custom httpd configuration:

<Directory "/home/username/domains/yourdomain.com/public_html/public">
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>

### 2. PHP Version Selection
# In hosting panel, select PHP 8.2 or higher
# Enable required extensions: pdo, mbstring, openssl, tokenizer, xml, ctype, json, bcmath, fileinfo

## Testing Your Configuration:

### 1. Upload Test
# Upload a test file to verify paths
echo "Test file" > public/test.txt
# Visit: https://yourdomain.com/test.txt

### 2. Asset Loading Test
# Check if assets load: https://yourdomain.com/build/manifest.json
# Check if CSS loads: https://yourdomain.com/build/assets/app-*.css
# Check if JS loads: https://yourdomain.com/build/assets/app-*.js

### 3. Application Test
# Visit your domain: https://yourdomain.com
# Check browser console for 404 errors
# Test navigation and functionality

## Troubleshooting:

### Common Issues:

1. **Assets returning 404:**
   - Check document root points to public/
   - Verify build files are in public/build/
   - Check file permissions (644 for files, 755 for directories)

2. **PHP errors:**
   - Verify .env file exists and is configured
   - Check PHP version compatibility
   - Ensure vendor/ directory is uploaded

3. **Routing issues:**
   - Ensure mod_rewrite is enabled
   - Check .htaccess file is uploaded
   - Verify AllowOverride is set to All

4. **Performance issues:**
   - Enable compression
   - Set proper caching headers
   - Consider CDN for assets

## Final Checklist:

- [ ] Document root set to public/
- [ ] .htaccess uploaded to public/
- [ ] PHP version 8.2+
- [ ] All build files uploaded
- [ ] .env configured
- [ ] Database created and configured
- [ ] SSL certificate installed
- [ ] Domain DNS configured
