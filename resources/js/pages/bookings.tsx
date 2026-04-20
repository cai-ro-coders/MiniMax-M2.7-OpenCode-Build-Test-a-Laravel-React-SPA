import { Head } from '@inertiajs/react';
import { router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Booking {
    id: number;
    booking_reference: string;
    check_in_date: string;
    check_out_date: string;
    total_guests: number;
    total_price: number;
    status: string;
    special_requests: string | null;
    hotel: { id: number; name: string };
    room: { id: number; room_number: string };
    guest: { id: number; first_name: string; last_name: string; email: string };
}

interface Hotel {
    id: number;
    name: string;
}

interface Room {
    id: number;
    room_number: string;
    floor: string;
}

interface Guest {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface Props {
    bookings: {
        data: Booking[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    hotels: Hotel[];
    rooms?: Room[];
    guests?: Guest[];
    filters: {
        search?: string;
        hotel_id?: string;
        status?: string;
    };
    showModal?: boolean;
    mode?: 'create' | 'edit';
    editingBooking?: Booking;
}

const formatDateForInput = (dateStr: string | undefined): string => {
    if (!dateStr) {
return '';
}

    return dateStr.split('T')[0];
};

export default function Bookings({ 
    bookings, 
    hotels, 
    rooms = [], 
    guests = [], 
    filters, 
    showModal = false, 
    mode = 'create',
    editingBooking 
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(showModal);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>(mode);
    const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedHotel, setSelectedHotel] = useState(filters.hotel_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [availableRooms, setAvailableRooms] = useState<Room[]>(rooms);
    const [availableGuests, setAvailableGuests] = useState<Guest[]>(guests);
    const [priceInfo, setPriceInfo] = useState({ nights: 0, price_per_night: 0, total: 0 });

    useEffect(() => {
        if (modalMode === 'edit' && !isModalOpen) {
            setIsModalOpen(true);
        }
    }, [modalMode, isModalOpen]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        hotel_id: editingBooking?.hotel.id.toString() || '',
        room_id: editingBooking?.room.id.toString() || '',
        guest_id: editingBooking?.guest.id.toString() || '',
        check_in_date: formatDateForInput(editingBooking?.check_in_date),
        check_out_date: formatDateForInput(editingBooking?.check_out_date),
        total_guests: editingBooking?.total_guests?.toString() || '1',
        total_price: editingBooking?.total_price?.toString() || '',
        status: editingBooking?.status || 'pending',
        special_requests: editingBooking?.special_requests || '',
    });

    const handleSearch = () => {
        router.get('/bookings', { search, hotel_id: selectedHotel, status: selectedStatus }, { replace: true });
    };

    const handleHotelChange = async (hotelId: string) => {
        setData('hotel_id', hotelId);
        setData('room_id', '');
        setData('guest_id', '');
        
        if (hotelId) {
            try {
                const [roomsRes, guestsRes] = await Promise.all([
                    fetch(`/bookings/rooms?hotel_id=${hotelId}`),
                    fetch(`/bookings/guests?hotel_id=${hotelId}`)
                ]);
                const roomsData = await roomsRes.json();
                const guestsData = await guestsRes.json();
                setAvailableRooms(Array.isArray(roomsData) ? roomsData : []);
                setAvailableGuests(Array.isArray(guestsData) ? guestsData : []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setAvailableRooms([]);
                setAvailableGuests([]);
            }
        } else {
            setAvailableRooms([]);
            setAvailableGuests([]);
        }
    };

    const calculatePrice = async () => {
        if (!data.room_id || !data.check_in_date || !data.check_out_date) {
            setPriceInfo({ nights: 0, price_per_night: 0, total: 0 });

            return;
        }

        try {
            const response = await fetch(`/bookings/calculate-price?room_id=${data.room_id}&check_in_date=${data.check_in_date}&check_out_date=${data.check_out_date}`);
            const result = await response.json();
            setPriceInfo(result);
            setData('total_price', result.total.toString());
        } catch (error) {
            console.error('Error calculating price:', error);
        }
    };

    const handleDateChange = () => {
        if (data.room_id && data.check_in_date && data.check_out_date) {
            calculatePrice();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (modalMode === 'create') {
            post('/bookings', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setModalMode('create');
                    reset();
                },
                onError: (errors) => {
                    console.log('Validation errors:', errors);
                }
            });
        } else if (editingBookingId) {
            put(`/bookings/${editingBookingId}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setModalMode('create');
                    setEditingBookingId(null);
                    reset();
                },
                onError: (errors) => {
                    console.log('Validation errors:', errors);
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this booking?')) {
            router.delete(`/bookings/${id}`);
        }
    };

    const openEditModal = (booking: Booking) => {
        setData({
            hotel_id: booking.hotel.id.toString(),
            room_id: booking.room.id.toString(),
            guest_id: booking.guest.id.toString(),
            check_in_date: formatDateForInput(booking.check_in_date),
            check_out_date: formatDateForInput(booking.check_out_date),
            total_guests: booking.total_guests.toString(),
            total_price: booking.total_price.toString(),
            status: booking.status,
            special_requests: booking.special_requests || '',
        });

        fetch(`/bookings/rooms?hotel_id=${booking.hotel.id}`)
            .then(res => res.json())
            .then(roomsData => setAvailableRooms(Array.isArray(roomsData) ? roomsData : []));

        fetch(`/bookings/guests?hotel_id=${booking.hotel.id}`)
            .then(res => res.json())
            .then(guestsData => setAvailableGuests(Array.isArray(guestsData) ? guestsData : []));

        setEditingBookingId(booking.id);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBookingId(null);
        setModalMode('create');
        setAvailableRooms([]);
        setAvailableGuests([]);
        reset();
    };

    const getStatusBadge = (status: string) => {
        const statusClasses: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            checked_in: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            checked_out: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <>
            <Head title="Bookings" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Bookings</h1>
                    <Button onClick={() => {
                        setModalMode('create');
                        setEditingBookingId(null);
                        setIsModalOpen(true);
                    }}>
                        Add Booking
                    </Button>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Input
                        placeholder="Search bookings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="max-w-xs"
                    />
                    <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="All Hotels" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Hotels</SelectItem>
                            {hotels.map((hotel) => (
                                <SelectItem key={hotel.id} value={hotel.id.toString()}>
                                    {hotel.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="checked_in">Checked In</SelectItem>
                            <SelectItem value="checked_out">Checked Out</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleSearch}>Search</Button>
                </div>

                <div className="rounded-xl border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-4 text-left text-sm font-medium">Reference</th>
                                    <th className="p-4 text-left text-sm font-medium">Guest</th>
                                    <th className="p-4 text-left text-sm font-medium">Room</th>
                                    <th className="p-4 text-left text-sm font-medium">Check-in</th>
                                    <th className="p-4 text-left text-sm font-medium">Check-out</th>
                                    <th className="p-4 text-left text-sm font-medium">Total</th>
                                    <th className="p-4 text-left text-sm font-medium">Status</th>
                                    <th className="p-4 text-right text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-4 text-center text-muted-foreground">
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.data.map((booking) => (
                                        <tr key={booking.id} className="border-b">
                                            <td className="p-4">
                                                <div className="font-medium">{booking.booking_reference}</div>
                                            </td>
                                            <td className="p-4">
                                                <div>{booking.guest.first_name} {booking.guest.last_name}</div>
                                                <div className="text-sm text-muted-foreground">{booking.guest.email}</div>
                                            </td>
                                            <td className="p-4">{booking.room.room_number}</td>
                                            <td className="p-4">{booking.check_in_date}</td>
                                            <td className="p-4">{booking.check_out_date}</td>
                                            <td className="p-4">${booking.total_price}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => openEditModal(booking)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => handleDelete(booking.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {bookings.links && bookings.links.length > 3 && (
                        <div className="flex items-center justify-center gap-2 p-4">
                            {bookings.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={(open) => {
                if (!open) {
                    closeModal();
                }
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{modalMode === 'create' ? 'Add New Booking' : 'Edit Booking'}</DialogTitle>
                        <DialogDescription>
                            {modalMode === 'create' ? 'Fill in the booking details below.' : 'Update the booking details below.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="hotel">Hotel</Label>
                                <Select 
                                    value={data.hotel_id} 
                                    onValueChange={handleHotelChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select hotel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hotels.map((hotel) => (
                                            <SelectItem key={hotel.id} value={hotel.id.toString()}>
                                                {hotel.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.hotel_id && (
                                    <p className="text-sm text-red-500">{errors.hotel_id}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="guest">Guest</Label>
                                <Select 
                                    value={data.guest_id}
                                    onValueChange={(value) => setData('guest_id', value)}
                                    disabled={!data.hotel_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select guest" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableGuests.map((guest) => (
                                            <SelectItem key={guest.id} value={guest.id.toString()}>
                                                {guest.first_name} {guest.last_name} - {guest.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.guest_id && (
                                    <p className="text-sm text-red-500">{errors.guest_id}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="room">Room</Label>
                                <Select 
                                    value={data.room_id}
                                    onValueChange={(value) => {
                                        setData('room_id', value);

                                        if (data.check_in_date && data.check_out_date) {
                                            setTimeout(calculatePrice, 100);
                                        }
                                    }}
                                    disabled={!data.hotel_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select room" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableRooms.map((room) => (
                                            <SelectItem key={room.id} value={room.id.toString()}>
                                                {room.room_number} {room.floor && `(${room.floor})`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.room_id && (
                                    <p className="text-sm text-red-500">{errors.room_id}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="check_in_date">Check-in Date</Label>
                                    <Input
                                        id="check_in_date"
                                        type="date"
                                        value={data.check_in_date}
                                        onChange={(e) => {
                                            setData('check_in_date', e.target.value);
                                            handleDateChange();
                                        }}
                                    />
                                    {errors.check_in_date && (
                                        <p className="text-sm text-red-500">{errors.check_in_date}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="check_out_date">Check-out Date</Label>
                                    <Input
                                        id="check_out_date"
                                        type="date"
                                        value={data.check_out_date}
                                        onChange={(e) => {
                                            setData('check_out_date', e.target.value);
                                            handleDateChange();
                                        }}
                                    />
                                    {errors.check_out_date && (
                                        <p className="text-sm text-red-500">{errors.check_out_date}</p>
                                    )}
                                </div>
                            </div>

                            {priceInfo.total > 0 && (
                                <div className="rounded-lg bg-muted p-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Price per night:</span>
                                        <span>${priceInfo.price_per_night}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Nights:</span>
                                        <span>{priceInfo.nights}</span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                        <span>Total:</span>
                                        <span>${priceInfo.total}</span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="total_guests">Total Guests</Label>
                                    <Input
                                        id="total_guests"
                                        type="number"
                                        min="1"
                                        value={data.total_guests}
                                        onChange={(e) => setData('total_guests', e.target.value)}
                                    />
                                    {errors.total_guests && (
                                        <p className="text-sm text-red-500">{errors.total_guests}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select 
                                        value={data.status} 
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="checked_in">Checked In</SelectItem>
                                            <SelectItem value="checked_out">Checked Out</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="special_requests">Special Requests</Label>
                                <Input
                                    id="special_requests"
                                    value={data.special_requests}
                                    onChange={(e) => setData('special_requests', e.target.value)}
                                    placeholder="Any special requests..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {modalMode === 'create' ? 'Add Booking' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Bookings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Bookings', href: '/bookings' },
    ],
};