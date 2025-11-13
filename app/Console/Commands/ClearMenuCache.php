<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ClearMenuCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'menu:clear-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear the menu cache';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Clear the view cache which might contain menu data
        $this->call('view:clear');
        
        // Clear the config cache
        $this->call('config:clear');
        
        // Clear the route cache
        $this->call('route:clear');
        
        // Clear the application cache
        $this->call('cache:clear');
        
        $this->info('Menu cache cleared successfully!');
        
        return 0;
    }
}
