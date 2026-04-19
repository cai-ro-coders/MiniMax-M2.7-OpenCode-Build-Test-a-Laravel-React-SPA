<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class HotelController extends Controller
{
    public function index(Request $request)
    {
        $hotels = Hotel::query()
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->search}%")
                    ->orWhere('city', 'like', "%{$request->search}%")
                    ->orWhere('country', 'like', "%{$request->search}%");
            })
            ->when($request->status, function ($query) use ($request) {
                $query->where('is_active', $request->status === 'active');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return inertia('hotels', [
            'hotels' => $hotels,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'star_rating' => 'nullable|integer|min:1|max:5',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['star_rating'] = $request->integer('star_rating', 3);

        Hotel::create($validated);

        return redirect()->route('hotels.index')->with('success', 'Hotel created successfully');
    }

    public function update(Request $request, Hotel $hotel)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'star_rating' => 'nullable|integer|min:1|max:5',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['star_rating'] = $request->integer('star_rating', 3);

        $hotel->update($validated);

        return redirect()->route('hotels.index')->with('success', 'Hotel updated successfully');
    }

    public function destroy(Hotel $hotel)
    {
        $hotel->delete();

        return redirect()->route('hotels.index')->with('success', 'Hotel deleted successfully');
    }

    public function create()
    {
        return inertia('hotels', [
            'showModal' => true,
            'mode' => 'create',
        ]);
    }

    public function edit(Hotel $hotel)
    {
        return inertia('hotels', [
            'showModal' => true,
            'mode' => 'edit',
            'editingHotel' => $hotel,
        ]);
    }
}