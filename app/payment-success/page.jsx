import React from "react";


export default function PaymentSuccess() {
  return (
    <div className="min-h-screen mt-[100px] flex flex-col items-center justify-center bg-[#181818] text-white px-4">
      
      {/* Success Icon */}
      <div className="mb-4 flex w-full justify-center mt-8 text-center">
       <img src='./rightTic.svg' width={72} height={72} alt="Success checkmark" />
      </div>
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2 text-center">Payment Successful</h1>
      <p className="text-gray-400 mb-6 text-center">You're all set! Your ride is booked, and the road is waiting.</p>
      {/* Illustration Placeholder */}
      <div className="mb-8 mr-[50px]">
        {/* Replace this with your SVG or image */}
        <img src="/success.png" alt="Car booking illustration" width={410} height={215} />
      </div>
      {/* Details Card */}
      <div className="bg-[#232323] rounded-lg shadow-lg p-6 w-full max-w-xl mb-8 border border-[#333]">
        {/* Booking Details */}
        <div className="mb-4">
          <h2 className="font-semibold text-white mb-2">Booking Details</h2>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Car:</span>
            <span>Porsche Cayenne GTS 2022</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Trip Start Date & Time:</span>
            <span>12/04/2025, 20:00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Trip End Date & Time:</span>
            <span>14/04/2025, 20:00</span>
          </div>
        </div>
        <hr className="border-[#333] my-2" />
        {/* Payment Details */}
        <div className="mb-4">
          <h2 className="font-semibold text-white mb-2">Payment Details</h2>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Booking ID:</span>
            <span>12345666</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Transaction ID:</span>
            <a href="#" className="text-blue-400 underline break-all">123E66RXKMKMKMKMKMN66</a>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Payment Method:</span>
            <span>Credit Card</span>
          </div>
        </div>
        <hr className="border-[#333] my-2" />
        {/* Price Breakdown */}
        <div className="mb-4">
          <h2 className="font-semibold text-white mb-2">Price Breakdown</h2>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Base Fare (3 Days):</span>
            <span>€800</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Insurance:</span>
            <span>€100</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Taxes:</span>
            <span>€10</span>
          </div>
        </div>
        <div className="flex justify-between text-lg font-bold mt-4">
          <span>Total Amount:</span>
          <span className="text-white">€750</span>
        </div>
      </div>
      {/* Button */}
      <button className="bg-[#FFC043] hover:bg-[#ffb300] text-black font-semibold py-3 px-8 rounded-lg text-lg transition-colors w-full max-w-md mb-8">Go to My Bookings</button>
    </div>
  );
}
