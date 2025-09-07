export type SignupResponse = {
  status: boolean;
  message?: string;
  data?: {
    user?: {
      id?: string;
      email?: string;
      profile?: {
        first_name?: string;
        last_name?: string;
        phone_number?: string;
        phone_country_code?: string;
        gender?: string;
        address?: string;
      };
    };
  };
};