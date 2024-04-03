import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    items : [],
    status : null,
    error : null
}

// create an Action Creator that makes use of AsyncThunk
export const dishesFetch = createAsyncThunk(
    //action type
    "dishes/dishesFetch",
    async ( id = null , {rejectWithValue}) => {
        try{
            const response = await axios.get("http://localhost:3001/dish/getalldishes")
            return response?.data ;
        } catch(error) {
            return rejectWithValue(error.response.data)
        }
      
    } 
)

const dishesSlice = createSlice({
    name : "dishes",
    initialState ,
    reducers : {},
    // handle actions doesnt generate Actions
    extraReducers: (builder) => {
        builder
          .addCase(dishesFetch.pending, (state) => {
            state.status = 'pending'; // Update status to pending when fetching dishes
          })
          .addCase(dishesFetch.fulfilled, (state, action) => {
            state.status = 'success'; // Update status to success when fetching dishes is successful
            state.items = action.payload; // Update the dishes array with fetched data
          })
          .addCase(dishesFetch.rejected, (state, action) => {
            state.status = 'rejected'; // Update status to rejected when fetching dishes fails
            state.error = action.error.message; // Store the error message
          });
      }
})

export default dishesSlice.reducer;