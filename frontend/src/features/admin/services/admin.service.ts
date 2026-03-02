import api from "../../../shared/lib/axios";

interface CreateMentorData {
     fullName: string;
     email: string;
     expertise: string[];
     experienceLevel: 'junior' | 'mid' | 'senior';
}

interface LoginResponse {
     success: boolean;
     message: string;
     data: {
          accessToken: string;
     };
}

interface MentorListQuery {
     page?: number;
     limit?: number;
     status?: 'INVITED' | 'ACTIVE' | 'DISABLED';
     experienceLevel?: 'junior' | 'mid' | 'senior';
     expertise?: string;
     search?: string;
     sortBy?: string;
     sortOrder?: 'asc' | 'desc';
}

export const adminService = {
     login: async (data: { email: string; password: string }): Promise<LoginResponse['data']> => {
          const response = await api.post<LoginResponse>('/admin/auth/login', data);
          return response.data.data;
     },

     createMentor: async (data: CreateMentorData) => {
          const response = await api.post('/admin/mentors', data);
          return response.data;
     },

     listMentors: async (query: MentorListQuery = {}) => {
          const response = await api.get('/admin/mentors', { params: query });
          return response.data.data;
     },

     updateMentorStatus: async (mentorId: string, status: 'ACTIVE' | 'DISABLED') => {
          const response = await api.patch(`/admin/mentors/${mentorId}/status`, { status });
          return response.data;
     },

     resendInvite: async (mentorId: string) => {
          const response = await api.post(`/admin/mentors/${mentorId}/resend-invite`);
          return response.data;
     },
};