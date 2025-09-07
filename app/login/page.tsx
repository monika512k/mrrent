'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '../types/auth';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { signInWithGoogle, signInWithApple } from '../firebase/auth';
import { useLanguage } from '../context/LanguageContext';
import { login, socialLogin } from 'app/services/api';
import OtpVerification from 'app/Common/OtpVerify';
import { ToastMsg } from 'app/Common/Toast';
import ForgotPassword from 'app/Common/ForgotPassword';
import PasswordResetConfirmation from 'app/Common/PasswordResetConfirmation';

const Login = () => {
  const { t } = useLanguage();
  const [socialLoading, setSocialLoading] = useState<string>('');
  const [error, setError] = useState('');
  const [otpSent, setOtp] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPsw, setForgotPsw] = useState(false);
  const [codeverification, setCodeVerification] = useState(false);
  const [resetPswMail, setResetPswMail] = useState(''); // State to store email for password reset
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setUserEmail(data.email); // Store email in state
      const result = await login({ ...data }) as any;
      if (result?.response?.data?.error_type === "account_not_verified") {
        setError(t('auth.errors.accountNotVerified'));
        setOtp(true);
        return;
      } else if (result?.status) {
        ToastMsg("Login successfully", "success")
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

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login error:", err.message);
      }
      setError(t('auth.errors.loginFailed'));
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    try {
      setSocialLoading(provider);
      setError('');

      const { user, error: signInError } = await (provider === 'google'
        ? signInWithGoogle()
        : signInWithApple());

      if (signInError) {
        setError(t('auth.errors.socialLoginFailed')?.replace('{provider}', provider)?.replace('{error}', signInError) || `${provider} login failed`);
        return;
      }

      if (user) {
        const idToken = await (user as any).getIdToken?.();

        const socialLoginPayload = {
          user: {
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || ''
          },
          providerId: provider === 'google' ? 'google.com' : 'apple.com',
          _tokenResponse: {
            idToken: idToken
          }
        };
       try{
        const result = await socialLogin(socialLoginPayload) as any;
 
        if (result?.response?.data?.error_type === "account_not_verified") {
          ToastMsg(t('auth.errors.accountNotVerified'),"error");
          setOtp(true);
          return;
        } else if (result?.status) {
          ToastMsg("Login successfully", "success")
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
      }
      catch(err:any){
        ToastMsg(err?.response?.data?.message||t('auth.errors.unexpectedError'),"error")
      }

      }
     
    } catch (err:any){
      console.log('pppppp',err)
      ToastMsg(err?.response?.data?.message||t('auth.errors.unexpectedError'),"error")
     
    } finally {
      setSocialLoading('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    if (localStorage.getItem('user_loggedin') !== "false") {
      // window.location.href = '/landing';
    }
  }, [])

  return (
    <div className="car_background min-h-screen w-full relative">

      {otpSent ? (
        <OtpVerification email={userEmail} />
      ) : isForgotPsw ? (
        <div className='container'>
          <ForgotPassword setCodeVerification={setCodeVerification} setForgotPsw={setForgotPsw} setResetPswMail={setResetPswMail} resetPswMail={resetPswMail} />
        </div>
      ) : codeverification ?
        <PasswordResetConfirmation resetPswMail={resetPswMail} /> : (
          <div className="min-h-screen w-full flex justify-center md:justify-start items-center relative z-20">
            <div className='w-full mx-4 md:mx-0 md:ml-[3%] md:w-[400px] bg-[#1C1C1C] p-6 rounded-[16px]'>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}
              <div className='mb-6'>

                <h1 className='text-2xl font-bold text-white mb-2'>{t('auth.login.title')}</h1>
                <p className='text-gray-400'>{t('auth.login.subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4' noValidate>
                <Input
                  label={t('auth.login.email.label')}
                  type="email"
                  placeholder={t('auth.login.email.placeholder')}
                  error={errors.email?.message}
                  {...register('email')}
                  required={false}
                />

                <div className="relative">
                  <Input
                    label={t('auth.login.password.label')}
                    type={showPassword ? "text" : "password"}
                    placeholder={t('auth.login.password.placeholder')}
                    error={errors.password?.message}
                    {...register('password')}
                    required={false}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-[40px] text-gray-400 hover:text-gray-300 focus:outline-none focus:text-gray-300 transition-colors"
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

                <button onClick={() => setForgotPsw(true)} className='text-right text-sm text-gray-400 hover:text-[#F5B544]'>
                  {t('auth.login.forgotPassword')}
                </button>

                <Button
                  type='submit'
                  isLoading={isSubmitting}
                  className='w-full'
                  showArrow
                >
                  {t('auth.login.submitButton')}
                </Button>

                <div className='flex items-center gap-4 my-3'>
                  <div className='flex-1 h-[1px] bg-gray-700'></div>
                  <span className='text-gray-400 text-sm'>{t('auth.login.or')}</span>
                  <div className='flex-1 h-[1px] bg-gray-700'></div>
                </div>

                <div className='flex gap-3'>
                  <Button
                    type='button'
                    variant='secondary'
                    className='flex-1'
                    icon="/images/google.png"
                    iconAlt="Google"
                    onClick={() => handleSocialSignIn('google')}
                    disabled={!!socialLoading}
                    isLoading={socialLoading === 'google'}
                  >
                    Google
                  </Button>
                  <Button
                    type='button'
                    variant='secondary'
                    className='flex-1'
                    icon="/images/apple.png"
                    iconAlt="Apple"
                    onClick={() => handleSocialSignIn('apple')}
                    disabled={!!socialLoading}
                    isLoading={socialLoading === 'apple'}
                  >
                    Apple
                  </Button>
                </div>

                <p className='text-center text-sm text-gray-400 mt-2'>
                  {t('auth.login.noAccount')}{' '}
                  <Link href="/signup" className='text-[#F5B544] hover:underline'>
                    {t('auth.login.getStarted')}
                  </Link>
                </p>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default Login;