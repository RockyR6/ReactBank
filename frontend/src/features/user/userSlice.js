import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";




const initialState = {
    user: null,
    loading: true,
    token: localStorage.getItem("token") || null,
};

// Async thunk to fetch user data
export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) return rejectWithValue(null);

            const { data } = await api.get('/api/auth/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            return data.user;
        } catch (error) {
            localStorage.removeItem("token");
            return rejectWithValue(null);
        }
    }
);

//Register thunk
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (FormData, {rejectWithValue }) => {
        try {
            const { data } = await api.post('/api/auth/register', FormData)
            localStorage.setItem("token", data.token)
            return data.user;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

//login thunk
export const loginUser = createAsyncThunk(
    'user/loginUser',
    async(FormData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/api/auth/login', FormData)
            localStorage.setItem("token", data.token)
            return data.user;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)


//user logout thunk
export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) return rejectWithValue(null);

            const { data } = await api.post('/api/auth/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.removeItem("token");
            return data;
        } catch (error) {
            localStorage.removeItem("token");
            return rejectWithValue(error.response.data.message);
        }
    }
);


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem("token");
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.token = localStorage.getItem("token");
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(fetchUser.rejected, (state) => {
            state.loading = false;
            state.user = null;
        })
        .addCase(logoutUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
            state.token = null;
        })
        .addCase(logoutUser.rejected, (state) => {
            state.loading = false;
            state.user = null;
            state.token = null;
        })
    }
});

export default userSlice.reducer;