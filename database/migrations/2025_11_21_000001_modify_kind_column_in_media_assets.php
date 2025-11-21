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
        Schema::table('media_assets', function (Blueprint $table) {
            // Change 'kind' column to string (255) to accommodate 'product_image'
            $table->string('kind', 255)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media_assets', function (Blueprint $table) {
            // We don't know the exact previous state, but we can revert to a smaller string or enum if we knew it.
            // For now, we'll leave it as string(255) or maybe revert to string(20) if that was the likely issue.
            // But safer to just do nothing or revert to a smaller size if strictly needed.
            // Let's assume it was varchar(20) based on the truncation error for 'product_image' (13 chars).
            // If it was 10 chars, 'product_im' would fit? No.
            // If it was enum, we can't easily revert without knowing the allowed values.
            // So we will just leave it or set it to string(50).
            $table->string('kind', 50)->change(); 
        });
    }
};
