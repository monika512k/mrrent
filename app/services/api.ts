'use client';
import { ToastMsg } from 'app/Common/Toast';
import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

interface Testimonial {
  id: number;
  content: string;
  author: string;
  // Add other testimonial fields as needed
}

interface Car {
  id: number;
  name: string;
  // Add other car fields as needed
}

interface CarType {
  id: number;
  name: string;
  // Add other car type fields as needed
}


export const getTestimonials = async (selected_language: string): Promise<Testimonial[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/testimonial/?selected_language=${selected_language}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

export const getCars = async ({used_for,selected_language,car_type}: { used_for: string; selected_language: string,car_type:string }): Promise<Car[]> => {
    
  try {
    const response = await fetch(`${BASE_URL}/car/car_list/?used_for=${used_for}&selected_language=${selected_language}&car_type=${car_type}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
};

export const getCarsTypes = async ({used_for,selected_language}: { used_for: string; selected_language: string }): Promise<CarType[]> => {
  try {
    const response = await fetch(`${BASE_URL}/car/car_type/?used_for=${used_for}&selected_language=${selected_language}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
};

interface SignupRequest {
  email: string;
  password: string;
  profile: {
    phone_number: string;
    phone_country_code: string;
    first_name: string;
    last_name: string;
    gender: string;
    address: string;
    consent: boolean;
  };
}

export const signUpiApi = async (reqBody: SignupRequest) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/signup/`, reqBody);
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};
  


   export const otpVerify = async (reqBody: { email: string; otp: string; verify_type: string }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/verify-otp/`, reqBody);
      return response.data;
    } catch (error) {
      console.error('Error during OTP verification:', error);
      throw error;
    }
  };

   export const resendOtp = async (reqBody: { email: string; verify_type: string }) => {
    try {
      let body: { email: string; verify_type?: string } = {
        email: reqBody.email,
      };
      if(reqBody.verify_type){
        body['verify_type'] = reqBody.verify_type;
      }
      const response = await axios.post(`${BASE_URL}/api/resent-otp/`, body);
      return response.data;
    } catch (error) {
      console.error('Error during OTP resending:', error);
      throw error;
    }
  };

  export interface LoginResponse {
    status: boolean;
    response?: {
      data?: {
        error_type?: string;
      };
    };
  }
  
  export const login = async (reqBody: {
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${BASE_URL}/api/login/`, reqBody);
      return response?.data as LoginResponse;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

    export const socialLogin = async (reqBody: any) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/social-login/`, reqBody);
      return response?.data ;
    } catch (error) {
      console.error("Error during login:", error);
     throw  error;
    }
  };

     export const socialSignUp = async (reqBody: any) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/social-singup/`, reqBody);
      return response?.data ;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

     export const resetPassword = async (reqBody: { email: string; new_password: string; confirm_password: string }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/reset-password/`, reqBody);
      return response.data;
    } catch (error) {
      console.error('Error during password reset:', error);
      throw error;
    }
  };
interface CarListParams {
  fuel_type?: string;
  car_type?: string;
  pickup_location?: string | number;
  pickup_date?: string;
  drop_date?: string;
  body_type?: string;
  transmission?: string;
  page?: number;
  page_size?: number;
  selected_language: string
}

export const getCarList = async (params: CarListParams , language: String) => {
  try {
    const query = new URLSearchParams(params as any).toString();
    const response = await axios.get(`${BASE_URL}/car/car_list/?${query}&selected_language=${language}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching car list:', error);
    throw error;
  }
};


   export const carDetail = async (car_id: string,selected_language: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/car/car_list/?car_id=${car_id}&selected_language=${selected_language}`);
      return response.data;
    } catch (error) {
      console.error('Error during car detail fetch:', error);
      throw error;
    }
  };

     export const locations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/master/operating_locations/`);
      return response.data;
    } catch (error) {
      console.error('Error during car detail fetch:', error);
      throw error;
    }
  };
  export const operationLocation = async (selected_language:string) => {
  
  
    try {
      const response = await axios.get(`${BASE_URL}/master/operating_locations/?selected_language=${selected_language}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pickup location:', error);
      throw error;
    }
  };


  export const updateProfile = async(reqBody: {
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
  }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/api/update-profile/`, reqBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
        } 
      })
      return response.data;
    } catch (error) {
      console.error('Error during profile update:', error);
      throw error;
    }
  };


  export const getProfile = async  () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/get-profile/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Profile Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

 export const uploadLicence = async  (formDataToSend: FormData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/upload-image/`,formDataToSend, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Upload Licence:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const licenceStatus = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/license-status/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Licence Status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching licence status:', error);
    throw error;
  }
};

export const getDiscount = async (id: any) => {
  try {
    const response = await axios.get(`${BASE_URL}/car/discounts/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }) as any;

    console.log('discounts', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching discounts:', error);
    if(!error?.response?.data?.status && error?.response?.data?.code == "token_not_valid"){
      ToastMsg("Please login to book a car", "error");
      window.location.href = "/login";
      throw new Error("Car not available");
    }
    throw error;
  }
};
export const carBookingCalculationAPI = async ({ url, data = {}, auth = false }: { url: string, data: any, auth?: boolean }) => {
  const token = localStorage.getItem('token');
  if (auth && !token) throw new Error('Authentication token required');

  const res = await axios.post(
    `${BASE_URL}/${url}`,data,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(auth && { Authorization: `Bearer ${token}` })
      }
    }
  );
  return res.data;
};