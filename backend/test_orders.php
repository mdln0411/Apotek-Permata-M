<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$orders = \App\Models\Order::orderBy('created_at', 'desc')->get();
foreach($orders as $o) {
    echo "ID: $o->id | Status: $o->status | UserID: $o->user_id \n";
}
