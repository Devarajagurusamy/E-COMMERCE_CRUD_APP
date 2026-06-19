import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: null | {
    id: string;
    email: string;
    role: "user" | "admin";
  };
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export default authSlice.reducer;
