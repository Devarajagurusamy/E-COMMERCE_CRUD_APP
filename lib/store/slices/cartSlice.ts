import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

export interface CartItem {
  product: {
    _id: string;
    title: string;
    price: number;
    discount: number;
    image: string;
    stock: number;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/cart");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch cart");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/api/cart", {
        productId,
        quantity,
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to add to cart");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding to cart"
      );
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put("/api/cart", {
        productId,
        quantity,
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to update cart");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/cart/${productId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to remove from cart");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error removing from cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.totalItems = action.payload.totalItems;
      state.totalPrice = action.payload.totalPrice;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add to Cart
    builder.addCase(addToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.totalItems = action.payload.totalItems;
      state.totalPrice = action.payload.totalPrice;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Cart Quantity
    builder.addCase(updateCartQuantity.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCartQuantity.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.totalItems = action.payload.totalItems;
      state.totalPrice = action.payload.totalPrice;
    });
    builder.addCase(updateCartQuantity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Remove from Cart
    builder.addCase(removeFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.totalItems = action.payload.totalItems;
      state.totalPrice = action.payload.totalPrice;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
