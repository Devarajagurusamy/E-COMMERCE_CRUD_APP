import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  clothType: string;
  brand: string;
  size: string;
  color: string;
  stock: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/products");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch products");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/products/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch product");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching product"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData: Omit<Product, "_id">, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/products",
        productData
      );

      if (response.data.success) {
        return response.data.data;
      }

      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: Partial<Product>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/api/products/${id}`,
        data
      );

      if (response.data.success) {
        return response.data.data;
      }

      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/api/products/${id}`
      );

      if (response.data.success) {
        return id;
      }

      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Product By ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create, Update, Delete Product
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.products.unshift(action.payload);
    });

    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const index = state.products.findIndex(
        (p) => p._id === action.payload._id
      );

      if (index !== -1) {
        state.products[index] = action.payload;
      }
    });

    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        (p) => p._id !== action.payload
      );
    });

    
  },
});

export default productSlice.reducer;
