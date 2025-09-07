'use client';

import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, signInWithApple } from '../firebase/auth';
import { useLanguage } from '../context/LanguageContext';
import { signUpiApi, socialSignUp } from '../services/api';
import OtpVerification from '../Common/OtpVerify';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { ToastMsg } from 'app/Common/Toast';

const Signup = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState('');
  const [otpSent, setOtp] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [authData, setAuthData] = useState({
    email: '',
    password: ''
  });

  const [profileData, setProfileData] = useState({
    phone_number: '',
    phone_country_code: '+49',
    first_name: '',
    last_name: '',
    gender: '',

    consent: false
  });

  const handlePhoneChange = (value: string, country: any) => {
    setProfileData({
      ...profileData,
      phone_number: value,
      phone_country_code: `+${country.dialCode}`
    });
    setFormErrors((prev) => ({ ...prev, phone_number: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!profileData.first_name.trim()) errors.first_name = 'First name is required';
    if (!profileData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!authData.email.trim()) errors.email = 'Email is required';
    if (!authData.password.trim()) errors.password = 'Password is required';
    if (!profileData.phone_number.trim()) errors.phone_number = 'Phone number is required';
    if (!profileData.gender) errors.gender = 'Gender is required';
    if (!profileData.consent) errors.consent = 'Consent is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      setError('');
      setLoading('form');
      setFormErrors({});

      const signupData = {
        email: authData.email,
        password: authData.password,
        profile: profileData
      };

      const data = await signUpiApi(signupData as any) as { status: boolean, message?: string };
     
      if (data.status) {
        setOtp(true);
      } else {
        setError(data.message || '');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login error:", err.message);
      }
      setError(t('auth.errors.loginFailed'));
    } finally {
      setLoading('');
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    try {
      setLoading(provider);
      setError('');

      const { user, error: signInError } = await (provider === 'google'
        ? signInWithGoogle()
        : signInWithApple());

      if (signInError) {
        setError(t('auth.errors.socialLoginFailed').replace('{provider}', provider).replace('{error}', signInError));
        return;
      }


      if (user) {
        console.log("user signup", user)
        const idToken = await (user as any).getIdToken?.();

        const socialSignupPayload = {
          user: {
            uid: user.uid || '',
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            providerData: user.providerData?.map((p: any) => ({
              providerId: p.providerId,
              phoneNumber: p.phoneNumber || ''
            })) || []
          },
          providerId: provider === 'google' ? 'google.com' : 'apple.com',
          _tokenResponse: {
            idToken: idToken
          }
        };
        console.log("user socialSignupPayload", socialSignupPayload)

        const result = await socialSignUp(socialSignupPayload as any) as any;
        if (result?.response?.data?.error_type === "account_not_verified") {
          setError(t('auth.errors.accountNotVerified'));
          setOtp(true);
          return;
        } else if (result?.status) {
          ToastMsg("Signup successfully", "success")
          console.log("Login successful", result);
          localStorage.setItem('user_loggedin', 'true');
          localStorage.setItem("token", result?.data?.access_token)
          localStorage.setItem('user', JSON.stringify({
            name: result?.data.user.first_name,
            email: result?.data.user.email,
            user_id: result?.data.user.user_id
          }));
          window.location.href = '/landing';
        } else {
          
          setError(t('auth.errors.loginFailed'));
          return;
        }
        // ToastMsg("Signup successfully", "success")
        // router.push('/landing');
      }
    } catch (err:any) {
     ToastMsg(err?.response?.data?.message||t('auth.errors.unexpectedError'), "error")
     
    } finally {
      setLoading('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="car_background min-h-screen w-full relative mt-20">

      {otpSent ? <OtpVerification email={authData.email} /> : <div className="min-h-screen w-full flex justify-center md:justify-start items-center relative z-20">
        <div className='w-full mx-4 md:mx-0 md:ml-[3%] md:w-[400px] bg-[#121212] p-6 rounded-[16px]'>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className='mb-6 text-center'>
            <h1 className="text-2xl font-bold text-white mb-2">{t('auth.signup.title')}</h1>
            <p className="text-gray-400">{t('auth.signup.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder={t('auth.signup.firstName.placeholder')}
                  value={profileData.first_name}
                  onChange={(e) => {
                    setProfileData({ ...profileData, first_name: e.target.value });
                    setFormErrors((prev) => ({ ...prev, first_name: '' }));
                  }}
                />
                {formErrors.first_name && <p className="text-red-500 text-sm mt-1">{formErrors.first_name}</p>}
              </div>
              <div>
                <Input
                  placeholder={t('auth.signup.lastName.placeholder')}
                  value={profileData.last_name}
                  onChange={(e) => {
                    setProfileData({ ...profileData, last_name: e.target.value });
                    setFormErrors((prev) => ({ ...prev, last_name: '' }));
                  }}
                />
                {formErrors.last_name && <p className="text-red-500 text-sm mt-1">{formErrors.last_name}</p>}
              </div>
            </div>

            <div>
              <Input
                type="email"
                placeholder={t('auth.signup.email.placeholder')}
                value={authData.email}
                onChange={(e) => {
                  setAuthData({ ...authData, email: e.target.value });
                  setFormErrors((prev) => ({ ...prev, email: '' }));
                }}
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.signup.password.placeholder')}
                  value={authData.password}
                  onChange={(e) => {
                    setAuthData({ ...authData, password: e.target.value });
                    setFormErrors((prev) => ({ ...prev, password: '' }));
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-[12px] text-gray-400 hover:text-gray-300 focus:outline-none focus:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {!showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
            </div>

            <div className="relative">
              <PhoneInput
                country={'de'}
                enableSearch={true}
                value={profileData.phone_number}
                onChange={handlePhoneChange}
                inputStyle={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  paddingLeft: '60px'
                }}

                inputClass="phone-input-field"
                placeholder={t('auth.signup.phone.placeholder')}
              />
              {formErrors.phone_number && <p className="text-red-500 text-sm mt-1">{formErrors.phone_number}</p>}

            </div>

           

            <div className="flex items-center gap-4">
              <span className="text-gray-400">{t('auth.signup.gender.label')}</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={profileData.gender === 'Male'}
                  onChange={() => {
                    setProfileData({ ...profileData, gender: 'Male' });
                    setFormErrors((prev) => ({ ...prev, gender: '' }));
                  }}
                  className="accent-[#F5B544] cursor-pointer"
                />
                <span className="text-white">{t('auth.signup.gender.male')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={profileData.gender === 'Female'}
                  onChange={() => {
                    setProfileData({ ...profileData, gender: 'Female' });
                    setFormErrors((prev) => ({ ...prev, gender: '' }));
                  }}
                  className="accent-[#F5B544] cursor-pointer"
                />
                <span className="text-white">{t('auth.signup.gender.female')}</span>
              </label>
            </div>
            {formErrors.gender && <p className="text-red-500 text-sm">{formErrors.gender}</p>}

            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 accent-[#F5B544] cursor-pointer" checked={profileData?.consent} onChange={() => {
                setProfileData({ ...profileData, consent: !profileData?.consent })
                setFormErrors((prev) => ({ ...prev, consent: '' }));
              }} />
              <span className="text-sm text-gray-400">
                {t('auth.signup.terms.text')}{' '}
                <Link href="/terms" className="text-[#F5B544]">
                  {t('auth.signup.terms.terms')}
                </Link>{' '}
                {t('auth.signup.terms.and')}{' '}
                <Link href="/privacy" className="text-[#F5B544]">
                  {t('auth.signup.terms.privacy')}
                </Link>
                .
              </span>
            </div>
            {formErrors.consent && <p className="text-red-500 text-sm">{formErrors.consent}</p>}

            <Button type="submit" className="w-full" showArrow isLoading={loading === 'form'}>
              {t('auth.signup.submitButton')}
            </Button>

            <div className='flex items-center gap-4 my-3'>
              <div className='flex-1 h-[1px] bg-gray-700'></div>
              <span className='text-gray-400 text-sm'>{t('auth.signup.or')}</span>
              <div className='flex-1 h-[1px] bg-gray-700'></div>
            </div>

            <div className='flex gap-3'>
              <Button
                variant="secondary"
                icon="/images/google.png"
                iconAlt="Google logo"
                className='flex-1'
                onClick={() => handleSocialSignIn('google')}
                disabled={!!loading}
                isLoading={loading === 'google'}
              >
                Google
              </Button>
              <Button
                variant="secondary"
                icon="/images/apple.png"
                iconAlt="Apple logo"
                className='flex-1'
                onClick={() => handleSocialSignIn('apple')}
                disabled={!!loading}
                isLoading={loading === 'apple'}
              >
                Apple
              </Button>
            </div>

            <p className="text-center text-sm text-gray-400">
              {t('auth.signup.hasAccount')}{' '}
              <Link href="/login" className="text-[#F5B544] hover:underline">
                {t('auth.signup.login')}
              </Link>
            </p>
          </form>
        </div>
      </div>}
    </div>
  );
};

export default Signup;