<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('business_projects')) {
            Schema::create('business_projects', function (Blueprint $table) {
                $table->id();
                $table->foreignId('business_id')->constrained()->cascadeOnDelete();
                $table->string('title');
                $table->string('slug')->nullable();
                $table->string('category')->nullable();
                $table->string('location')->nullable();
                $table->string('summary')->nullable();
                $table->text('description')->nullable();
                $table->string('cta_label')->nullable();
                $table->string('cta_link')->nullable();
                $table->boolean('is_featured')->default(false);
                $table->unsignedInteger('order_index')->default(0);
                $table->json('meta')->nullable();
                $table->string('media_url')->nullable();
                $table->enum('media_type', ['image', 'video'])->nullable();
                $table->timestamps();

                $table->index(['business_id', 'is_featured']);
                $table->index(['business_id', 'order_index']);
            });
        } else {
            // If table exists, just add the media columns if they don't exist
            Schema::table('business_projects', function (Blueprint $table) {
                if (!Schema::hasColumn('business_projects', 'media_url')) {
                    $table->string('media_url')->nullable()->after('meta');
                }
                if (!Schema::hasColumn('business_projects', 'media_type')) {
                    $table->enum('media_type', ['image', 'video'])->nullable()->after('media_url');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_projects');
    }
};
