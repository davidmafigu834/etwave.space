<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\EventServiceProvider::class,
    Paytabscom\Laravel_paytabs\PaypageServiceProvider::class,
    Shetabit\Visitor\Provider\VisitorServiceProvider::class,
    Spatie\MediaLibrary\MediaLibraryServiceProvider::class,
    App\Providers\PackageServiceProvider::class,
    Lab404\Impersonate\ImpersonateServiceProvider::class,
];
