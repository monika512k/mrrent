import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';

const BookingDetails = ({ onBack }: { onBack: () => void }) => {
    const { t } = useLanguage();

    const bookingData = {
        id: "1212",
        status: t("user.bookingDetails.statusConfirmed"),
        statusColor: 'bg-green-500',
        car: 'Porsche Cayenne GTS 2022',
        tripStartDate: '12/04/2025',
        tripStartTime: '20:00',
        tripEndDate: '14/04/2025',
        tripEndTime: '20:00',
        pickupLocation: 'Amsinckstrasse 40, Hosena',
        dropoffLocation: 'Amsinckstrasse 40, Hosena',
        bookingId: '12345666',
        transactionId: '1235666KMKMKMKNN666',
        paymentMethod: 'Credit Card',
        baseFare: {
            days: 3,
            km: 250,
            amount: 600
        },
        extraKms: {
            km: 0,
            amount: 0
        },
        discount: {
            percentage: 10,
            amount: 20.00
        },
        taxes: 10,
        totalAmount: 590
    };

    const handleDownloadInvoice = () => {
        console.log('Downloading invoice for booking...');
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

            <div className="border border-gray-700 rounded-lg p-6">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-lg font-medium text-gray-400">
                            {t("user.bookingDetails.details")}
                        </h2>
                        <span className={`px-3 py-1 rounded text-sm font-medium text-white ${bookingData.statusColor}`}>
                            {bookingData.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.car")}:</span>
                                <span className="text-white">{bookingData.car}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.startTime")}:</span>
                                <span className="text-white">{bookingData.tripStartDate}, {bookingData.tripStartTime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.endTime")}:</span>
                                <span className="text-white">{bookingData.tripEndDate}, {bookingData.tripEndTime}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.pickup")}:</span>
                                <span className="text-white text-right">{bookingData.pickupLocation}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.dropoff")}:</span>
                                <span className="text-white text-right">{bookingData.dropoffLocation}</span>
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
                                <span className="text-white">{bookingData.bookingId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.transactionId")}:</span>
                                <span className="text-white">{bookingData.transactionId}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t("user.bookingDetails.paymentMethod")}:</span>
                                <span className="text-white">{bookingData.paymentMethod}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-400 mb-6">{t("user.bookingDetails.priceBreakdown")}</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-400">
                                {t("user.bookingDetails.baseFare")}
                            </span>
                            <span className="text-white">€{bookingData.baseFare.amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">
                                {t("user.bookingDetails.extraKms")}
                            </span>
                            <span className="text-white">€{bookingData.extraKms.amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-green-400">
                                {t("user.bookingDetails.discount")}
                            </span>
                            <span className="text-green-400">- €{bookingData.discount.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">{t("user.bookingDetails.taxes")}</span>
                            <span className="text-white">€{bookingData.taxes}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-4 mt-4">
                            <div className="flex justify-between text-lg font-semibold">
                                <span className="text-white">{t("user.bookingDetails.totalAmount")}:</span>
                                <span className="text-white">€{bookingData.totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleDownloadInvoice}
                        className="flex items-center gap-2 px-6 py-3 bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors rounded-lg font-medium"
                    >
                        <Download size={18} />
                        {t("user.bookingDetails.downloadInvoice")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
