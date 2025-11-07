#!/bin/bash

# EtWave Production Deployment Script
# This script prepares the application for production deployment

echo "🚀 Starting EtWave Production Deployment..."

# Set script to exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    print_error "Please run this script from the Laravel project root directory"
    exit 1
fi

print_status "Setting up production environment..."

# Create .env file from production template if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.production" ]; then
        cp .env.production .env
        print_warning "Created .env file from .env.production template"
        print_warning "Please update the .env file with your production values before continuing!"
        exit 1
    else
        print_error ".env.production template not found!"
        exit 1
    fi
fi

# Install PHP dependencies
print_status "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm ci --only=production

# Build assets for production
print_status "Building production assets..."
npm run build

# Generate application key if not set
if ! grep -q "APP_KEY=base64:" .env; then
    print_status "Generating application key..."
    php artisan key:generate
fi

# Run database migrations
print_status "Running database migrations..."
php artisan migrate --force

# Seed database if needed (uncomment if you have seeders)
# print_status "Seeding database..."
# php artisan db:seed --force

# Clear and cache configuration
print_status "Optimizing application for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
print_status "Setting proper file permissions..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod 644 .env

# Create storage link if it doesn't exist
if [ ! -L "public/storage" ]; then
    print_status "Creating storage link..."
    php artisan storage:link
fi

# Clear all Laravel caches
print_status "Clearing all caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear

print_success "Production deployment completed successfully!"
print_status ""
print_status "Next steps:"
print_status "1. Upload all files to your shared hosting server"
print_status "2. Update your .env file with production database and service credentials"
print_status "3. Set up your domain's document root to point to the 'public' directory"
print_status "4. Configure your web server (Apache/Nginx) with the provided .htaccess rules"
print_status "5. Test your application thoroughly"
print_status ""
print_warning "Remember to:"
print_warning "- Keep your .env file secure and never commit it to version control"
print_warning "- Regularly backup your database"
print_warning "- Monitor your application logs"
print_warning "- Keep your dependencies updated for security"

echo ""
print_success "🎉 EtWave is ready for production!"
