import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Room {
    id: number;
    room_number: string;
    floor: string;
    description: string;
    is_available: boolean;
    hotel: { id: number; name: string };
    room_type: { id: number; name: string; price_per_night: number };
}

interface Hotel {
    id: number;
    name: string;
}

interface RoomType {
    id: number;
    name: string;
    price_per_night: number;
    capacity: number;
}

interface Props {
    rooms: {
        data: Room[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    hotels: Hotel[];
    roomTypes?: RoomType[];
    filters: {
        search?: string;
        hotel_id?: string;
        status?: string;
    };
    showModal?: boolean;
    mode?: 'create' | 'edit';
    editingRoom?: Room;
}

export default function Rooms({ 
    rooms, 
    hotels, 
    roomTypes = [], 
    filters, 
    showModal = false, 
    mode = 'create',
    editingRoom 
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(showModal);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>(mode);
    const [editingRoomId, setEditingRoomId] = useState<number | null>(editingRoom?.id || null);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedHotel, setSelectedHotel] = useState(filters.hotel_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [editRoomTypes, setEditRoomTypes] = useState<RoomType[]>(roomTypes);
    const [roomNumberError, setRoomNumberError] = useState('');
    const [isCheckingRoom, setIsCheckingRoom] = useState(false);

    // Open modal when mode changes to edit
    useEffect(() => {
        if (modalMode === 'edit' && !isModalOpen) {
            setIsModalOpen(true);
        }
    }, [modalMode, isModalOpen]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        hotel_id: editingRoom?.hotel.id.toString() || '',
        room_type_id: editingRoom?.room_type.id.toString() || '',
        room_number: editingRoom?.room_number || '',
        floor: editingRoom?.floor || '',
        description: editingRoom?.description || '',
        is_available: editingRoom?.is_available ?? true,
    });

    const handleSearch = () => {
        router.get('/rooms', { search, hotel_id: selectedHotel, status: selectedStatus }, { replace: true });
    };

    const handleHotelChange = async (hotelId: string) => {
        setData('hotel_id', hotelId);
        setData('room_type_id', '');
        
        if (modalMode === 'create') {
            const response = await fetch(`/rooms/room-types?hotel_id=${hotelId}`);
            const types = await response.json();
            setEditRoomTypes(types);
            setRoomNumberError('');
        }
    };

    const checkRoomNumber = async (roomNumber: string) => {
        if (!data.hotel_id || !roomNumber) {
            setRoomNumberError('');
            return;
        }

        setIsCheckingRoom(true);
        const excludeId = modalMode === 'edit' ? editingRoomId : null;
        const url = `/rooms/check-room-number?hotel_id=${data.hotel_id}&room_number=${encodeURIComponent(roomNumber)}${excludeId ? `&exclude_id=${excludeId}` : ''}`;
        
        try {
            const response = await fetch(url);
            const result = await response.json();
            if (result.exists) {
                setRoomNumberError('This room number already exists for the selected hotel.');
            } else {
                setRoomNumberError('');
            }
        } catch (error) {
            console.error('Error checking room number:', error);
        } finally {
            setIsCheckingRoom(false);
        }
    };

    const handleRoomNumberChange = (value: string) => {
        setData('room_number', value);
        if (value) {
            checkRoomNumber(value);
        } else {
            setRoomNumberError('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (roomNumberError) {
            return;
        }
        
        if (modalMode === 'create') {
            post('/rooms', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setModalMode('create');
                    reset();
                },
                onError: (errors) => {
                    console.log('Validation errors:', errors);
                }
            });
        } else if (editingRoomId) {
            put(`/rooms/${editingRoomId}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setModalMode('create');
                    setEditingRoomId(null);
                    reset();
                },
                onError: (errors) => {
                    console.log('Validation errors:', errors);
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this room?')) {
            router.delete(`/rooms/${id}`);
        }
    };

const openEditModal = (room: Room) => {
        setData({
            hotel_id: room.hotel.id.toString(),
            room_type_id: room.room_type.id.toString(),
            room_number: room.room_number,
            floor: room.floor || '',
            description: room.description || '',
            is_available: room.is_available,
        });

        fetch(`/rooms/room-types?hotel_id=${room.hotel.id}`)
            .then(res => res.json())
            .then(types => setEditRoomTypes(Array.isArray(types) ? types : []))
            .catch(() => {
                setEditRoomTypes([{
                    id: room.room_type.id,
                    name: room.room_type.name,
                    price_per_night: room.room_type.price_per_night,
                    capacity: 2
                }]);
            });
        
        setEditingRoomId(room.id);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setIsModalOpen(false);
            setEditingRoomId(null);
            setModalMode('create');
            reset();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRoomId(null);
        setModalMode('create');
        reset();
    };

    return (
        <>
            <Head title="Rooms" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Rooms</h1>
                    <Button onClick={() => {
                        setModalMode('create');
                        setEditingRoomId(null);
                        setIsModalOpen(true);
                    }}>
                        Add Room
                    </Button>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Input
                        placeholder="Search rooms..."
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
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleSearch}>Search</Button>
                </div>

                <div className="rounded-xl border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-4 text-left text-sm font-medium">Room</th>
                                    <th className="p-4 text-left text-sm font-medium">Hotel</th>
                                    <th className="p-4 text-left text-sm font-medium">Type</th>
                                    <th className="p-4 text-left text-sm font-medium">Floor</th>
                                    <th className="p-4 text-left text-sm font-medium">Status</th>
                                    <th className="p-4 text-right text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                            No rooms found
                                        </td>
                                    </tr>
                                ) : (
                                    rooms.data.map((room) => (
                                        <tr key={room.id} className="border-b">
                                            <td className="p-4">
                                                <div className="font-medium">{room.room_number}</div>
                                                <div className="text-sm text-muted-foreground">{room.description || 'No description'}</div>
                                            </td>
                                            <td className="p-4">{room.hotel.name}</td>
                                            <td className="p-4">
                                                <div>{room.room_type.name}</div>
                                                <div className="text-sm text-muted-foreground">${room.room_type.price_per_night}/night</div>
                                            </td>
                                            <td className="p-4">{room.floor || '-'}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    room.is_available 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }`}>
                                                    {room.is_available ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => openEditModal(room)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => handleDelete(room.id)}
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

                    {rooms.links && rooms.links.length > 3 && (
                        <div className="flex items-center justify-center gap-2 p-4">
                            {rooms.links.map((link, index) => (
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
                    setIsModalOpen(false);
                    setEditingRoomId(null);
                    setModalMode('create');
                    reset();
                }
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{modalMode === 'create' ? 'Add New Room' : 'Edit Room'}</DialogTitle>
                        <DialogDescription>
                            {modalMode === 'create' ? 'Fill in the details to add a new room.' : 'Update the room details below.'}
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
                                <Label htmlFor="room_type">Room Type</Label>
                                <Select 
                                    value={data.room_type_id}
                                    onValueChange={(value) => setData('room_type_id', value)}
                                    disabled={!data.hotel_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select room type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {editRoomTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id.toString()}>
                                                {type.name} - ${type.price_per_night}/night
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.room_type_id && (
                                    <p className="text-sm text-red-500">{errors.room_type_id}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="room_number">Room Number</Label>
                                <Input
                                    id="room_number"
                                    value={data.room_number}
                                    onChange={(e) => handleRoomNumberChange(e.target.value)}
                                    placeholder="e.g., 101, A-201"
                                    disabled={isCheckingRoom}
                                />
                                {roomNumberError && (
                                    <p className="text-sm text-red-500">{roomNumberError}</p>
                                )}
                                {errors.room_number && !roomNumberError && (
                                    <p className="text-sm text-red-500">{errors.room_number}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="floor">Floor</Label>
                                <Input
                                    id="floor"
                                    value={data.floor}
                                    onChange={(e) => setData('floor', e.target.value)}
                                    placeholder="e.g., 1, 2, 3"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Room description"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_available"
                                    checked={data.is_available}
                                    onCheckedChange={(checked) => setData('is_available', checked as boolean)}
                                />
                                <Label htmlFor="is_available">Available</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {modalMode === 'create' ? 'Add Room' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Rooms.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rooms', href: '/rooms' },
    ],
};