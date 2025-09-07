"use client"

import { useEffect, useState } from "react"

import {
    User,
    FileText,
    History,
    MessageSquare,
    Star,
    AlertTriangle,
    HelpCircle,
} from "lucide-react";

import { useLanguage } from '../../context/LanguageContext';
import LicenseManagement from './Licensemanagement';
import ProfileSidebar from './Sidebar';
import AccountDetails from './AccountDetails';
import RentalHistory from './RentalHistory';
import { useParams } from "next/navigation";
import BookingDetails from "./BookingDetails";
import RateRental from "./RateRental";
import SubmitComplaint from "./SubmitComplaint";
import ContactSupport from "./ContactSupport";

const UserProfile = () => {
    const [selectedMenu, setSelectedMenu] = useState("account-details")
    const { t } = useLanguage();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        firstName: "Vimal",
        lastName: "Kumar",
        email: "vimalkumar@gmail.com",
        phone: "+49 1234567890",
        address: "Ahmedabad Gujarat 382 - India",
        gender: "male",
        user_id:0
    })

    const menuItems = [
        {
            id: "account-details",
            label: `${t('user.menu.accountDetails')}`,
            icon: User,
            hasSubmenu: false,
        },
        {
            id: "license-management",
            label: `${t('user.menu.licenseManagement')}`,
            icon: FileText,
            hasSubmenu: false,
        },
        {
            id: "rental-history",
            label: `${t('user.menu.rentalHistory')}`,
            icon: History,
            hasSubmenu: false,
        },
        {
            id: "feedback-section",
            label: `${t('user.menu.feedbackSection')}`,
            icon: MessageSquare,
            hasSubmenu: true,
            submenu: [
                { id: "rate-rental", label: `${t('user.menu.rateRental')}`, icon: Star },
                { id: "submit-complaint", label: `${t('user.menu.submitComplaint')}`, icon: AlertTriangle },
                { id: "contact-support", label: `${t('user.menu.contactSupport')}`, icon: HelpCircle },
            ],
        },
    ]

    useEffect(() => {
        setSelectedMenu(id as string);

    }, [id])

    useEffect(()=>{
    console.log("selectedMenu",selectedMenu)
       },[selectedMenu])

    return (
        <div className="min-h-[80vh] bg-[#1a1a1a] text-white flex items-center">
            {/* Desktop Sidebar - Hidden on mobile, visible on md and up */}
            <div className="hidden md:block">
                <ProfileSidebar
                    menuItems={menuItems}
                    selectedMenu={selectedMenu}
                    setSelectedMenu={setSelectedMenu}
                    formData={formData as any}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 h-full p-4 md:p-8 overflow-y-auto mt-5 md:mt-5">
                {/* Mobile Header - Only visible on small screens */}
                <div className="md:hidden mb-6 pt-12">
                    <h1 className="text-xl font-semibold capitalize">
                        {menuItems.find((item) => item.id === selectedMenu)?.label || 'Profile'}
                    </h1>
                </div>

                {selectedMenu === "account-details" && (
                    <AccountDetails formData={formData as any} setFormData={setFormData as any} />
                )}

                {selectedMenu === "license-management" && (
                    <LicenseManagement userData={formData as any} />
                )}

                {selectedMenu === "rental-history" && (
                    <RentalHistory 
                    setSelectedMenu={setSelectedMenu as any}
                    formData={formData as any} 
                     />
                )}
                 {selectedMenu === "booking-details" && (
                    <BookingDetails onBack={()=>setSelectedMenu("rental-history")} />
                )}
                 {selectedMenu === "rate-rental" && (
                    <RateRental  />
                )}
                {selectedMenu === "submit-complaint" && (
                    <SubmitComplaint  />
                )}
                 {selectedMenu === "contact-support" && (
                    <ContactSupport  />
                )}
                
            </div>
        </div>
    )
}

export default UserProfile