'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    gender: 'male',
    agreeToTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-[#111] p-8 rounded-xl">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Account</h1>
          <p className="text-gray-400 mb-8">Get your free account now.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-[#222] text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-[#222] text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#222] text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter email address"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#222] text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="6+ characters"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
              <div className="flex">
                <div className="flex items-center bg-[#222] rounded-l-lg px-3">
                  <Image
                    src="/india-flag.png"
                    alt="India flag"
                    width={20}
                    height={15}
                    className="mr-2"
                  />
                  <span className="text-white">+91</span>
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="flex-1 bg-[#222] text-white rounded-r-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-[#222] text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your address"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Gender</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-white">Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-white">Female</span>
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mr-2"
                required
              />
              <span className="text-sm text-gray-400">
                By signing up, I agree to{' '}
                <Link href="/terms" className="text-blue-500 hover:underline">
                  terms of use
                </Link>
                {' & '}
                <Link href="/privacy" className="text-blue-500 hover:underline">
                  privacy policy
                </Link>
                .
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F5B041] hover:bg-[#E59E2D] text-black font-semibold py-3 rounded-lg transition-colors"
            >
              Signup
            </button>

            <div className="text-center">
              <div className="text-gray-400 my-4">Or</div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-[#222] text-white py-2.5 px-4 rounded-lg hover:bg-[#333] transition-colors"
                >
                  <Image
                    src="/google-icon.png"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  Login with google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-[#222] text-white py-2.5 px-4 rounded-lg hover:bg-[#333] transition-colors"
                >
                  <Image
                    src="/apple-icon.png"
                    alt="Apple"
                    width={20}
                    height={20}
                  />
                  Login with apple
                </button>
              </div>
            </div>

            <div className="text-center text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-[#F5B041] hover:underline">
                Login
              </Link>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block">
          <Image
            src="/car-image.jpg"
            alt="Luxury car"
            width={700}
            height={1151}
            className="rounded-xl object-cover h-full"
          />
        </div>
      </div>
    </div>
  );
} 