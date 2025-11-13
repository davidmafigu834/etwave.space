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
        if (Schema::hasTable('project_galleries')) {
            return;
        }

        Schema::create('project_galleries', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('order_index')->default(0);
            $table->timestamps();
        });

        Schema::create('project_gallery_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('gallery_id')->constrained('project_galleries')->cascadeOnDelete();
            $table->uuid('media_id')->nullable()->index();
            $table->string('media_type');
            $table->string('media_url');
            $table->string('thumbnail_url')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('order_index')->default(0);
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_gallery_items');
        Schema::dropIfExists('project_galleries');
    }
};
