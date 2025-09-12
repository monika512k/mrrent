'use client';
import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { UploadCloud, ChevronLeft, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import assets from 'app/assets/assets';
import { useRouter, useSearchParams } from 'next/navigation';
import {  uploadLicence } from 'app/services/api';
import { ToastMsg } from 'app/Common/Toast';

interface UploadResult {
  status: boolean;
  message?: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Separate component that uses useSearchParams
const UploadDocumentsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const detailsParam = searchParams.get("details");

  // Parse JSON safely
  const details = useMemo(() => {
    if (!detailsParam) return null;
    try {
      console.log("Parsed details:", JSON.parse(detailsParam));
      return JSON.parse(detailsParam);
    } catch (e) {
      console.error("Failed to parse details:", e);
      return null;
    }
  }, [detailsParam]);

  const frontRef = useRef<HTMLInputElement | null>(null);
  const backRef = useRef<HTMLInputElement | null>(null);
  const mobileRef = useRef<HTMLInputElement | null>(null);

  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Form data states
  const [formData, setFormData] = useState({
    dob: '',
    expiry: '',
    issue: '',
    license: ''
  });

  const validFileTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/zip'];

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview?: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (setPreview && !validFileTypes.includes(file.type)) {
      alert('Invalid file type. Please upload .jpg, .png, .svg, or .zip files.');
      return;
    }

    if (!setPreview && file.type !== 'application/pdf') {
      alert('Invalid file type. Please upload a .pdf file.');
      return;
    }

    setFile(file);
    setUploadError(null); // Clear any previous errors
    
    if (setPreview && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } else if (setPreview) {
      setPreview(null);
    }
  };

  const handleDelete = (
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview?: React.Dispatch<React.SetStateAction<string | null>>,
    ref?: React.RefObject<HTMLInputElement | null>
  ) => {
    setFile(null);
    if (setPreview) setPreview(null);
    if (ref?.current) {
      ref.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission and API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.dob || !formData.expiry || !formData.issue) {
      setUploadError('Please fill in all date fields');
      return;
    }

    // Check if at least one file is uploaded
    const hasDesktopFiles = frontFile || backFile;
    const hasMobileFile = mobileFile;
    
    if (!hasDesktopFiles && !hasMobileFile) {
      setUploadError('Please upload at least one license document');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formDataToSend = new FormData();
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      formDataToSend.append('date_of_birth', formData.dob);
      formDataToSend.append('expiry_date', formData.expiry);
      formDataToSend.append('issue_date', formData.issue);
      formDataToSend.append('user_id', user.user_id || ''); // Ensure user_id is included
      formDataToSend.append('licence_number', formData.license);
      formDataToSend.append('upload_type', 'license'); // Use a default or provided vehicle ID
      if (frontFile) {
        formDataToSend.append('front_image', frontFile);
      }
      if (backFile) {
        formDataToSend.append('back_image', backFile);
      }
      if (mobileFile) {
        formDataToSend.append('mobileLicense', mobileFile);
      }
      // Call API
      const result = await uploadLicence(formDataToSend) as UploadResult;
      if(result?.status){
         setShowModal(true);
      }else {
        setUploadError(result?.message || 'Upload failed. Please try again.');
      }
    } catch (error: unknown) {
      const errorResponse = error as ErrorResponse;
      setUploadError(errorResponse?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      if (backPreview) URL.revokeObjectURL(backPreview);
    };
  }, [frontPreview, backPreview]);

  const uploads = [
    {
      ref: frontRef,
      file: frontFile,
      preview: frontPreview,
      setFile: setFrontFile,
      setPreview: setFrontPreview,
      label: 'License (Front)',
    },
    {
      ref: backRef,
      file: backFile,
      preview: backPreview,
      setFile: setBackFile,
      setPreview: setBackPreview,
      label: 'License (Back)',
    },
  ];

  return (
    <div className="bg-[#121212] text-white mt-18 px-4 py-10 flex flex-col items-center">
      {/* Booking Info */}
      <div className="w-full max-w-[1285px] border border-[#F6e19b] rounded-lg lg:mb-12 mb-6 p-4 bg-gradient-to-b from-[rgba(255,242,221,0.05)] to-[rgba(235,233,230,0.05)] backdrop-blur-[37.2px]">
        <div className="text-center font-semibold text-base mb-2">Booking Details</div>
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm lg:px-12">
          <div className="font-normal flex gap-[10px]">
            <span className="font-semibold">Vehicle Name:</span>
            <span>{details?.vehical_name || "Porsche Cayenne GTS 2022"}</span>
          </div>
          <div className="font-normal flex gap-[10px]">
            <span className="font-semibold">Trip Start Date & Time:</span>
            <span>{details?.start_date || "12/04/2025, 20:00"}</span>
          </div>
          <div className="font-normal flex gap-[10px]">
            <span className="font-semibold">Trip End Date & Time:</span>
            <span>{details?.end_date || "14/04/2025, 20:00"}</span>
          </div>
          <div className="font-normal flex gap-[10px]">
            <span className="font-semibold">Total Price:</span>
            <span>€ {details?.total_amount || "200.00"}</span>
          </div>
        </div>
      </div>

      {/* Upload */}
      <div className="w-full max-w-[1285px] flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-2 text-center">Upload Documents</h2>
        <p className="text-[#F6F6F6]/70 font-normal text-center mb-10 max-w-[589px] text-lg">
          Please upload a valid copy of your driving license. Your license will be verified before you can proceed to the next step
        </p>

        {/* Error Message */}
        {uploadError && (
          <div className="w-full max-w-[540px] mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm text-center">{uploadError}</p>
          </div>
        )}

        <form className="w-full flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
            <div className="flex flex-col gap-6">
              <InputDate 
                label="Date of Birth" 
                name="dob" 
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
              <InputDate 
                label="Expiry Date" 
                name="expiry" 
                value={formData.expiry}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col gap-6">
              <InputDate 
                label="Issue Date" 
                name="issue" 
                value={formData.issue}
                onChange={handleInputChange}
                required
              />
             <InputText
                label="License Number"
                name="license"
                value={formData.license}
                onChange={handleInputChange}
                required
              />
               
            </div>
           
          </div>

          {/* Upload Sections - Desktop */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
            {uploads.map(({ ref, file, preview, setFile, setPreview, label }, i) => (
              <div className="flex flex-col items-center" key={i}>
                <label className="block text-[#454545] text-sm mb-1 w-full max-w-[540px]">{label}</label>
                <div
                  className={`border border-dashed border-[#454545] w-full max-w-[540px] rounded-lg min-h-[89px] px-4 py-3 ${
                    file ? '' : 'cursor-pointer hover:border-[#F3B753]'
                  }`}
                  onClick={() => !file && ref.current?.click()}
                >
                  {!file ? (
                    <div className="flex flex-col w-full text-center items-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[#F3B753] font-semibold text-base">Upload Driving License</span>
                        <UploadCloud className="w-6 h-6 text-[#454545]" />
                      </div>
                      <span className="block text-xs text-[#454545] mt-2">
                        Only supports .jpg, .png, .svg, and .zip files
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4 ">
                      <div className="flex items-center gap-4 ">
                        {preview && (
                          <Image
                            src={preview}
                            alt="Preview"
                            width={80}
                            height={60}
                            className="object-cover rounded-md"
                          />
                        )}
                        <div>
                          <p className="text-sm text-[#6B7280]">
                            {(file.size / 1024).toFixed(0)} KB of {(file.size / 1024).toFixed(0)} KB
                          </p>
                          <div className="flex items-center gap-1 text-[#6B7280] text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Completed
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(setFile, setPreview, ref);
                        }}
                      >
                        <Trash2 className="w-5 h-5 text-white hover:text-red-500" />
                      </button>
                    </div>
                  )}
                  <input
                    ref={ref}
                    type="file"
                    className="hidden"
                    accept=".jpg,.png,.svg,.zip"
                    onChange={(e) => handleFileChange(e, setFile, setPreview)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Upload Section - Mobile Only */}
          <div className="block md:hidden relative max-w-[540px] ">
            <div className="relative ">
              <label className="absolute -top-2 left-3 inline-block rounded-md bg-[#121212] px-1 text-xs font-medium text-[#454545] z-10">
                Upload License
              </label>
              <div
                className="border border-[#454545] rounded-xl px-4 pt-6 pb-6 flex justify-between items-center w-full cursor-pointer"
                onClick={() => mobileRef.current?.click()}
              >
                <span className="text-[#F3B753] font-semibold text-base">Upload Driving License</span>
                <UploadCloud className="w-6 h-6 text-[#454545]" />
                <input
                  ref={mobileRef}
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, setMobileFile)}
                />
              </div>
            </div>
            <p className="text-[#454545] text-xs mt-2">Upload file in .pdf format only</p>
            {mobileFile && (
              <div className="flex justify-between items-center mt-2 w-full">
                <p className="text-[#6B7280] text-sm">{mobileFile.name}</p>
                <button
                  type="button"
                  onClick={() => handleDelete(setMobileFile, undefined, mobileRef)}
                >
                  <Trash2 className="w-5 h-5 text-white hover:text-red-500" />
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full max-w-[540px] mx-auto bg-[#F3B753] text-black font-bold text-lg rounded-lg py-4 hover:bg-[#e3a640] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              'Proceed'
            )}
          </button>
        </form>

        {/* Back Button */}
        <button 
          className="flex items-center gap-2 mt-8 text-[#F6F6F6] hover:text-[#F3B753] transition text-base"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Previous step
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1.5px]">
          <div className="relative bg-[#121212] border-2 border-[#F3B753] rounded-lg shadow-lg w-[335px] lg:w-[636px] max-w-[335px] max-w-[636px] h-[394.6px] lg:h-[552px] p-4 flex flex-col items-center text-center gap-[11.97px] lg:gap-[16px]">
            {/* Document Icon */}
            <span className="mb-[29.94px] lg:mb-[40px] lg:mt-[55.2px]">
              <Image 
                src={assets.Objects} 
                alt="Document Verification" 
                width={114} 
                height={112} 
                className="w-[85.06px] lg:w-[114.78px] h-[83px] lg:h-[112px] mx-auto" 
              />
            </span>
            <h3 className="text-lg lg:text-2xl font-medium  text-[#f6f6f6]">Verification Pending</h3>
            <p className="text-[#f6f6f6] text-sm lg:text-lg font-normal ">We&apos;re verifying your documents.</p>
            <p className="text-[#f6f6f6] text-sm lg:text-lg font-normal">You&apos;ll get an email confirmation once approved, then you can proceed.</p>
            <p className="text-[#f6f6f6] text-sm lg:text-lg font-normal mb-[29.94px]">Meanwhile, check out our other cars.</p>
            <button
              className="w-[303px] lg:w-[540px] h-[99px] lg:h-[57.6px] bg-[#F3B753] mb-[14.4px] text-black font-semibold text-lg rounded-[5.99px]  hover:bg-[#e3a640] transition cursor-pointer"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="bg-[#121212] text-white min-h-screen flex items-center justify-center">
      <p>Loading upload documents...</p>
    </div>
  );
}

