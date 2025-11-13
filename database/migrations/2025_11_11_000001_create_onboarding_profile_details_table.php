<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('onboarding_profile_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('onboarding_profile_id')->constrained()->cascadeOnDelete();
            $table->text('company_overview')->nullable();
            $table->text('mission_statement')->nullable();
            $table->text('vision_statement')->nullable();
            $table->text('unique_value_proposition')->nullable();
            $table->text('target_audience')->nullable();
            $table->text('service_highlights')->nullable();
            $table->text('notable_projects')->nullable();
            $table->text('testimonials')->nullable();
            $table->text('brand_voice')->nullable();
            $table->text('call_to_action')->nullable();
            $table->json('keywords')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('onboarding_profile_details');
    }
};
