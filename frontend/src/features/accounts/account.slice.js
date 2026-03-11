import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axios";

const initialState = {
  accounts: [],
  loading: false,
  error: null,
};


// Async thunk to fetch accounts for the logged-in user
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) return rejectWithValue("No token found");
      const { data } = await api.get("/api/account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.accounts;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch accounts",
      );
    }
  },
);

//Create a account for the logged in user
export const createAccount = createAsyncThunk(
  'accounts/createAccount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return rejectWithValue("No token found");

      const { data } = await api.post('/api/account', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.account;
      
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create account",
      );
    }
  }
)


const accountSlice = createSlice({
    name: "accounts",
    initialState,
    reducers: {
        clearAccounts: (state) => {
            state.accounts = [];
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAccounts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAccounts.fulfilled, (state, action) => {
            state.loading = false;
            state.accounts = action.payload;
        })
        .addCase(fetchAccounts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch accounts";
        })
        .addCase(createAccount.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createAccount.fulfilled, (state, action) => {
            state.loading = false;
            state.accounts.push(action.payload);
        })
        .addCase(createAccount.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to create account";
        })
        
    }
})


export const { clearAccounts } = accountSlice.actions;
export default accountSlice.reducer;
