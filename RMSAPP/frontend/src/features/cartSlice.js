import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const CART_STORAGE_KEY = "cartItem";

const getUserIdFromLocalStorage = () => {
  const storedUserData = localStorage.getItem("user");
  return storedUserData ? JSON.parse(storedUserData)._id : null;
};

const storedCartItems = localStorage.getItem(CART_STORAGE_KEY);
let parsedCartItems = [];
if (storedCartItems && storedCartItems !== "undefined") {
  parsedCartItems = JSON.parse(storedCartItems);
}

const storedUserData = localStorage.getItem("user");
console.log(storedUserData);

const initialState = {
  cartItems: parsedCartItems || [], // Load cart items from local storage
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  user_id: getUserIdFromLocalStorage(),
  dishesWithCartStatus: [],
  status: "idle",
  error: null,
};

const calculateCartTotal = (cartItems) => {
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return { totalQuantity, totalAmount };
};

export const updateProductQuantity = createAsyncThunk(
  "cart/updateProductQuantity",
  async ({ dishId, quantity }, { getState, rejectWithValue }) => {
    try {
      const userId = getState().cart.user_id;
      if (!userId) {
        throw new Error("User ID not found");
      }
      await axios.put(
        `http://localhost:3001/cart/${userId}/updateQuantity/${dishId}`,
        { quantity }
      );
      return { dishId, quantity };
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchCartData = createAsyncThunk(
  "cart/fetchCartData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getState().cart.user_id;
      if (!userId) {
        throw new Error("User ID not found");
      }
      const response = await axios.get(`http://localhost:3001/cart/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/dishes/details/${userId}`
      );
      return response.data.dishesInCart; // Assuming response has a 'dishesInCart' property containing cart items
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const createEmptyCart = createAsyncThunk(
  "cart/createEmptyCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getState().cart.user_id;
      console.log(userId);
      if (!userId) {
        throw new Error("User ID not found");
      }
      const response = await axios.post(
        `http://localhost:3001/cart/createEmptyCart/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchDishesWithCartStatus = createAsyncThunk(
  "cart/fetchDishesWithCartStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/dishes/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (dishId, { getState, rejectWithValue }) => {
    try {
      const userId = getState().cart.user_id;
      if (!userId) {
        throw new Error("User ID not found");
      }
      await axios.delete(
        `http://localhost:3001/cart/${userId}/remove/${dishId}`
      );
      return dishId;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const clearUserCart = createAsyncThunk(
  "cart/clearUserCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getState().cart.user_id;
      if (!userId) {
        throw new Error("User ID not found");
      }
      await axios.delete(`http://localhost:3001/cart/${userId}/clear`);
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async ({ userId, products, totalAmount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/orders/${userId}`,
        { products, totalAmount }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const foundItemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );
      if (foundItemIndex >= 0) {
        state.cartItems[foundItemIndex].quantity += 1;
        toast.success("Product is Already in Cart", { position: "top-right" });
      } else {
        const tempProduct = { ...action.payload, quantity: 1 };
        state.cartItems.push(tempProduct);
        toast.success(`${action.payload.dishName} added to cart`, {
          position: "top-right",
        });
      }

      const { totalQuantity, totalAmount } = calculateCartTotal(
        state.cartItems
      );
      state.cartTotalQuantity = totalQuantity;
      state.cartTotalAmount = totalAmount;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cartItems));
    },

    removeFromCart(state, action) {
      const dishId = action.payload;
      const updatedCartItems = state.cartItems.filter(
        (cartItem) => cartItem._id !== dishId
      );
      const { totalQuantity, totalAmount } =
        calculateCartTotal(updatedCartItems);
      state.cartItems = updatedCartItems;
      state.cartTotalQuantity = totalQuantity;
      state.cartTotalAmount = totalAmount;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCartItems));
      toast.success("Item removed from cart", { position: "top-right" });
    },

    decreaseCart(state, action) {
      const { payload } = action;
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem._id === payload._id
      );
      if (state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity -= 1;
        toast.success(`Decreased ${payload.dishName} quantity`, {
          position: "top-right",
        });
      } else {
        state.cartItems = state.cartItems.filter(
          (cartItem) => cartItem._id !== payload._id
        );
        toast.success(`${payload.dishName} removed from Cart`, {
          position: "top-right",
        });
      }
      const { totalQuantity, totalAmount } = calculateCartTotal(
        state.cartItems
      );
      state.cartTotalQuantity = totalQuantity;
      state.cartTotalAmount = totalAmount;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cartItems));
    },

    increaseCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem._id === action.payload._id
      );
      state.cartItems[itemIndex].quantity += 1;
      toast.success(`Increased ${action.payload.dishName} quantity`, {
        position: "top-right",
      });
      const { totalQuantity, totalAmount } = calculateCartTotal(
        state.cartItems
      );
      state.cartTotalQuantity = totalQuantity;
      state.cartTotalAmount = totalAmount;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cartItems));
    },

    clearCart(state, action) {
      state.cartItems = [];
      toast.success("Cart cleared successfully", { position: "top-right" });
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
      localStorage.removeItem(CART_STORAGE_KEY);
    },

    updateUserFromLocalStorage(state, action) {
      state.user_id = getUserIdFromLocalStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { dishId, quantity } = action.payload;
        const itemIndex = state.cartItems.findIndex(
          (item) => item._id === dishId
        );
        if (itemIndex !== -1) {
          state.cartItems[itemIndex].quantity = quantity;
          const { totalQuantity, totalAmount } = calculateCartTotal(
            state.cartItems
          );
          state.cartTotalQuantity = totalQuantity;
          state.cartTotalAmount = totalAmount;
        }
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cartItems));
      })
      .addCase(updateProductQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })
      .addCase(fetchCartData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload.items;
        state.cartTotalQuantity = action.payload.totalQuantity;
        state.cartTotalAmount = action.payload.totalAmount;
        localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify(action.payload.items)
        );
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(createEmptyCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createEmptyCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { cartItems, cartTotalQuantity, cartTotalAmount } =
          action.payload;
        state.cartItems = cartItems;
        state.cartTotalQuantity = cartTotalQuantity;
        state.cartTotalAmount = cartTotalAmount;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      })
      .addCase(createEmptyCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      ////////////////////////////////////////////////

      .addCase(fetchDishesWithCartStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dishesWithCartStatus = action.payload;
      })

      .addCase(fetchDishesWithCartStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      //////////////////////////////////////////////////////////////////////////////////////////////
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })

      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedCartItems = state.cartItems.filter(
          (item) => item._id !== action.payload
        );
        const { totalQuantity, totalAmount } =
          calculateCartTotal(updatedCartItems);
        state.cartItems = updatedCartItems;
        state.cartTotalQuantity = totalQuantity;
        state.cartTotalAmount = totalAmount;
        localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify(updatedCartItems)
        ); // Update local storage immediately
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })
      .addCase(clearUserCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.status = "succeeded";
        state.cartItems = [];
        state.cartTotalQuantity = 0;
        state.cartTotalAmount = 0;
        localStorage.removeItem(CART_STORAGE_KEY);
      })
      .addCase(clearUserCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })

      .addCase(placeOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update any state properties based on successful order placement
        // For example, you might want to clear the cart or show a success message

        const orderId = action.payload._id; // Assuming the order ID is returned in the payload
        const orderStatus = "completed";
        localStorage.setItem(`orderStatus_${orderId}`, orderStatus);

        state.cartItems = [];
        state.cartTotalQuantity = 0;
        state.cartTotalAmount = 0;
        localStorage.removeItem(CART_STORAGE_KEY);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
        // Handle the error state, such as showing an error message to the user
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  decreaseCart,
  increaseCart,
  clearCart,
  updateUserFromLocalStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
