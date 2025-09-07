"use client"

import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    LogOut,
    ChevronRight,
} from "lucide-react";
import assets from "app/assets/assets";
import { useLanguage } from "app/context/LanguageContext";

// Define TypeScript interfaces
interface SubMenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    hasSubmenu?: boolean;
    submenu?: SubMenuItem[];
}

interface FormData {
    firstName?: string;
    lastName?: string;
    gender?: 'male' | 'female';
}

interface ProfileSidebarProps {
    menuItems: MenuItem[];
    selectedMenu: string;
    setSelectedMenu: (menuId: string) => void;
    formData?: FormData;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    menuItems,
    selectedMenu,
    setSelectedMenu,
    formData
}) => {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showDropDown, setShowDropDown] = useState<string | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        const selectedItem = menuItems.find(item =>
            item.submenu?.some(subItem => subItem.id === selectedMenu)
        );

        if (selectedItem && selectedItem.hasSubmenu) {
            setShowDropDown(selectedItem.id);
        }
    }, [selectedMenu, menuItems])

    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
    };

    const handleLogoutConfirm = () => {
        console.log("User logged out");
        setShowLogoutPopup(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("user_loggedin");
        window.location.replace("/login");
    };

    const handleLogoutCancel = () => {
        setShowLogoutPopup(false);
    };

    const isMenuSelected = (item: MenuItem) => {
        if (selectedMenu === item.id) return true;
        if (item.submenu) {
            return item.submenu.some(subItem => subItem.id === selectedMenu);
        }
        return false;
    };

    return (
        <>
            <div className="w-80 mx-auto h-full bg-[#1a1a1a] m-4 p-6 flex-shrink-0 overflow-y-auto" style={{
                boxShadow: "0.4px 0px 0px rgba(243, 184, 83, 0.3)",
            }}>
                {/* Back to Home */}
                <button className="flex items-center gap-2 relative top-[25px] text-[#F3B753] mb-8 hover:text-[#F3B753] transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm" onClick={() => window.location.href = '/landing'}>back to Home</span>
                </button>

                {/* User Profile */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-700">
                        <img
                            src={formData?.gender === 'male' ? assets.femaleProfile : assets.maleProfile}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-lg font-semibold">{formData?.firstName} {formData?.lastName}</h2>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2 shadow-gold rounded-lg" style={{
                    boxShadow: "rgba(243, 184, 83, 0.25) 0px 0.4px 0.4px, rgba(243, 184, 83, 0.15) 0px 0px 1px 1px",
                }}>
                    {menuItems.map((item) => (
                        <div key={item.id}>
                            <div className="px-3">
                                <button
                                    onClick={() => {
                                        if (!item.hasSubmenu) {
                                            setSelectedMenu(item.id);
                                            setShowDropDown(null);
                                        } else {
                                            if (showDropDown !== item.id) {
                                                setShowDropDown(item.id);
                                                if (item.submenu && item.submenu.length > 0) {
                                                    setSelectedMenu(item.submenu[0].id);
                                                } else {
                                                    setSelectedMenu(item.id);
                                                }
                                            } else {
                                                setShowDropDown(null);
                                                setSelectedMenu(item.id);
                                            }
                                        }
                                    }}
                                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${isMenuSelected(item)
                                            ? "text-[#F3B753] bg-[#2a2a2a] border border-[#F3B753]"
                                            : "text-gray-300 hover:text-white hover:bg-gray-800"
                                        }`}
                                    style={{
                                        boxShadow: isMenuSelected(item)
                                            ? "0px 0px 8px rgba(243, 184, 83, 0.3)"
                                            : "0px 0.4px 0.4px rgba(243, 184, 83, 0.3)",
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4" />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                    {item.hasSubmenu && (
                                        <ChevronRight
                                            className={`w-4 h-4 transition-transform ${showDropDown === item.id ? 'rotate-90' : ''
                                                }`}
                                        />
                                    )}
                                </button>
                            </div>

                            {/* Submenu */}
                            {item.hasSubmenu && showDropDown === item.id && item.submenu && (
                                <div className="ml-6 mt-2 space-y-1">
                                    {item.submenu.map((subItem) => (
                                        <button
                                            key={subItem.id}
                                            onClick={() => {
                                                setSelectedMenu(subItem.id);
                                                setShowDropDown(null);
                                            }}
                                            className={`w-full flex items-center gap-3 p-2 text-sm rounded transition-colors ${selectedMenu === subItem.id
                                                    ? "text-[#F3B753] bg-[#2a2a2a] border border-[#F3B753]"
                                                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                                                }`}
                                        >
                                            <subItem.icon className="w-3 h-3" />
                                            <span>{subItem.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Log Out */}
                    <div className="px-3">
                        <button
                            onClick={handleLogoutClick}
                            className="w-full flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">{t("user.sidebar.logout")}</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Logout Confirmation Popup */}
            {showLogoutPopup && (
                <div className="fixed inset-0 bg-[#000000a1] bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1D1B11] border border-[#F3B753] rounded-lg p-6 w-full max-w-md mx-4">
                        {/* Header */}
                        <div className="flex justify-center items-center mb-4">
                            <div className="w-24 h-24  rounded-full flex items-center justify-center mb-2">
                                <img src={assets.logOut} className="w-100" alt="Logout icon" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-white text-center mb-4">
                            {t("user.sidebar.logout")}
                        </h2>

                        {/* Subtitle */}
                        <p className="text-gray-400 text-center mb-6">
                            {t("user.sidebar.logoutConfirmation")}
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleLogoutCancel}
                                className="flex-1 px-4 py-2 bg-transparent border border-[#F3B753] text-[#F3B753] rounded-md hover:bg-[#F3B753] hover:text-black transition-colors"
                            >
                                {t("user.profile.submitComplaint.close")}
                            </button>
                            <button
                                onClick={handleLogoutConfirm}
                                className="flex-1 px-4 py-2 bg-[#F3B753] text-black rounded-md hover:bg-[#e6a945] transition-colors font-medium"
                            >
                                {t("user.sidebar.logout")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileSidebar;