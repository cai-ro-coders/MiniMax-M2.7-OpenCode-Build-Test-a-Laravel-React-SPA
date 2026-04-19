<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Hotel;
use App\Models\Payment;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@hotel system.com',
            'password' => Hash::make('password'),
        ]);

        $hotel1 = Hotel::create([
            'name' => 'Grand Plaza Hotel',
            'address' => '123 Main Street',
            'city' => 'New York',
            'country' => 'USA',
            'phone' => '+1 555-0100',
            'email' => 'info@grandplaza.com',
            'star_rating' => 5,
            'description' => 'Luxury hotel in the heart of Manhattan',
            'is_active' => true,
        ]);

        $hotel2 = Hotel::create([
            'name' => 'Seaside Resort',
            'address' => '456 Beach Road',
            'city' => 'Miami',
            'country' => 'USA',
            'phone' => '+1 555-0200',
            'email' => 'info@seasideresort.com',
            'star_rating' => 4,
            'description' => 'Beautiful beachfront resort',
            'is_active' => true,
        ]);

        $hotel3 = Hotel::create([
            'name' => 'Mountain View Lodge',
            'address' => '789 Mountain Ave',
            'city' => 'Denver',
            'country' => 'USA',
            'phone' => '+1 555-0300',
            'email' => 'info@mountainview.com',
            'star_rating' => 3,
            'description' => 'Cozy mountain retreat',
            'is_active' => true,
        ]);

        $admin->hotels()->attach([$hotel1->id, $hotel2->id, $hotel3->id], ['role' => 'admin']);

        $manager1 = User::create([
            'name' => 'John Manager',
            'email' => 'john@grandplaza.com',
            'password' => Hash::make('password'),
        ]);
        $manager1->hotels()->attach([$hotel1->id], ['role' => 'manager']);

        $receptionist1 = User::create([
            'name' => 'Sarah Reception',
            'email' => 'sarah@grandplaza.com',
            'password' => Hash::make('password'),
        ]);
        $receptionist1->hotels()->attach([$hotel1->id], ['role' => 'receptionist']);

        $this->createRoomTypesAndRooms($hotel1);
        $this->createRoomTypesAndRooms($hotel2);
        $this->createRoomTypesAndRooms($hotel3);

        $this->createServices($hotel1);
        $this->createServices($hotel2);
        $this->createServices($hotel3);

        $this->createSampleBookings($hotel1);
    }

    private function createRoomTypesAndRooms(Hotel $hotel): void
    {
        $standard = RoomType::create([
            'hotel_id' => $hotel->id,
            'name' => 'Standard Room',
            'description' => 'Comfortable standard room with essential amenities',
            'price_per_night' => 99.00,
            'capacity' => 2,
        ]);

        $deluxe = RoomType::create([
            'hotel_id' => $hotel->id,
            'name' => 'Deluxe Room',
            'description' => 'Spacious deluxe room with city view',
            'price_per_night' => 149.00,
            'capacity' => 2,
        ]);

        $suite = RoomType::create([
            'hotel_id' => $hotel->id,
            'name' => 'Executive Suite',
            'description' => 'Luxury suite with separate living area',
            'price_per_night' => 249.00,
            'capacity' => 4,
        ]);

        for ($i = 1; $i <= 5; $i++) {
            Room::create([
                'hotel_id' => $hotel->id,
                'room_type_id' => $standard->id,
                'room_number' => "{$i}01",
                'floor' => '1',
            ]);
        }

        for ($i = 1; $i <= 4; $i++) {
            Room::create([
                'hotel_id' => $hotel->id,
                'room_type_id' => $deluxe->id,
                'room_number' => "{$i}02",
                'floor' => '2',
            ]);
        }

        for ($i = 1; $i <= 2; $i++) {
            Room::create([
                'hotel_id' => $hotel->id,
                'room_type_id' => $suite->id,
                'room_number' => "{$i}03",
                'floor' => '3',
            ]);
        }
    }

    private function createServices(Hotel $hotel): void
    {
        Service::create([
            'hotel_id' => $hotel->id,
            'name' => 'Breakfast',
            'description' => 'Daily breakfast buffet',
            'price' => 25.00,
            'category' => 'food',
            'is_active' => true,
        ]);

        Service::create([
            'hotel_id' => $hotel->id,
            'name' => 'Airport Shuttle',
            'description' => 'Airport pickup and drop service',
            'price' => 50.00,
            'category' => 'transport',
            'is_active' => true,
        ]);

        Service::create([
            'hotel_id' => $hotel->id,
            'name' => 'Spa Treatment',
            'description' => '60-minute massage',
            'price' => 80.00,
            'category' => 'wellness',
            'is_active' => true,
        ]);

        Service::create([
            'hotel_id' => $hotel->id,
            'name' => 'Room Service',
            'description' => 'In-room dining service',
            'price' => 15.00,
            'category' => 'food',
            'is_active' => true,
        ]);
    }

    private function createSampleBookings(Hotel $hotel): void
    {
        $rooms = Room::where('hotel_id', $hotel->id)->get();
        $standardRoom = $rooms->where('room_type_id', $rooms->first()->room_type_id)->first();

        $guest1 = Guest::create([
            'hotel_id' => $hotel->id,
            'first_name' => 'Michael',
            'last_name' => 'Johnson',
            'email' => 'michael.johnson@email.com',
            'phone' => '+1 555-1001',
            'country' => 'USA',
            'id_type' => 'passport',
            'id_number' => 'US123456789',
        ]);

        $guest2 = Guest::create([
            'hotel_id' => $hotel->id,
            'first_name' => 'Emily',
            'last_name' => 'Davis',
            'email' => 'emily.davis@email.com',
            'phone' => '+1 555-1002',
            'country' => 'Canada',
            'id_type' => 'passport',
            'id_number' => 'CA987654321',
        ]);

        $booking1 = Booking::create([
            'hotel_id' => $hotel->id,
            'room_id' => $standardRoom->id,
            'guest_id' => $guest1->id,
            'booking_reference' => 'BK-GP-001',
            'check_in_date' => now()->addDays(2),
            'check_out_date' => now()->addDays(5),
            'total_guests' => 2,
            'total_price' => 297.00,
            'status' => 'confirmed',
            'special_requests' => 'Early check-in preferred',
        ]);

        Payment::create([
            'booking_id' => $booking1->id,
            'amount' => 297.00,
            'payment_method' => 'credit_card',
            'status' => 'completed',
            'transaction_id' => 'TXN-' . uniqid(),
        ]);

        $deluxeRoom = $rooms->where('room_type_id', $rooms->get(1)->room_type_id)->first();

        $booking2 = Booking::create([
            'hotel_id' => $hotel->id,
            'room_id' => $deluxeRoom ? $deluxeRoom->id : $standardRoom->id,
            'guest_id' => $guest2->id,
            'booking_reference' => 'BK-GP-002',
            'check_in_date' => now()->addDays(7),
            'check_out_date' => now()->addDays(10),
            'total_guests' => 1,
            'total_price' => 447.00,
            'status' => 'pending',
        ]);

        Payment::create([
            'booking_id' => $booking2->id,
            'amount' => 447.00,
            'payment_method' => 'bank_transfer',
            'status' => 'pending',
        ]);

        $services = Service::where('hotel_id', $hotel->id)->get();
        $breakfast = $services->where('name', 'Breakfast')->first();

        if ($breakfast) {
            $booking1->services()->attach($breakfast->id, [
                'quantity' => 3,
                'price' => 25.00,
            ]);
        }
    }
}