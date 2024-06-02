import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance/axiosInstance"

const initialState = {
    status: "success",
    transactions: []
}
export const getAllTransactions = createAsyncThunk({
    "transactions/getAllTransactions", async(_, thunkAPI) => {
        try {
            const url = "/api/transaction/";
            const response = await axiosInstance.get(url)
            return response.data;
        }
        catch(error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
})
const transactionSlice = createSlice({
    name: "transactions"
    initialState,
    reducers: {},
    extraReducers: {

    }

})