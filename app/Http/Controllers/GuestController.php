<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GuestController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $hotels = $user->hotels;

        if ($hotels->isEmpty()) {
            $hotels = Hotel::all();
        }

        $hotelIds = $hotels->pluck('id');

        $guests = Guest::with(['hotel'])
            ->whereIn('hotel_id', $hotelIds)
            ->when($request->search, function ($query) use ($request) {
                $query->where('first_name', 'like', "%{$request->search}%")
                    ->orWhere('last_name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhere('phone', 'like', "%{$request->search}%");
            })
            ->when($request->hotel_id, function ($query) use ($request) {
                $query->where('hotel_id', $request->hotel_id);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $hotels = Hotel::whereIn('id', $hotelIds)->get(['id', 'name']);

        return inertia('guests', [
            'guests' => $guests,
            'hotels' => $hotels,
            'filters' => $request->only(['search', 'hotel_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'id_type' => 'nullable|string|max:50',
            'id_number' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
        ]);

        Guest::create($validated);

        return redirect()->route('guests.index')->with('success', 'Guest created successfully');
    }

    public function update(Request $request, Guest $guest)
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'id_type' => 'nullable|string|max:50',
            'id_number' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
        ]);

        $guest->update($validated);

        return redirect()->route('guests.index')->with('success', 'Guest updated successfully');
    }

    public function destroy(Guest $guest)
    {
        $guest->delete();

        return redirect()->route('guests.index')->with('success', 'Guest deleted successfully');
    }

    public function create()
    {
        $user = Auth::user();
        $hotels = $user->hotels;

        if ($hotels->isEmpty()) {
            $hotels = Hotel::all();
        }

        return inertia('guests', [
            'hotels' => $hotels->map(fn ($h) => ['id' => $h->id, 'name' => $h->name]),
            'showModal' => true,
            'mode' => 'create',
        ]);
    }

    public function edit(Guest $guest)
    {
        $user = Auth::user();
        $hotels = $user->hotels;

        if ($hotels->isEmpty()) {
            $hotels = Hotel::all();
        }

        return inertia('guests', [
            'hotels' => $hotels->map(fn ($h) => ['id' => $h->id, 'name' => $h->name]),
            'showModal' => true,
            'mode' => 'edit',
            'editingGuest' => $guest,
        ]);
    }
}