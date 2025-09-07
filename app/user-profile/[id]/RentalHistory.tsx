import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import assets from 'app/assets/assets';
interface RentalHistoryProps {
    setSelectedMenu: (menuId: string) => void;
    formData?: FormData;
}
const RentalHistory: React.FC<RentalHistoryProps> = ({
    setSelectedMenu,
}) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('upcoming');

    // Sample data - replace with your actual data
    const bookingData = {
        upcoming: [
            {
                id: 1,
                bookingDate: '10/04/2025',
                car: {
                    name: 'Porsche Cayenne GTS 2022',
                    type: 'Auto | 5 Seats | Petrol',
                    image: '/api/placeholder/80/60', // Replace with actual image path
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
                    image: '/api/placeholder/80/60', // Replace with actual image path
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

    return (
        <div className={`${currentBookings.length === 0 ? "" : "max-w-4xl"} relative top-[50px]`}>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold hidden md:block text-white">{t('user.profile.rentalHistory.title')}</h1>
            </div>

            {/* Main Content Container */}
            <div className=" rounded-lg ">
                {/* Tabs */}
                <div className="flex ">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'upcoming'
                            ? 'text-gray-400 bg-gray-700 rounded-full '
                            : 'text-gray-700 hover:text-white'
                            }`}
                    >
                     {t('user.profile.rentalHistory.upcomingBooking')} 
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'past'
                            ? 'text-gray-400 bg-gray-700 rounded-full'
                            : 'text-gray-700 hover:text-white'
                            }`}
                    >
                     {t('user.profile.rentalHistory.pastBooking')} 
                       
                    </button>
                </div>

                {/* Bookings List */}
                <div className="p-6 space-y-6 ">
                    {currentBookings.length === 0 ? (
                        <div className="text-center py-12 d-flex justify-center">
                            <img src={assets.carImage} className='justify-self-center' alt="No bookings illustration" />
                            <p className=" text-bold text-xl">
                                No {activeTab} bookings found!
                            </p>
                            <p className='m-0 mt-3 text-grey-400'>
                                You don’t have any bookings at the moment.
                                
                            </p>
                            <p className='mb-3'>
                                Browse our range of cars and plan your next ride.
                            </p>
                            <button
                            onClick={()=> window.location.href = '/landing'}
                                className="px-8  py-3 w-full md:w-[300px] bg-[#F3B753] text-black font-medium rounded-lg hover:bg-[#F3B753]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Explore Our cars
                            </button>

                        </div>
                    ) : (
                        currentBookings.map((booking) => (
                            <div key={booking.id} className="space-y-4">
                                {/* Booking Date */}
                                <div className="text-white text-sm">
                                    <span className="font-medium"> {t('user.profile.rentalHistory.bookingDate')}:
                                         </span>
                                    <span>{booking.bookingDate}</span>
                                </div>

                                {/* Booking Card */}
                                <div className="border border-gray-700 rounded-lg p-4 ">
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
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
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

                                        {/* View Details Button */}
                                        <button
                                            onClick={() => setSelectedMenu("booking-details")}
                                            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium"
                                        >
                                            View Details
                                            <ChevronRight size={16} />
                                        </button>
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
                                            <span className="text-gray-400">{t('user.profile.rentalHistory.tripEndDateAndTime')}:</span>
                                            <span className="text-white">
                                                {booking.tripEnd.date}, {booking.tripEnd.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RentalHistory;