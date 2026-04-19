import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Stats {
    total_hotels: number;
    total_rooms: number;
    total_guests: number;
    total_bookings: number;
    total_revenue: number;
    pending_bookings: number;
    confirmed_bookings: number;
    checked_in: number;
}

interface HotelStat {
    id: number;
    name: string;
    rooms_count: number;
    bookings_count: number;
    guests_count: number;
    revenue: number;
}

interface MonthlyBooking {
    month: string;
    count: number;
    revenue: number;
}

interface Props {
    stats: Stats;
    hotelStats: HotelStat[];
    monthlyBookings: MonthlyBooking[];
}

export default function Dashboard({ stats, hotelStats, monthlyBookings }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const barChartData = {
        labels: monthlyBookings.map((b) => b.month),
        datasets: [
            {
                label: 'Bookings',
                data: monthlyBookings.map((b) => b.count),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 6,
            },
        ],
    };

    const revenueChartData = {
        labels: monthlyBookings.map((b) => b.month),
        datasets: [
            {
                label: 'Revenue ($)',
                data: monthlyBookings.map((b) => b.revenue),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderRadius: 6,
            },
        ],
    };

    const hotelChartData = {
        labels: hotelStats.map((h) => h.name),
        datasets: [
            {
                label: 'Rooms',
                data: hotelStats.map((h) => h.rooms_count),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
            {
                label: 'Bookings',
                data: hotelStats.map((h) => h.bookings_count),
                backgroundColor: 'rgba(139, 92, 246, 0.8)',
            },
        ],
    };

    const bookingStatusData = {
        labels: ['Pending', 'Confirmed', 'Checked In'],
        datasets: [
            {
                data: [stats.pending_bookings, stats.confirmed_bookings, stats.checked_in],
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6'],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    if (!mounted) {
        return null;
    }

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Hotels</p>
                                <p className="text-2xl font-bold">{stats.total_hotels}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Rooms</p>
                                <p className="text-2xl font-bold">{stats.total_rooms}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Guests</p>
                                <p className="text-2xl font-bold">{stats.total_guests}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900">
                                <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold">${stats.total_revenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Monthly Bookings</h3>
                        <div className="h-64">
                            <Bar data={barChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Monthly Revenue</h3>
                        <div className="h-64">
                            <Bar data={revenueChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Hotels Overview</h3>
                        <div className="h-64">
                            <Bar data={hotelChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Booking Status</h3>
                        <div className="h-64">
                            <Doughnut data={bookingStatusData} options={doughnutOptions} />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold">Hotel Statistics</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Hotel</th>
                                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Rooms</th>
                                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Bookings</th>
                                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Guests</th>
                                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hotelStats.map((hotel) => (
                                    <tr key={hotel.id} className="border-b">
                                        <td className="py-3 text-sm font-medium">{hotel.name}</td>
                                        <td className="py-3 text-right text-sm">{hotel.rooms_count}</td>
                                        <td className="py-3 text-right text-sm">{hotel.bookings_count}</td>
                                        <td className="py-3 text-right text-sm">{hotel.guests_count}</td>
                                        <td className="py-3 text-right text-sm">${hotel.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};