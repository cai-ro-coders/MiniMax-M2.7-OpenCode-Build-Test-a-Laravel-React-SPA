<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $hotels = $user->hotels;

        if ($hotels->isEmpty()) {
            $hotels = Hotel::all();
        }

        $hotelIds = $hotels->pluck('id');

        $stats = [
            'total_hotels' => $hotels->count(),
            'total_rooms' => Room::whereIn('hotel_id', $hotelIds)->count(),
            'total_guests' => Guest::whereIn('hotel_id', $hotelIds)->count(),
            'total_bookings' => Booking::whereIn('hotel_id', $hotelIds)->count(),
            'total_revenue' => Booking::whereIn('hotel_id', $hotelIds)->where('status', '!=', 'cancelled')->sum('total_price'),
            'pending_bookings' => Booking::whereIn('hotel_id', $hotelIds)->where('status', 'pending')->count(),
            'confirmed_bookings' => Booking::whereIn('hotel_id', $hotelIds)->where('status', 'confirmed')->count(),
            'checked_in' => Booking::whereIn('hotel_id', $hotelIds)->where('status', 'checked_in')->count(),
        ];

        $hotelStats = Hotel::whereIn('id', $hotelIds)->withCount(['rooms', 'bookings', 'guests'])->get()->map(function ($hotel) {
            return [
                'id' => $hotel->id,
                'name' => $hotel->name,
                'rooms_count' => $hotel->rooms_count,
                'bookings_count' => $hotel->bookings_count,
                'guests_count' => $hotel->guests_count,
                'revenue' => $hotel->bookings()->where('status', '!=', 'cancelled')->sum('total_price'),
            ];
        });

        $monthlyBookings = Booking::whereIn('hotel_id', $hotelIds)
            ->whereYear('created_at', now()->year)
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as count, SUM(total_price) as revenue')
            ->groupBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => now()->month($item->month)->format('M'),
                    'count' => $item->count,
                    'revenue' => $item->revenue ?? 0,
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'hotelStats' => $hotelStats,
            'monthlyBookings' => $monthlyBookings,
        ]);
    }
}