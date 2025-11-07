-- Complete Plan Database Recreation Script
-- This includes: plans table creation, sample data, plan_orders, and plan_requests

-- Step 1: Create plans table with all columns
CREATE TABLE `plans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double(30,2) NOT NULL DEFAULT 0.00,
  `yearly_price` double(30,2) DEFAULT NULL,
  `duration` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `themes` text COLLATE utf8mb4_unicode_ci,
  `business` int(11) NOT NULL DEFAULT 0,
  `bio_links` int(11) NOT NULL DEFAULT 0,
  `bio_links_themes` json DEFAULT NULL,
  `addons` json DEFAULT NULL,
  `max_users` int(11) NOT NULL DEFAULT 0,
  `description` text COLLATE utf8mb4_unicode_ci,
  `enable_custdomain` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'off',
  `enable_custsubdomain` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'off',
  `enable_branding` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'on',
  `pwa_business` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'off',
  `enable_chatgpt` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'on',
  `storage_limit` double(15,2) NOT NULL DEFAULT 0.00,
  `is_trial` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trial_day` int(11) NOT NULL DEFAULT 0,
  `is_plan_enable` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'on',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `module` text COLLATE utf8mb4_unicode_ci,
  `features` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plans_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 2: Insert sample plan data
INSERT INTO `plans` (`name`, `price`, `yearly_price`, `duration`, `business`, `bio_links`, `max_users`, `description`, `enable_custdomain`, `enable_custsubdomain`, `enable_branding`, `pwa_business`, `enable_chatgpt`, `storage_limit`, `trial_day`, `is_plan_enable`, `is_default`, `features`, `bio_links_themes`, `addons`, `created_at`, `updated_at`) VALUES
('Free', 0.00, NULL, 'monthly', 1, 1, 1, 'Perfect for getting started with basic features', 'off', 'off', 'on', 'off', 'off', 0.10, 0, 'on', 1, '{"custom_domain": false, "custom_subdomain": false, "pwa_support": false, "ai_integration": false, "password_protection": false, "business_template_sections": ["header", "about", "contact", "social"]}', '["default", "modern"]', '[]', NOW(), NOW()),

('Starter', 9.99, 99.00, 'monthly', 3, 5, 3, 'Great for small businesses and startups', 'off', 'on', 'on', 'off', 'on', 1.00, 7, 'on', 0, '{"custom_domain": false, "custom_subdomain": true, "pwa_support": false, "ai_integration": true, "password_protection": false, "business_template_sections": ["header", "about", "services", "contact", "social", "business_hours", "gallery", "appointments"]}', '["default", "modern", "minimal", "corporate", "creative"]', '["analytics", "seo-tools"]', NOW(), NOW()),

('Professional', 29.99, 299.00, 'monthly', 10, 20, 10, 'Advanced features for growing businesses', 'on', 'on', 'off', 'on', 'on', 5.00, 14, 'on', 0, '{"custom_domain": true, "custom_subdomain": true, "pwa_support": true, "ai_integration": true, "password_protection": true, "business_template_sections": []}', '["default", "modern", "minimal", "corporate", "creative", "elegant", "bold"]', '["analytics", "seo-tools", "social-integration", "appointment-booking"]', NOW(), NOW()),

('Enterprise', 99.99, 999.00, 'monthly', 50, 100, 50, 'Complete solution for large organizations', 'on', 'on', 'off', 'on', 'on', 50.00, 30, 'on', 0, '{"custom_domain": true, "custom_subdomain": true, "pwa_support": true, "ai_integration": true, "password_protection": true, "business_template_sections": []}', '["default", "modern", "minimal", "corporate", "creative", "elegant", "bold", "luxury", "tech"]', '["analytics", "seo-tools", "social-integration", "appointment-booking", "crm-integration", "multi-language"]', NOW(), NOW());

-- Step 3: Create plan_orders table
CREATE TABLE `plan_orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `plan_id` bigint(20) unsigned NOT NULL,
  `coupon_id` bigint(20) unsigned DEFAULT NULL,
  `billing_cycle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `final_price` decimal(10,2) NOT NULL,
  `coupon_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_id` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','approved','rejected','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `ordered_at` timestamp NOT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `processed_by` bigint(20) unsigned DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plan_orders_order_number_unique` (`order_number`),
  KEY `plan_orders_user_id_foreign` (`user_id`),
  KEY `plan_orders_plan_id_foreign` (`plan_id`),
  KEY `plan_orders_coupon_id_foreign` (`coupon_id`),
  KEY `plan_orders_processed_by_foreign` (`processed_by`),
  CONSTRAINT `plan_orders_coupon_id_foreign` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `plan_orders_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `plan_orders_processed_by_foreign` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `plan_orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 4: Create plan_requests table
CREATE TABLE `plan_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `plan_id` bigint(20) unsigned NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `message` text COLLATE utf8mb4_unicode_ci,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  `approved_by` bigint(20) unsigned DEFAULT NULL,
  `rejected_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plan_requests_user_id_foreign` (`user_id`),
  KEY `plan_requests_plan_id_foreign` (`plan_id`),
  KEY `plan_requests_approved_by_foreign` (`approved_by`),
  KEY `plan_requests_rejected_by_foreign` (`rejected_by`),
  CONSTRAINT `plan_requests_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `plan_requests_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `plan_requests_rejected_by_foreign` FOREIGN KEY (`rejected_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `plan_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
