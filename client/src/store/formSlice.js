import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../api/axios"

export const FORM_STATUSES = Object.freeze({
    IDLE: 'idle',
    ERROR: 'error',
    LOADING: 'loading',
})

// fetching forms
export const fetchForms = createAsyncThunk('forms/fetch', async () => {
    const { data } = await axios.get(`/forms`)
    return data
})

const formSlice = createSlice({
    name: 'form',
    initialState: {
        forms: [],
        status: FORM_STATUSES.IDLE,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchForms.pending, (state, action) => {
                state.status = FORM_STATUSES.LOADING
            })
            .addCase(fetchForms.fulfilled, (state, action) => {
                state.forms = action.payload
                state.status = FORM_STATUSES.IDLE
            })
            .addCase(fetchForms.rejected, (state, action) => {
                state.status = FORM_STATUSES.ERROR
            })
    },
})

export default formSlice.reducer