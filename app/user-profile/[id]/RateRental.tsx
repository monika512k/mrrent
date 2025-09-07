import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useLanguage } from 'app/context/LanguageContext';

const RateRental=() => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [showRatingPopup, setShowRatingPopup] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);
    const { t } = useLanguage();
    // Sample data - replace with your actual data
    const bookingData = {
        upcoming: [
            {
                id: 1,
                bookingDate: '10/04/2025',
                car: {
                    name: 'Porsche Cayenne GTS 2022',
                    type: 'Auto | 5 Seats | Petrol',
                    image: '/api/placeholder/80/60',
                },
                amount: '€500',
                status: 'Confirmed',
                statusColor: 'bg-green-500',
                tripStart: {
                    date: '12/04/2025',
                    time: '20:00'
                },
                tripEnd: {
                    date: '14/04/2025',
                    time: '20:00'
                }
            }
        ],
        past: [
            {
                id: 2,
                bookingDate: '10/04/2025',
                car: {
                    name: 'Porsche Cayenne GTS 2022',
                    type: 'Auto | 5 Seats | Petrol',
                    image: '/api/placeholder/80/60',
                },
                amount: '€500',
                status: 'Pending',
                statusColor: 'bg-yellow-500',
                tripStart: {
                    date: '12/04/2025',
                    time: '20:00'
                },
                tripEnd: {
                    date: '14/04/2025',
                    time: '20:00'
                }
            }
        ]
    };

    const currentBookings = activeTab === 'upcoming' ? bookingData.upcoming : bookingData.past;

    const handleRateExperience = () => {
        setShowRatingPopup(true);
        setRating(0);
        setFeedback('');
        setHoveredStar(0);
    };

    const handleStarClick = (starValue:any) => {
        setRating(starValue);
    };

    const handleStarHover = (starValue:any) => {
        setHoveredStar(starValue);
    };

    const handleSubmitRating = () => {
        // Handle rating submission
        console.log('Rating submitted:', { rating, feedback });
        setShowRatingPopup(false);
        setRating(0);
        setFeedback('');
        setHoveredStar(0);
    };

    const handleCancel = () => {
        setShowRatingPopup(false);
        setRating(0);
        setFeedback('');
        setHoveredStar(0);
    };

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold hidden md:block text-white">{t('user.menu.rateRental')}</h1>
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
                    {currentBookings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">
                                No {activeTab} bookings found
                            </p>
                        </div>
                    ) : (
                        currentBookings.map((booking) => (
                            <div key={booking.id} className="space-y-4">
                                {/* Booking Date */}
                                <div className="text-white text-sm">
                                    <span className="font-medium">{t('user.profile.rentalHistory.bookingDate')}: </span>
                                    <span>{booking.bookingDate}</span>
                                </div>

                                {/* Booking Card */}
                                <div className="border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        {/* Car Info */}
                                        <div className="flex items-center gap-4">
                                            {/* Car Image */}
                                            <div className="w-20 h-15 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                                <img 
                                                    src={booking.car.image} 
                                                    alt={booking.car.name}
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

                                            {/* Car Details */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-white font-medium text-lg">
                                                        {booking.car.name}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${booking.statusColor}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {booking.car.type}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    {t('user.profile.rentalHistory.amountPaid')}: <span className="text-white">{booking.amount}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trip Details */}
                                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm">
                                        <div>
                                            <span className="text-gray-400">{t('user.profile.rentalHistory.tripStartDateAndTime')}: </span>
                                            <span className="text-white">
                                                {booking.tripStart.date}, {booking.tripStart.time}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">{t('user.profile.rentalHistory.tripEndDateAndTime')}: </span>
                                            <span className="text-white">
                                                {booking.tripEnd.date}, {booking.tripEnd.time}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end text-sm">
                                        <button
                                            onClick={() => handleRateExperience(booking.id)}
                                            className="flex items-center gap-2 bg-[#F3B753] text-black px-3 py-2 rounded-sm transition-colors text-sm font-medium hover:bg-[#e6a945]"
                                        >
                                       {t('user.profile.rentalHistory.rateExperience')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Rating Popup */}
            {showRatingPopup && (
                <div className="fixed inset-0 bg-[#000000a1] bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1D1B11] border border-[#F3B753] rounded-lg p-6 w-full max-w-md mx-4">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">Rate your Experience</h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Subtitle */}
                        <p className="text-gray-400 text-sm mb-6">
                            Help us improve our tool to best suit your needs by rating us here!
                        </p>

                        {/* Star Rating */}
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

                        {/* Feedback Text */}
                        <div className="mb-6">
                            <p className="text-white font-medium mb-2">Can you tell us more?</p>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Fast and easy to use tool."
                                className="w-full h-24 px-3 py-2 bg-white border border-gray-600 rounded-md text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#F3B753] focus:border-transparent"
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
                                onClick={handleSubmitRating}
                                className="flex-1 px-4 py-2 bg-[#F3B753]  text-black rounded-md hover:bg-[#e6a945] transition-colors font-medium"
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