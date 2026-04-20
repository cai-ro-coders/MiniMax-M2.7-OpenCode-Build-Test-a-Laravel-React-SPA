import { Head } from '@inertiajs/react';
import { router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

interface Hotel {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string | null;
    email: string | null;
    star_rating: number;
    description: string | null;
    is_active: boolean;
    created_at: string;
}

interface Props {
    hotels: {
        data: Hotel[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        status?: string;
    };
    showModal?: boolean;
    mode?: 'create' | 'edit';
    editingHotel?: Hotel;
}

export default function Hotels({ 
    hotels, 
    filters, 
    showModal = false, 
    mode = 'create',
    editingHotel 
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(showModal);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>(mode);
    const [editingHotelId, setEditingHotelId] = useState<number | null>(editingHotel?.id || null);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    useEffect(() => {
        if (modalMode === 'edit' && !isModalOpen) {
            setIsModalOpen(true);
        }
    }, [modalMode, isModalOpen]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: editingHotel?.name || '',
        address: editingHotel?.address || '',
        city: editingHotel?.city || '',
        country: editingHotel?.country || '',
        phone: editingHotel?.phone || '',
        email: editingHotel?.email || '',
        star_rating: editingHotel?.star_rating?.toString() || '3',
        description: editingHotel?.description || '',
        is_active: editingHotel?.is_active ?? true,
    });

    const handleSearch = () => {
        router.get('/hotels', { search, status: selectedStatus }, { replace: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (modalMode === 'create') {
            post('/hotels', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setModalMode('create');
                    reset();
                },
                onError: (errors) => {
                    console.log('Validation errors:', errors);
                }
            });
        } else if (editingHotelId) {
            put(`/hotels/${editingHotelId}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setModalMode('create');
                    setEditingHotelId(null);
                    reset();
                },
                onError: (errors) => {
                    console.log('Validation errors:', errors);
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this hotel?')) {
            router.delete(`/hotels/${id}`);
        }
    };

    const openEditModal = (hotel: Hotel) => {
        setData({
            name: hotel.name,
            address: hotel.address,
            city: hotel.city,
            country: hotel.country,
            phone: hotel.phone || '',
            email: hotel.email || '',
            star_rating: hotel.star_rating.toString(),
            description: hotel.description || '',
            is_active: hotel.is_active,
        });
        
        setEditingHotelId(hotel.id);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingHotelId(null);
        setModalMode('create');
        reset();
    };

    const renderStarRating = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <>
            <Head title="Hotels" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Hotels</h1>
                    <Button onClick={() => {
                        setModalMode('create');
                        setEditingHotelId(null);
                        setIsModalOpen(true);
                    }}>
                        Add Hotel
                    </Button>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Input
                        placeholder="Search hotels..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="max-w-xs"
                    />
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleSearch}>Search</Button>
                </div>

                <div className="rounded-xl border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-4 text-left text-sm font-medium">Hotel</th>
                                    <th className="p-4 text-left text-sm font-medium">Location</th>
                                    <th className="p-4 text-left text-sm font-medium">Rating</th>
                                    <th className="p-4 text-left text-sm font-medium">Status</th>
                                    <th className="p-4 text-right text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hotels.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                            No hotels found
                                        </td>
                                    </tr>
                                ) : (
                                    hotels.data.map((hotel) => (
                                        <tr key={hotel.id} className="border-b">
                                            <td className="p-4">
                                                <div className="font-medium">{hotel.name}</div>
                                                <div className="text-sm text-muted-foreground">{hotel.email || 'No email'}</div>
                                            </td>
                                            <td className="p-4">
                                                <div>{hotel.address}</div>
                                                <div className="text-sm text-muted-foreground">{hotel.city}, {hotel.country}</div>
                                            </td>
                                            <td className="p-4">
                                                {renderStarRating(hotel.star_rating)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    hotel.is_active 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }`}>
                                                    {hotel.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => openEditModal(hotel)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => handleDelete(hotel.id)}
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

                    {hotels.links && hotels.links.length > 3 && (
                        <div className="flex items-center justify-center gap-2 p-4">
                            {hotels.links.map((link, index) => (
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
                        <DialogTitle>{modalMode === 'create' ? 'Add New Hotel' : 'Edit Hotel'}</DialogTitle>
                        <DialogDescription>
                            {modalMode === 'create' ? 'Fill in the details to add a new hotel.' : 'Update the hotel details below.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Hotel Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Grand Hotel"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="123 Main Street"
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-500">{errors.address}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="New York"
                                    />
                                    {errors.city && (
                                        <p className="text-sm text-red-500">{errors.city}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        placeholder="USA"
                                    />
                                    {errors.country && (
                                        <p className="text-sm text-red-500">{errors.country}</p>
                                    )}
                                </div>
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
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="hotel@example.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="star_rating">Star Rating</Label>
                                <Select 
                                    value={data.star_rating} 
                                    onValueChange={(value) => setData('star_rating', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">★</SelectItem>
                                        <SelectItem value="2">★★</SelectItem>
                                        <SelectItem value="3">★★★</SelectItem>
                                        <SelectItem value="4">★★★★</SelectItem>
                                        <SelectItem value="5">★★★★★</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Hotel description"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {modalMode === 'create' ? 'Add Hotel' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Hotels.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Hotels', href: '/hotels' },
    ],
};