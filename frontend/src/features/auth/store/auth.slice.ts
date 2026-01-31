import { createSlice,  } from '@reduxjs/toolkit';
import type{PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  registrationEmail: string | null;
}

const initialState: AuthState = {
  registrationEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRegistrationEmail: (state, action: PayloadAction<string>) => {
      state.registrationEmail = action.payload;
    },
    clearRegistrationEmail: (state) => {
      state.registrationEmail = null;
    },
  },
});

export const { setRegistrationEmail, clearRegistrationEmail } = authSlice.actions;
export default authSlice.reducer;