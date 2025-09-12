import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import assets from 'app/assets/assets';
import { bookingList } from 'app/services/api';
import { useRouter } from 'next/navigation';

interface RentalHistoryProps {
    setSelectedMenu: (menuId: string) => void;
    setSelectedBooking: (booking: Booking) => void; // Add this prop
    formData?: FormData;
}

interface Booking {
    id: number;
    booking_id: string;
    car_details: {
        id: number;
        brand: string;
        model: string;
        year: number;
        color: string;
        car_number: string;
        price_per_day: string;
        thumbnail_image: string;
    };
    user_details: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone_country_code: string | null;
        phone_number: string;
        profile_pic: string;
    };
    transaction_detail: {
        transaction_id: string;
        amount: number;
        payment_method: string;
        status: string;
        created_at: string;
    };
    start_date: string;
    end_date: string;
    total_days: number;
    status: string;
    payment_status: string;
    base_price_per_day: string;
    discount_amount: string;
    subtotal: string;
    tax_rate: string;
    tax_amount: string;
    total_amount: string;
    extra_km_rate: string;
    included_km: number;
    extra_kms: number;
    created_at: string;
    pickup_location: number;
    drop_location: number;
}

const RentalHistory: React.FC<RentalHistoryProps> = ({ 
    setSelectedMenu, 
    setSelectedBooking 
}) => {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [bookingData, setBookingData] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);

    const getBookingData = async (type: string) => {
        try {
            setLoading(true);
            const response = await bookingList(type, language) as any;
            if (response.status) {
                setBookingData(response.data);
            }
        } catch (error) {
            console.error('Error fetching booking data:', error);
            setBookingData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const type = activeTab === 'upcoming' ? '' : 'past';
        getBookingData(type);
    }, [activeTab, language]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-GB'),
            time: date.toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            })
        };
    };

    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'confirmed':
                return 'bg-green-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'cancelled':
                return 'bg-red-500';
            case 'completed':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };

    const formatCarType = (carDetails: Booking['car_details']) => {
        return `Auto | ${carDetails.year} | ${carDetails.color}`;
    };

    const handleViewDetails = (booking: Booking) => {
        setSelectedBooking(booking);
        setSelectedMenu("booking-details");
    };

    const handleReBook= async(id)=>{
        router.push(`/car-description/${id}`)
    }

    return (
        <div className={`${bookingData.length === 0 ? "" : "max-w-4xl"} relative top-[50px]`}>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold hidden md:block text-white">
                    {t('user.profile.rentalHistory.title')}
                </h1>
            </div>

            {/* Main Content Container */}
            <div className="rounded-lg">
                {/* Tabs */}
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-6 py-4 text-sm font-medium transition-colors ${
                            activeTab === 'upcoming'
                                ? 'text-gray-400 bg-gray-700 rounded-full'
                                : 'text-gray-700 hover:text-white'
                        }`}
                    >
                        {t('user.profile.rentalHistory.upcomingBooking')}
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`px-6 py-4 text-sm font-medium transition-colors ${
                            activeTab === 'past'
                                ? 'text-gray-400 bg-gray-700 rounded-full'
                                : 'text-gray-700 hover:text-white'
                        }`}
                    >
                        {t('user.profile.rentalHistory.pastBooking')}
                    </button>
                </div>

                {/* Bookings List */}
                <div className="p-6 space-y-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-white">Loading...</p>
                        </div>
                    ) : bookingData.length === 0 ? (
                        <div className="text-center py-12 d-flex justify-center">
                            <img 
                                src={assets.carImage} 
                                className="justify-self-center" 
                                alt="No bookings illustration" 
                            />
                            <p className="text-bold text-xl">
                                No {activeTab} bookings found!
                            </p>
                            <p className="m-0 mt-3 text-grey-400">
                                You don't have any bookings at the moment.
                            </p>
                            <p className="mb-3">
                                Browse our range of cars and plan your next ride.
                            </p>
                            <button
                                onClick={() => window.location.href = '/landing'}
                                className="px-8 py-3 w-full md:w-[300px] bg-[#F3B753] text-black font-medium rounded-lg hover:bg-[#F3B753]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Explore Our cars
                            </button>
                        </div>
                    ) : (
                        bookingData.map((booking) => {
                            const startDateTime = formatDateTime(booking.start_date);
                            const endDateTime = formatDateTime(booking.end_date);
                            const bookingDate = formatDate(booking.created_at);
                            
                            return (
                                <div key={booking.id} className="space-y-4">
                                    {/* Booking Date */}
                                    <div className="text-white text-sm">
                                        <span className="font-medium">
                                            {t('user.profile.rentalHistory.bookingDate')}:{' '}
                                        </span>
                                        <span>{bookingDate}</span>
                                    </div>

                                    {/* Booking Card */}
                                    <div className="border border-gray-700 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            {/* Car Info */}
                                            <div className="flex items-center gap-4">
                                                {/* Car Image */}
                                                <div className="w-20 h-15 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={booking.car_details.thumbnail_image}
                                                        alt={`${booking.car_details.brand} ${booking.car_details.model}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const fallback = target.nextSibling as HTMLElement;
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="w-full h-full bg-gray-600 items-center justify-center text-gray-400 text-xs hidden">
                                                        Car Image
                                                    </div>
                                                </div>

                                                {/* Car Details */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-white font-medium text-lg">
                                                            {booking.car_details.brand} {booking.car_details.model} {booking.car_details.year}
                                                        </h3>
                                                        <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(booking.status)}`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm">
                                                        {formatCarType(booking.car_details)}
                                                    </p>
                                                    <p className="text-gray-400 text-sm">
                                                        {t('user.profile.rentalHistory.amountPaid')}: 
                                                        <span className="text-white"> €{booking.total_amount}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* View Details Button */}
                                            <button
                                                onClick={() => handleViewDetails(booking)}
                                                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium"
                                            >
                                                {t('user.profile.rentalHistory.viewDetails')}
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>

                                        {/* Trip Details */}
                                        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm">
                                            <div>
                                                <span className="text-gray-400">
                                                    {t('user.profile.rentalHistory.tripStartDateAndTime')}: 
                                                </span>
                                                <span className="text-white">
                                                    {startDateTime.date}, {startDateTime.time}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">
                                                    {t('user.profile.rentalHistory.tripEndDateAndTime')}:
                                                </span>
                                                <span className="text-white">
                                                    {endDateTime.date}, {endDateTime.time}
                                                </span>
                                            </div>
                                        </div>
                                        {
                                            activeTab=="past"&&
                                             <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end text-sm">
                                             <button
                                                onClick={() => router.push(`/car-description/${booking.id}`)}
                                                className="flex items-center gap-2 bg-yellow-400  p-2 rounded-md  text-sm font-medium !text-black"
                                            >
                                                Rebook
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                        }
                                         
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default RentalHistory;