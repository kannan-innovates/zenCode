import api from "../../../shared/lib/axios";
import type { RegistrationRequest,VerifyOTPRequest } from "../types/auth.types";

export const authService = {

     register: async(data: RegistrationRequest) =>{
          const response = await api.post('/auth/register',data);
          return response.data;
     },

     verifyOTP : async(data: VerifyOTPRequest) =>{
          const response = await api.post('/auth/verify-otp',data);
          return response.data;
     }

}