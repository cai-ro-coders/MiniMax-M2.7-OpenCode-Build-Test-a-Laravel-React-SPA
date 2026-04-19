<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Guest;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $hotels = $user->hotels;

        if ($hotels->isEmpty()) {
            $hotels = Hotel::all();
        }

        $hotelIds = $hotels->pluck('id');

        $bookings = Booking::with(['hotel', 'room', 'guest'])
            ->whereIn('hotel_id', $hotelIds)
            ->when($request->search, function ($query) use ($request) {
                $query->where('booking_reference', 'like', "%{$request->search}%")
                    ->orWhereHas('guest', function ($q) use ($request) {
                        $q->where('first_name', 'like', "%{$request->search}%")
                            ->orWhere('last_name', 'like', "%{$request->search}%")
                            ->orWhere('email', 'like', "%{$request->search}%");
                    });
            })
            ->when($request->hotel_id, function ($query) use ($request) {
                $query->where('hotel_id', $request->hotel_id);
            })
            ->when($request->status, function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $hotels = Hotel::whereIn('id', $hotelIds)->get(['id', 'name']);

        return inertia('bookings', [
            'bookings' => $bookings,
            'hotels' => $hotels,
            'filters' => $request->only(['search', 'hotel_id', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'room_id' => 'required|exists:rooms,id',
            'guest_id' => 'required|exists:guests,id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'total_guests' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'status' => 'nullable|in:pending,confirmed,checked_in,checked_out,cancelled',
            'special_requests' => 'nullable|string',
        ]);

        $validated['status'] = $request->status ?? 'pending';
        $validated['booking_reference'] = 'BK-' . strtoupper(uniqid());

        Booking::create($validated);

        return redirect()->route('bookings.index')->with('success', 'Booking created successfully');
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'room_id' => 'required|exists:rooms,id',
            'guest_id' => 'required|exists:guests,id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'total_guests' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'status' => 'nullable|in:pending,confirmed,checked_in,checked_out,cancelled',
            'special_requests' => 'nullable|string',
        ]);

        $booking->update($validated);

        return redirect()->route('bookings.index')->with('success', 'Booking updated successfully');
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();

        return redirect()->route('bookings.index')->with('success', 'Booking deleted successfully');
    }

    public function create()
    {
        $user = Auth::user();
        $hotels = $user->hotels;

        if ($hotels->isEmpty()) {
            $hotels = Hotel::all();
        }

        return inertia('bookings', [
            'hotels' => $hotels->map(fn ($h) => ['id' => $h->id, 'name' => $h->name]),
            'showModal' => true,
            'mode' => 'create',
        ]);
    }

    public function edit(Booking $booking)
    {
        $user = Auth::user();
        $hotels = $user->hotels;

        if ($hotels->isEmpty()) {
            $hotels = Hotel::all();
        }

        $rooms = Room::where('hotel_id', $booking->hotel_id)->get(['id', 'room_number']);
        $guests = Guest::where('hotel_id', $booking->hotel_id)->get(['id', 'first_name', 'last_name', 'email']);

        return inertia('bookings', [
            'hotels' => $hotels->map(fn ($h) => ['id' => $h->id, 'name' => $h->name]),
            'rooms' => $rooms,
            'guests' => $guests,
            'showModal' => true,
            'mode' => 'edit',
            'editingBooking' => $booking,
        ]);
    }

    public function getRooms(Request $request)
    {
        $rooms = Room::where('hotel_id', $request->hotel_id)
            ->where('is_available', true)
            ->get(['id', 'room_number', 'floor']);

        return response()->json($rooms);
    }

    public function getGuests(Request $request)
    {
        $guests = Guest::where('hotel_id', $request->hotel_id)
            ->get(['id', 'first_name', 'last_name', 'email']);

        return response()->json($guests);
    }

    public function calculatePrice(Request $request)
    {
        $room = Room::with('roomType')->find($request->room_id);
        
        if (!$room) {
            return response()->json(['error' => 'Room not found'], 404);
        }

        $checkIn = \Carbon\Carbon::parse($request->check_in_date);
        $checkOut = \Carbon\Carbon::parse($request->check_out_date);
        $nights = $checkIn->diffInDays($checkOut);
        $pricePerNight = $room->roomType->price_per_night ?? 0;
        $total = $nights * $pricePerNight;

        return response()->json([
            'nights' => $nights,
            'price_per_night' => $pricePerNight,
            'total' => $total,
        ]);
    }
}