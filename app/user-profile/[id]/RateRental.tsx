import { useEffect, useState } from 'react';
import { X, Star } from 'lucide-react';
import { useLanguage } from 'app/context/LanguageContext';
import { bookingList, bookRating } from 'app/services/api';
import { toast } from 'react-toastify';

// Define proper interfaces based on API response
interface CarDetails {
    id: number;
    brand: string;
    model: string;
    year: number;
    color: string;
    car_number: string;
    price_per_day: string;
    thumbnail_image: string;
}

interface UserDetails {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_country_code: string | null;
    phone_number: string;
    profile_pic: string;
}

interface TransactionDetail {
    transaction_id: string;
    amount: number;
    payment_method: string;
    status: string;
    created_at: string;
}

interface Booking {
    id: number;
    rating_details: any;
    car_details: CarDetails;
    user_details: UserDetails;
    transaction_detail: TransactionDetail;
    created_at: string;
    updated_at: string;
    booking_id: string;
    start_date: string;
    end_date: string;
    total_days: number;
    status: string;
    payment_status: string;
    total_amount: string;
}

const RateRental = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [showRatingPopup, setShowRatingPopup] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const { t, language } = useLanguage();
    const [bookingData, setBookingData] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);

    // Get booking data
    const getBookingData = async (type: string) => {
        try {
            setLoading(true);
            const response = await bookingList(type, language) as any;
            if (response.status) {
                setBookingData(response.data);
            }
        } catch (error:any) {
            console.error('Error fetching booking data:', error);
            toast.error(error?.response?.data?.message||"An unexpected error occure")
            setBookingData([]);
        } finally {
            setLoading(false);
        }
    };

    // Submit booking rating
    const bookingRating = async () => {
        if (!selectedBookingId || !rating) {
            toast.error('Please provide a rating');
            return;
        }

        try {
            const data = {
                booking_id: selectedBookingId.toString(),
                rating: rating.toString(),
                comment: feedback,
            };
            
            const response = await bookRating(data as any) as any;
            if (response.status) {
                toast.success(response.message || 'Rating submitted successfully');
                setShowRatingPopup(false);
                setRating(0);
                setFeedback('');
                setHoveredStar(0);
                setSelectedBookingId(null);
                // Refresh the booking data
                getBookingData("Confirmed");
            } else {
                toast.error(response.message || 'Failed to submit rating');
            }
        } catch (error : any) {
            console.error('Error submitting rating:', error);
            toast.error(error.response.data.message||'An error occurred while submitting rating');
        }
    };

    useEffect(() => {
        getBookingData("past");
    }, [language]);

    const handleRateExperience = (bookingId: number) => {
        setSelectedBookingId(bookingId);
        setShowRatingPopup(true);
        setRating(0);
        setFeedback('');
        setHoveredStar(0);
    };

    const handleStarClick = (starValue: number) => {
        setRating(starValue);
    };

    const handleStarHover = (starValue: number) => {
        setHoveredStar(starValue);
    };

    const handleCancel = () => {
        setShowRatingPopup(false);
        setRating(0);
        setFeedback('');
        setHoveredStar(0);
        setSelectedBookingId(null);
    };

    // Format date helper function
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Format time helper function  
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-600';
            case 'pending':
                return 'bg-yellow-600';
            case 'completed':
                return 'bg-blue-600';
            case 'cancelled':
                return 'bg-red-600';
            default:
                return 'bg-gray-600';
        }
    };

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold hidden md:block text-white">
                    {t('user.menu.rateRental')}
                </h1>
            </div>

            <div className="rounded-lg">

                {loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">Loading bookings...</p>
                    </div>
                )}

                <div className="p-6 space-y-6">
                    {!loading && bookingData.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">
                                No confirmed bookings found
                            </p>
                        </div>
                    ) : (
                        bookingData.map((booking) => (
                            <div key={booking.id} className="space-y-4">
                                <div className="text-white text-sm">
                                    <span className="font-medium">
                                        {t('user.profile.rentalHistory.bookingDate')}: 
                                    </span>
                                    <span> {formatDate(booking.created_at)}</span>
                                </div>

                                <div className="border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-15 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                                <img 
                                                    src={booking.car_details.thumbnail_image} 
                                                    alt={`${booking.car_details.brand} ${booking.car_details.model}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as any).style.display = 'none';
                                                        (e.target as any).nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div className="w-full h-full bg-gray-600 items-center justify-center text-gray-400 text-xs hidden">
                                                    Car Image
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-white font-medium text-lg">
                                                        {booking.car_details.brand} {booking.car_details.model} ({booking.car_details.year})
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {booking.car_details.color} • {booking.car_details.car_number}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    {t('user.profile.rentalHistory.amountPaid')}: 
                                                    <span className="text-white"> €{booking.total_amount}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm">
                                        <div>
                                            <span className="text-gray-400">
                                                {t('user.profile.rentalHistory.tripStartDateAndTime')}: 
                                            </span>
                                            <span className="text-white">
                                                {formatDate(booking.start_date)}, {formatTime(booking.start_date)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">
                                                {t('user.profile.rentalHistory.tripEndDateAndTime')}: 
                                            </span>
                                            <span className="text-white">
                                                {formatDate(booking.end_date)}, {formatTime(booking.end_date)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-2 text-sm text-gray-400">
                                        <span>Total Days: </span>
                                        <span className="text-white">{booking.total_days}</span>
                                        <span className="ml-4">Booking ID: </span>
                                        <span className="text-white">{booking.booking_id}</span>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end text-sm">
                                        {booking.rating_details ? (
                                            <div className="text-gray-400 text-sm">
                                                Already rated
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleRateExperience(booking.id)}
                                                className="flex items-center gap-2 bg-[#F3B753] text-black px-3 py-2 rounded-sm transition-colors text-sm font-medium hover:bg-[#e6a945]"
                                            >
                                                {t('user.profile.rentalHistory.rateExperience')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showRatingPopup && (
                <div className="fixed inset-0 bg-[#000000a1] bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1D1B11] border border-[#F3B753] rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">Rate your Experience</h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-gray-400 text-sm mb-6">
                            Help us improve our service to best suit your needs by rating us here!
                        </p>

                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleStarClick(star)}
                                    onMouseEnter={() => handleStarHover(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    className="transition-colors"
                                >
                                    <Star
                                        size={32}
                                        className={`${
                                            star <= (hoveredStar || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-500'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>

                        {rating > 0 && (
                            <div className="text-center mb-4">
                                <p className="text-white">
                                    {rating === 1 && "Poor"}
                                    {rating === 2 && "Fair"} 
                                    {rating === 3 && "Good"}
                                    {rating === 4 && "Very Good"}
                                    {rating === 5 && "Excellent"}
                                </p>
                            </div>
                        )}

                        <div className="mb-6">
                            <p className="text-white font-medium mb-2">Can you tell us more?</p>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Tell us about your experience..."
                                className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#F3B753] focus:border-transparent"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-4 py-2 bg-[#1D1B11] border border-[#F3B753] text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={bookingRating}
                                disabled={rating === 0}
                                className="flex-1 px-4 py-2 bg-[#F3B753] text-black rounded-md hover:bg-[#e6a945] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RateRental;