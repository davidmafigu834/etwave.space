<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('plan_requests', 'duration')) {
            Schema::table('plan_requests', function (Blueprint $table) {
                $table->string('duration')->default('monthly')->after('plan_id');
            });
        }

        DB::table('plan_requests')
            ->whereNull('duration')
            ->update(['duration' => 'monthly']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('plan_requests', 'duration')) {
            Schema::table('plan_requests', function (Blueprint $table) {
                $table->dropColumn('duration');
            });
        }
    }
};
