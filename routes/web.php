<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('rooms', RoomController::class)->except(['show']);
    Route::get('rooms/room-types', [RoomController::class, 'getRoomTypes'])->name('rooms.room-types');
    Route::get('rooms/check-room-number', [RoomController::class, 'checkRoomNumber'])->name('rooms.check-room-number');
    Route::resource('hotels', HotelController::class)->except(['show']);
    Route::resource('guests', GuestController::class)->except(['show']);
    Route::resource('bookings', BookingController::class)->except(['show']);
    Route::get('bookings/rooms', [BookingController::class, 'getRooms'])->name('bookings.rooms');
    Route::get('bookings/guests', [BookingController::class, 'getGuests'])->name('bookings.guests');
    Route::get('bookings/calculate-price', [BookingController::class, 'calculatePrice'])->name('bookings.calculate-price');
});

require __DIR__.'/settings.php';
