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

interface Guest {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    country: string | null;
    id_type: string | null;
    id_number: string | null;
    date_of_birth: string | null;
    address: string | null;
    hotel: { id: number; name: string };
}

interface Hotel {
    id: number;
    name: string;
}

interface Props {
    guests: {
        data: Guest[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    hotels: Hotel[];
    filters: {
        search?: string;
        hotel_id?: string;
    };
    showModal?: boolean;
    mode?: 'create' | 'edit';
    editingGuest?: Guest;
}

export default function Guests({ 
    guests, 
    hotels, 
    filters, 
    showModal = false, 
    mode = 'create',
    editingGuest 
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(showModal);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>(mode);
    const [editingGuestId, setEditingGuestId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedHotel, setSelectedHotel] = useState(filters.hotel_id || '');

    useEffect(() => {
        if (modalMode === 'edit' && !isModalOpen) {
            setIsModalOpen(true);
        }
    }, [modalMode, isModalOpen]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        hotel_id: editingGuest?.hotel.id.toString() || '',
        first_name: editingGuest?.first_name || '',
        last_name: editingGuest?.last_name || '',
        email: editingGuest?.email || '',
        phone: editingGuest?.phone || '',
        country: editingGuest?.country || '',
        id_type: editingGuest?.id_type || '',
        id_number: editingGuest?.id_number || '',
        date_of_birth: editingGuest?.date_of_birth ? editingGuest.date_of_birth.split('T')[0] : '',
        address: editingGuest?.address || '',
    });

    const handleSearch = () => {
        router.get('/guests', { search, hotel_id: selectedHotel }, { replace: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (modalMode === 'create') {
            post('/guests', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setModalMode('create');
                    reset();
                },
                onError: (errors) => {
                    console.log('Validation errors:', errors);
                }
            });
        } else if (editingGuestId) {
            put(`/guests/${editingGuestId}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setModalMode('create');
                    setEditingGuestId(null);
                    reset();
                },
                onError: (errors) => {
                    console.log('Validation errors:', errors);
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this guest?')) {
            router.delete(`/guests/${id}`);
        }
    };

    const openEditModal = (guest: Guest) => {
        setData({
            hotel_id: guest.hotel.id.toString(),
            first_name: guest.first_name,
            last_name: guest.last_name,
            email: guest.email,
            phone: guest.phone || '',
            country: guest.country || '',
            id_type: guest.id_type || '',
            id_number: guest.id_number || '',
            date_of_birth: guest.date_of_birth ? guest.date_of_birth.split('T')[0] : '',
            address: guest.address || '',
        });
        
        setEditingGuestId(guest.id);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingGuestId(null);
        setModalMode('create');
        reset();
    };

    return (
        <>
            <Head title="Guests" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Guests</h1>
                    <Button onClick={() => {
                        setModalMode('create');
                        setEditingGuestId(null);
                        setIsModalOpen(true);
                    }}>
                        Add Guest
                    </Button>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Input
                        placeholder="Search guests..."
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
                    <Button variant="outline" onClick={handleSearch}>Search</Button>
                </div>

                <div className="rounded-xl border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-4 text-left text-sm font-medium">Guest</th>
                                    <th className="p-4 text-left text-sm font-medium">Hotel</th>
                                    <th className="p-4 text-left text-sm font-medium">Contact</th>
                                    <th className="p-4 text-left text-sm font-medium">ID</th>
                                    <th className="p-4 text-right text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guests.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                            No guests found
                                        </td>
                                    </tr>
                                ) : (
                                    guests.data.map((guest) => (
                                        <tr key={guest.id} className="border-b">
                                            <td className="p-4">
                                                <div className="font-medium">{guest.first_name} {guest.last_name}</div>
                                                <div className="text-sm text-muted-foreground">{guest.country || '-'}</div>
                                            </td>
                                            <td className="p-4">{guest.hotel.name}</td>
                                            <td className="p-4">
                                                <div>{guest.email}</div>
                                                <div className="text-sm text-muted-foreground">{guest.phone || 'No phone'}</div>
                                            </td>
                                            <td className="p-4">
                                                <div>{guest.id_type || '-'}</div>
                                                <div className="text-sm text-muted-foreground">{guest.id_number || 'No ID'}</div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => openEditModal(guest)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => handleDelete(guest.id)}
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

                    {guests.links && guests.links.length > 3 && (
                        <div className="flex items-center justify-center gap-2 p-4">
                            {guests.links.map((link, index) => (
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
                        <DialogTitle>{modalMode === 'create' ? 'Add New Guest' : 'Edit Guest'}</DialogTitle>
                        <DialogDescription>
                            {modalMode === 'create' ? 'Fill in the guest details below.' : 'Update the guest details below.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="hotel">Hotel</Label>
                                <Select 
                                    value={data.hotel_id} 
                                    onValueChange={(value) => setData('hotel_id', value)}
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        placeholder="John"
                                    />
                                    {errors.first_name && (
                                        <p className="text-sm text-red-500">{errors.first_name}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        placeholder="Doe"
                                    />
                                    {errors.last_name && (
                                        <p className="text-sm text-red-500">{errors.last_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="guest@example.com"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        placeholder="USA"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="id_type">ID Type</Label>
                                    <Select 
                                        value={data.id_type} 
                                        onValueChange={(value) => setData('id_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select ID type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="passport">Passport</SelectItem>
                                            <SelectItem value="drivers_license">Driver's License</SelectItem>
                                            <SelectItem value="national_id">National ID</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="id_number">ID Number</Label>
                                    <Input
                                        id="id_number"
                                        value={data.id_number}
                                        onChange={(e) => setData('id_number', e.target.value)}
                                        placeholder="AB1234567"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="123 Main St, City"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {modalMode === 'create' ? 'Add Guest' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Guests.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Guests', href: '/guests' },
    ],
};