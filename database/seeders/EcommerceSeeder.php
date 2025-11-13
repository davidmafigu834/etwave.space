<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\ProductCategory;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EcommerceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        
        // Get all ecommerce businesses
        $ecommerceBusinesses = Business::where('business_type', 'ecommerce')->get();
        
        if ($ecommerceBusinesses->isEmpty()) {
            $this->command->info('No ecommerce businesses found. Skipping ecommerce seeder.');
            return;
        }
        
        foreach ($ecommerceBusinesses as $business) {
            // Create product categories if they don't exist
            $categoryNames = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys', 'Automotive'];
            $categoryModels = [];
            
            foreach ($categoryNames as $categoryName) {
                // Check if category already exists
                $category = ProductCategory::where('business_id', $business->id)
                    ->where('slug', Str::slug($categoryName))
                    ->first();
                
                if (!$category) {
                    $category = ProductCategory::create([
                        'business_id' => $business->id,
                        'name' => $categoryName,
                        'slug' => Str::slug($categoryName),
                        'description' => $faker->sentence(),
                        'is_active' => true,
                        'order_index' => array_search($categoryName, $categoryNames),
                    ]);
                }
                
                $categoryModels[] = $category;
            }
            
            // Create products
            $productNames = [
                'Smartphone XYZ Pro', 'Laptop Ultra Slim', 'Wireless Headphones', 'Smart Watch',
                'Designer T-Shirt', 'Jeans Classic Fit', 'Sneakers Sport', 'Winter Jacket',
                'Garden Chair Set', 'Indoor Plant', 'Kitchen Knife Set', 'Bedding Set',
                'Yoga Mat', 'Fitness Tracker', 'Tennis Racket', 'Running Shoes',
                'Bestseller Novel', 'Cookbook Collection', 'Children Storybook', 'Biography Collection',
                'Facial Cream', 'Shampoo Set', 'Perfume Collection', 'Makeup Kit',
                'Building Blocks', 'Action Figure', 'Board Game', 'Puzzle Set',
                'Car Wax Kit', 'Tire Pressure Monitor', 'Dashboard Mount', 'Car Air Freshener'
            ];
            
            $productDescriptions = [
                'Latest technology with advanced features',
                'High-quality materials for durability',
                'Designed for comfort and style',
                'Perfect for everyday use',
                'Premium quality with warranty',
                'Eco-friendly and sustainable materials'
            ];
            
            // Check if products already exist for this business
            $existingProducts = Product::where('business_id', $business->id)->count();
            
            if ($existingProducts == 0) {
                foreach ($productNames as $index => $productName) {
                    $category = $faker->randomElement($categoryModels);
                    
                    $price = $faker->randomFloat(2, 10, 1000);
                    $salePrice = $faker->boolean(30) ? $faker->randomFloat(2, 5, $price * 0.8) : null;
                    
                    Product::create([
                        'business_id' => $business->id,
                        'category_id' => $category->id,
                        'name' => $productName,
                        'slug' => Str::slug($productName),
                        'description' => $faker->randomElement($productDescriptions) . '. ' . $faker->paragraph(),
                        'short_description' => $faker->sentence(),
                        'price' => $price,
                        'sale_price' => $salePrice,
                        'sku' => strtoupper(Str::random(3)) . '-' . $faker->unique()->numberBetween(1000, 9999),
                        'stock_quantity' => $faker->numberBetween(0, 100),
                        'is_featured' => $faker->boolean(20),
                        'is_active' => true,
                        'order_index' => $index,
                    ]);
                }
            }
            
            // Create sample orders if they don't exist
            $existingOrders = Order::where('business_id', $business->id)->count();
            
            if ($existingOrders == 0) {
                for ($i = 0; $i < 10; $i++) {
                    $orderStatus = $faker->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
                    $subtotal = $faker->randomFloat(2, 50, 500);
                    $taxAmount = $subtotal * 0.08;
                    $shippingAmount = $faker->randomElement([0, 5.99, 9.99, 15.99]);
                    $discountAmount = $faker->boolean(30) ? $faker->randomFloat(2, 5, $subtotal * 0.2) : 0;
                    $totalAmount = $subtotal + $taxAmount + $shippingAmount - $discountAmount;
                    
                    $order = Order::create([
                        'business_id' => $business->id,
                        'customer_name' => $faker->name(),
                        'customer_email' => $faker->email(),
                        'customer_phone' => $faker->phoneNumber(),
                        'customer_address' => $faker->address(),
                        'order_number' => 'ORD-' . strtoupper(Str::random(5)),
                        'status' => $orderStatus,
                        'subtotal' => $subtotal,
                        'tax_amount' => $taxAmount,
                        'shipping_amount' => $shippingAmount,
                        'discount_amount' => $discountAmount,
                        'total_amount' => $totalAmount,
                        'currency' => 'USD',
                        'payment_method' => $faker->randomElement(['credit_card', 'paypal', 'bank_transfer']),
                        'payment_status' => $faker->randomElement(['pending', 'completed', 'failed']),
                        'notes' => $faker->boolean(40) ? $faker->sentence() : null,
                        'created_at' => $faker->dateTimeBetween('-2 months', 'now'),
                    ]);
                    
                    // Create order items
                    $productCount = $faker->numberBetween(1, 5);
                    $products = Product::where('business_id', $business->id)->inRandomOrder()->limit($productCount)->get();
                    
                    foreach ($products as $product) {
                        $quantity = $faker->numberBetween(1, 3);
                        $unitPrice = $product->sale_price ?? $product->price;
                        $totalPrice = $unitPrice * $quantity;
                        
                        OrderItem::create([
                            'order_id' => $order->id,
                            'product_id' => $product->id,
                            'product_name' => $product->name,
                            'product_sku' => $product->sku,
                            'quantity' => $quantity,
                            'unit_price' => $unitPrice,
                            'total_price' => $totalPrice,
                        ]);
                    }
                }
            }
        }
        
        $this->command->info('Ecommerce data seeded successfully!');
    }
}
