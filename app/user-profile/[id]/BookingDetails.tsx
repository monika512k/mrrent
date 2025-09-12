import { downloadInvoice } from 'app/services/api';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { useState } from 'react';

export interface Booking {
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

interface BookingDetailsProps {
    onBack: () => void;
    bookingData: Booking | null;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ onBack, bookingData }) => {
    const { t } = useLanguage();
    const [errorMsg, setErrorMsg] = useState("")
    const [loading , setLoading]=useState(false);

    if (!bookingData) {
        return (
            <div className="max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-semibold text-white">{t("user.bookingDetails.title")}</h1>
                </div>
                <div className="border border-gray-700 rounded-lg p-6">
                    <p className="text-white text-center">No booking data available</p>
                </div>
            </div>
        );
    }

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

    const getPaymentMethodDisplay = (method: string) => {
        return method || 'Online Payment';
    };

    const getLocationDisplay = (locationId: number) => {
        // You might want to fetch location details based on ID
        // For now, returning a placeholder
        return `Location ${locationId}`;
    };

    const startDateTime = formatDateTime(bookingData.start_date);
    const endDateTime = formatDateTime(bookingData.end_date);
    const carName = `${bookingData.car_details.brand} ${bookingData.car_details.model} ${bookingData.car_details.year}`;
    const extraKmCost = bookingData.extra_kms * parseFloat(bookingData.extra_km_rate);

    const handleDownloadInvoice = async () => {
        try {
            setLoading(true);
            let response = await downloadInvoice(bookingData.id) as any;
            if (response.status) {
                
                console.log('Downloading invoice for booking:', response.data);
                // Implement invoice download logic here
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setErrorMsg(error?.response?.data?.message || "An unexpected error occur")
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-semibold text-white">{t("user.bookingDetails.title")}</h1>
            </div>
            {errorMsg != "" && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-300">
                    {errorMsg}
                </div>
            )}
            <div className="border border-gray-700 rounded-lg p-6">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-lg font-medium text-gray-400">
                            {t("user.bookingDetails.details")}
                        </h2>
                        <span className={`px-3 py-1 rounded text-sm font-medium text-white ${getStatusColor(bookingData.status)}`}>
                            {bookingData.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.car")}:</span>
                                <span className="text-white">{carName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.startTime")}:</span>
                                <span className="text-white">{startDateTime.date}, {startDateTime.time}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.endTime")}:</span>
                                <span className="text-white">{endDateTime.date}, {endDateTime.time}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Days:</span>
                                <span className="text-white">{bookingData.total_days}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.pickup")}:</span>
                                <span className="text-white text-right">{getLocationDisplay(bookingData.pickup_location)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.dropoff")}:</span>
                                <span className="text-white text-right">{getLocationDisplay(bookingData.drop_location)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Car Number:</span>
                                <span className="text-white">{bookingData.car_details.car_number}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-400 mb-6">{t("user.bookingDetails.paymentDetails")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.bookingId")}:</span>
                                <span className="text-white">{bookingData.booking_id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.transactionId")}:</span>
                                <span className="text-white">{bookingData.transaction_detail.transaction_id}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.paymentMethod")}:</span>
                                <span className="text-white">{getPaymentMethodDisplay(bookingData.transaction_detail.payment_method)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Payment Status:</span>
                                <span className={`${bookingData.payment_status.toLowerCase() === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {bookingData.payment_status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-400 mb-6">{t("user.bookingDetails.priceBreakdown")}</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-400">
                                {t("user.bookingDetails.baseFare")} ({bookingData.total_days} days @ €{bookingData.base_price_per_day}/day)
                            </span>
                            <span className="text-white">€{bookingData.subtotal}</span>
                        </div>

                        {bookingData.extra_kms > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-400">
                                    {t("user.bookingDetails.extraKms")} ({bookingData.extra_kms} km @ €{bookingData.extra_km_rate}/km)
                                </span>
                                <span className="text-white">€{extraKmCost.toFixed(2)}</span>
                            </div>
                        )}

                        {parseFloat(bookingData.discount_amount) > 0 && (
                            <div className="flex justify-between">
                                <span className="text-green-400">
                                    {t("user.bookingDetails.discount")}
                                </span>
                                <span className="text-green-400">- €{bookingData.discount_amount}</span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span className="text-gray-400">{t("user.bookingDetails.taxes")} ({bookingData.tax_rate}%)</span>
                            <span className="text-white">€{bookingData.tax_amount}</span>
                        </div>

                        <div className="border-t border-gray-700 pt-4 mt-4">
                            <div className="flex justify-between text-lg font-semibold">
                                <span className="text-white">{t("user.bookingDetails.totalAmount")}:</span>
                                <span className="text-white">€{bookingData.total_amount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleDownloadInvoice}
                        className="flex items-center gap-2 px-6 py-3 bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors rounded-lg font-medium"
                    >
                      {!loading?
                      <>
                      
                      <Download size={18} />
                        {t("user.bookingDetails.downloadInvoice")}
                        </>
                        :"...downloading"}  
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;