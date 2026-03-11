import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
    transactions: [],
    loading: false,
    error: null,
};

// Async thunk to fetch transaction history for an account
export const fetchTransactionHistory = createAsyncThunk(
    'transaction/fetchTransactionHistory',
    async (accountId, { rejectWithValue }) => {
        try {
            const response = await api.get(`api/transactions/account/${accountId}`, {
                withCredentials: true,
            });
            return response.data.transactions;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactionHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
            })
                .addCase(fetchTransactionHistory.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                });
        }
    });
    
    export default transactionSlice.reducer;