<?php

namespace App\Console\Commands;

use App\Models\Business;
use Illuminate\Console\Command;

class UpdateBusinessType extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'business:update-type {id} {type}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update business type';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $id = $this->argument('id');
        $type = $this->argument('type');
        
        $business = Business::find($id);
        
        if (!$business) {
            $this->error('Business not found');
            return 1;
        }
        
        $business->business_type = $type;
        $business->save();
        
        $this->info('Business type updated to: ' . $type);
        
        return 0;
    }
}
