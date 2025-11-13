<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Business;
use Illuminate\Console\Command;

class SetCurrentBusiness extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:set-current-business {user_id} {business_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set current business for a user';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $userId = $this->argument('user_id');
        $businessId = $this->argument('business_id');
        
        $user = User::find($userId);
        
        if (!$user) {
            $this->error('User not found');
            return 1;
        }
        
        // If no business ID provided, use the first business
        if (!$businessId) {
            $business = Business::first();
            if (!$business) {
                $this->error('No business found');
                return 1;
            }
            $businessId = $business->id;
        }
        
        $business = Business::find($businessId);
        
        if (!$business) {
            $this->error('Business not found');
            return 1;
        }
        
        $user->current_business = $businessId;
        $user->save();
        
        $this->info('Current business set to: ' . $business->name . ' (ID: ' . $businessId . ') for user: ' . $user->name);
        
        return 0;
    }
}
