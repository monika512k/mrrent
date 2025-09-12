import { Input } from "app/components/Input";
import { useLanguage } from '../../context/LanguageContext';
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "app/services/api";
import { Loader2 } from "lucide-react";

interface FormData {
    firstName?: string;
    lastName?: string;
    gender?: 'Male' | 'Female';
    email?: string;
    phone?: string;
    address?: string;
    user_id: number;
}

interface AccountDetailsProps {
    formData: FormData;
    setFormData: (value: React.SetStateAction<FormData>) => void;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({
    formData,
    setFormData
}) => {
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const profileUpdates = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const requestBody = {
                first_name: formData.firstName || '',
                last_name: formData.lastName || '',
                phone_number: formData.phone || '',
                address: formData.address || '',
                // email: formData.email||'',
                gender: formData.gender||''

            };

            await updateProfile(requestBody);
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);

        } catch (error:any) {
            console.error('Error updating profile:', error);
            setError(error?.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const getProfileDetails = async () => {
      let {data} = await getProfile() as any;
      console.log("getProfileDetails", data)
      if (data) {
        setFormData({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone_number,
          address: data.address,
          gender: data.gender,
          user_id: data.user_id
        });
      }
    };

    const handleSave = () => {
        if (isEditing) {
            profileUpdates
        } else {
            setIsEditing(true);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        if (setFormData) {
            setFormData((prev: FormData) => ({
                ...prev,
                [field]: value,
            }));
        }
        if (error) setError(null);
        if (successMessage) setSuccessMessage(null);
    };


    useEffect(()=>{
        getProfileDetails();
    },[])

    return (
        <>
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold hidden md:block">{t('user.menu.accountDetails')}</h1>
                  {!isEditing&&  <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-transparent border border-gray-600 text-white hover:bg-gray-800 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ?  <Loader2 className="w-4 h-4 animate-spin" /> : (!isEditing && "EDIT")}
                    </button>}
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-300">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-300">
                        {successMessage}
                    </div>
                )}

                {/* Form */}
                <div className="space-y-7 md:space-x-10 md:px-5">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                label={t('user.profile.account.firstName')}
                                type="text"
                                placeholder={t('user.profile.account.firstName')}
                                value={formData.firstName || ''}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                disabled={!isEditing}
                                required={false}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                label={t('user.profile.account.lastName')}
                                type="text"
                                placeholder={t('user.profile.account.lastName')}
                                value={formData.lastName || ''}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                disabled={!isEditing}
                                required={false}
                            />
                        </div>
                    </div>

                    {/* Email and Phone */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input
                                    label={t('user.profile.account.email')}
                                    type="email"
                                    placeholder={t('user.profile.account.email')}
                                    value={formData.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    disabled={!isEditing}
                                    required={false}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    label={t('user.profile.account.mobileNo')}
                                    type="tel"
                                    placeholder={t('user.profile.account.mobileNo')}
                                    value={formData.phone || ''}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    disabled={!isEditing}
                                    required={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address and Gender */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input
                                    label={t('user.profile.account.address')}
                                    type="text"
                                    placeholder={t('user.profile.account.address')}
                                    value={formData.address || ''}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    disabled={!isEditing}
                                    required={false}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block">{t('auth.signup.gender.label')}</label>
                                <div className="flex gap-6 items-center">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Male"
                                            checked={formData.gender === "Male"}
                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                            // disabled={!isEditing}
                                            className="accent-[#F5B544] cursor-pointer"
                                        />
                                        <span className="text-white">{t('auth.signup.gender.male')}</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Female"
                                            checked={formData.gender === "Female"}
                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                            // disabled={!isEditing}
                                            className="accent-[#F5B544] cursor-pointer"
                                        />
                                        <span className="text-white">{t('auth.signup.gender.female')}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end md:justify-end">
                        <button
                            onClick={profileUpdates}
                            disabled={isLoading || !isEditing}
                            className="px-8 py-3 w-full md:w-[200px] bg-[#F3B753] text-black font-medium rounded-lg hover:bg-[#F3B753]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ?  <Loader2 className="w-4 h-4 animate-spin" /> : t('user.save')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountDetails;