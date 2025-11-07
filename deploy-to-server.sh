#!/bin/bash

# Shared Hosting Deployment Script
# Run this after uploading files to your server

echo "🚀 EtWave Shared Hosting Deployment Script"
echo "=========================================="

# Check if we're in the correct directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: Please run this script from your Laravel root directory"
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo "🌐 Domain: ${DOMAIN:-'yourdomain.com'}"
echo ""

# Function to run commands with error checking
run_cmd() {
    echo "▶️  Running: $1"
    if eval "$1"; then
        echo "✅ Success"
    else
        echo "❌ Failed: $1"
        return 1
    fi
    echo ""
}

echo "🔧 Step 1: Setting up environment..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.production..."
    if [ -f ".env.production" ]; then
        cp .env.production .env
        echo "✅ Created .env from .env.production"
        echo "⚠️  IMPORTANT: Edit .env file with your production credentials!"
        echo ""
    else
        echo "❌ Neither .env nor .env.production found!"
        exit 1
    fi
fi

echo "🔧 Step 2: Installing dependencies..."

# Install PHP dependencies
run_cmd "composer install --no-dev --optimize-autoloader"

echo "🔧 Step 3: Setting permissions..."

# Set proper permissions
run_cmd "chmod -R 755 storage/"
run_cmd "chmod -R 755 bootstrap/cache/"
run_cmd "chmod 644 .env"

echo "🔧 Step 4: Laravel optimization..."

# Generate app key if not set
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    run_cmd "php artisan key:generate"
fi

# Create storage link
if [ ! -L "public/storage" ]; then
    run_cmd "php artisan storage:link"
fi

# Clear and cache config
run_cmd "php artisan config:cache"
run_cmd "php artisan route:cache"
run_cmd "php artisan view:cache"

echo "🔧 Step 5: Database setup..."

# Run migrations (uncomment if needed)
# echo "Running database migrations..."
# php artisan migrate --force

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit your .env file with production database and service credentials"
echo "2. Run database migrations: php artisan migrate --force"
echo "3. Seed database if needed: php artisan db:seed --force"
echo "4. Test your application at: https://yourdomain.com"
echo "5. Set up SSL certificate if not already done"
echo ""
echo "🔍 Troubleshooting:"
echo "- Check file permissions (755 for directories, 644 for files)"
echo "- Verify .env configuration"
echo "- Check PHP error logs"
echo "- Test asset loading: https://yourdomain.com/build/manifest.json"
echo ""
echo "📞 Support:"
echo "- Check SERVER-CONFIG-GUIDE.md for detailed server setup"
echo "- Monitor Laravel logs: storage/logs/laravel.log"
