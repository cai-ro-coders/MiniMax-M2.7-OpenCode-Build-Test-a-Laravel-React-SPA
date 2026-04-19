<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $hotels = $user->hotels;

        if ($hotels->isEmpty()) {
            $hotels = Hotel::all();
        }

        $hotelIds = $hotels->pluck('id');

        $rooms = Room::with(['hotel', 'roomType'])
            ->whereIn('hotel_id', $hotelIds)
            ->when($request->search, function ($query) use ($request) {
                $query->where('room_number', 'like', "%{$request->search}%")
                    ->orWhereHas('roomType', function ($q) use ($request) {
                        $q->where('name', 'like', "%{$request->search}%");
                    })
                    ->orWhereHas('hotel', function ($q) use ($request) {
                        $q->where('name', 'like', "%{$request->search}%");
                    });
            })
            ->when($request->hotel_id, function ($query) use ($request) {
                $query->where('hotel_id', $request->hotel_id);
            })
            ->when($request->status, function ($query) use ($request) {
                $query->where('is_available', $request->status === 'available');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $hotels = Hotel::whereIn('id', $hotelIds)->get(['id', 'name']);

        return inertia('rooms', [
            'rooms' => $rooms,
            'hotels' => $hotels,
            'filters' => $request->only(['search', 'hotel_id', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'room_type_id' => 'required|exists:room_types,id',
            'room_number' => 'required|string|max:20',
            'floor' => 'nullable|string|max:10',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        $exists = Room::where('hotel_id', $request->hotel_id)
            ->where('room_number', $request->room_number)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'room_number' => ['This room number already exists for the selected hotel.'],
            ]);
        }

        $validated['is_available'] = $request->boolean('is_available', true);

        Room::create($validated);

        return redirect()->route('rooms.index')->with('success', 'Room created successfully');
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'room_type_id' => 'required|exists:room_types,id',
            'room_number' => 'required|string|max:20',
            'floor' => 'nullable|string|max:10',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        $exists = Room::where('hotel_id', $request->hotel_id)
            ->where('room_number', $request->room_number)
            ->where('id', '!=', $room->id)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'room_number' => ['This room number already exists for the selected hotel.'],
            ]);
        }

        $validated['is_available'] = $request->boolean('is_available', true);

        $room->update($validated);

        return redirect()->route('rooms.index')->with('success', 'Room updated successfully');
    }

    public function destroy(Room $room)
    {
        $room->delete();

        return redirect()->route('rooms.index')->with('success', 'Room deleted successfully');
    }

    public function getRoomTypes(Request $request)
    {
        $roomTypes = RoomType::where('hotel_id', $request->hotel_id)->get(['id', 'name', 'price_per_night', 'capacity']);

        return response()->json($roomTypes);
    }

    public function checkRoomNumber(Request $request)
    {
        $exists = Room::where('hotel_id', $request->hotel_id)
            ->where('room_number', $request->room_number)
            ->when($request->exclude_id, fn($query) => $query->where('id', '!=', $request->exclude_id))
            ->exists();

        return response()->json(['exists' => $exists]);
    }

    public function create()
    {
        $user = Auth::user();
        $hotels = $user->hotels;

        if ($hotels->isEmpty()) {
            $hotels = Hotel::all();
        }

        return inertia('rooms', [
            'hotels' => $hotels->map(fn ($h) => ['id' => $h->id, 'name' => $h->name]),
            'showModal' => true,
            'mode' => 'create',
        ]);
    }

    public function edit(Room $room)
    {
        $user = Auth::user();
        $hotels = $user->hotels;

        if ($hotels->isEmpty()) {
            $hotels = Hotel::all();
        }

        $roomTypes = RoomType::where('hotel_id', $room->hotel_id)->get(['id', 'name', 'price_per_night', 'capacity']);

        return inertia('rooms', [
            'hotels' => $hotels->map(fn ($h) => ['id' => $h->id, 'name' => $h->name]),
            'roomTypes' => $roomTypes,
            'showModal' => true,
            'mode' => 'edit',
            'editingRoom' => $room,
        ]);
    }
}