// Input components remain the same
const InputDate = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false 
}: { 
  label: string; 
  name: string; 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => (
  <div className="relative mx-auto w-full max-w-[540px]">
    <label
      htmlFor={name}
      className="absolute -top-2 left-3 inline-block rounded-md bg-[#121212] px-1 text-xs font-medium text-[#454545]"
    >
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type="date"
      value={value}
      onChange={onChange}
      required={required}
      className="hide-date-icon w-full bg-transparent border border-[#454545] rounded-md py-3 px-4 text-[#454545] focus:outline-none focus:border-[#F3B753]"
    />
  </div>
);

const InputText = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false 
}: { 
  label: string; 
  name: string; 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => (
  <div className="relative mx-auto w-full max-w-[540px]">
    <label
      htmlFor={name}
      className="absolute -top-2 left-3 inline-block rounded-md bg-[#121212] px-1 text-xs font-medium text-[#454545]"
    >
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      id={name}
      name={name}
      placeholder={label}
      type="text"
      value={value}
      onChange={onChange}
      required={required}
      className="hide-date-icon w-full bg-transparent border border-[#454545] rounded-md py-3 px-4 text-[#454545] focus:outline-none focus:border-[#F3B753]"
    />
  </div>
);

// Main component wrapped with Suspense
const UploadDocuments = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UploadDocumentsContent />
    </Suspense>
  );
};

export default UploadDocuments;