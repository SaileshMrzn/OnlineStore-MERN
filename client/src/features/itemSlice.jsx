import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAsyncItems = createAsyncThunk(
  "items/fetchAsyncItems",
  async () => {
    const res = await axios.get("https://fakestoreapi.com/products");
    return res.data;
  }
);

export const fetchAsyncItemDetail = createAsyncThunk(
  "items/fetchAsyncItemDetail",
  async (id) => {
    const res = await axios.get(`https://fakestoreapi.com/products/${id}`);
    return res.data;
  }
);

export const fetchDatabase = createAsyncThunk(
  "items/fetchDatabase",
  async () => {
    const res = await axios.get(`http://localhost:5555/product`);
    return res.data;
  }
);
export const deleteFromDatabase = createAsyncThunk(
  "items/deleteFromDatabase",
  async (id) => {
    const res = await axios.delete(`http://localhost:5555/product/${id}`);
    return res.data;
  }
);

export const addCartItemsAndPostData = (item) => {
  return (dispatch, getState) => {
    dispatch(addCartItems(item));
    dispatch(getCartTotal());

    const { totalQuantity, totalPrice } = getState().items; // Replace 'yourReducer' with the name of your reducer

    const updatedData = {
      prod_id: item.id,
      title: item.title,
      price: item.price,
      totalQuantity: totalQuantity, // Replace with your actual quantity
      totalPrice: totalPrice, // Replace with your actual price
      image: item.image,
    };

    axios
      .post("http://localhost:5555/product", updatedData)
      .then((response) => {
        console.log("Data posted successfully:", response.data);
      })
      .catch((error) => {
        console.log("Error posting data:", error);
      });
  };
};

const initialState = {
  items: [],
  database: [],
  itemDetails: [],
  cartItems: [],
  filteredItems: [],
  loader: true,
  dark: false,
  totalPrice: 0,
  totalQuantity: 0,
  flag: 0,
};

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    removeItemDetail: (state) => {
      state.itemDetails = [];
    },
    removeFlag: (state) => {
      state.flag = 0;
    },
    setFilteredItems(state, { payload }) {
      state.filteredItems = payload;
    },
    setThemeState(state, { payload }) {
      state.dark = payload;
    },

    addCartItems: (state, { payload }) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === payload.id
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity += 1;
      } else {
        state.cartItems.push({ ...payload, quantity: 1 });
      }
    },

    incrementQuantity: (state, { payload }) => {
      state.cartItems = state.cartItems.map((data) => {
        if (data.id === payload.id) {
          return { ...data, quantity: data.quantity + 1 };
        }
      });
    },
    decrementQuantity: (state, { payload }) => {
      state.cartItems = state.cartItems.map((data) => {
        if (data.id === payload.id) {
          return { ...data, quantity: data.quantity - 1 };
        }
      });
    },

    removeCartItem: (state, { payload }) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== payload.id
      );
    },

    getCartTotal: (state) => {
      const { totalPrice, totalQuantity } = state.cartItems.reduce(
        (total, item) => {
          const { price, quantity } = item;
          const itemTotal = price * quantity;
          total.totalPrice += itemTotal;
          total.totalQuantity += quantity;
          return total;
        },
        { totalPrice: 0, totalQuantity: 0 }
      );
      state.totalPrice = parseFloat(totalPrice).toFixed(2);
      state.totalQuantity = totalQuantity;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncItems.pending, (state) => {
        console.log("pending");
        state.loader = true;
      })
      .addCase(fetchAsyncItems.fulfilled, (state, { payload }) => {
        state.items = payload;
        state.loader = false;
      })
      .addCase(fetchAsyncItemDetail.fulfilled, (state, { payload }) => {
        state.itemDetails = [];
        state.itemDetails.push(payload);
        state.loader = false;
      })
      .addCase(fetchDatabase.fulfilled, (state, { payload }) => {
        state.database = [];
        state.database.push(payload);
      })
      .addCase(deleteFromDatabase.fulfilled, (state) => {
        state.flag += 1;
      })
      .addCase(fetchAsyncItems.rejected, () => {
        console.log("rejected");
      });
  },
});

export default itemSlice.reducer;
export const getAllItems = (state) => state.items.items;
export const getAllDetails = (state) => state.items.itemDetails;
export const getLoaderState = (state) => state.items.loader;
export const getThemeState = (state) => state.items.dark;
export const getCartItems = (state) => state.items.cartItems;
export const {
  removeItemDetail,
  setFilteredItems,
  setThemeState,
  incrementCartCounter,
  addCartItems,
  getCartTotal,
  incrementQuantity,
  decrementQuantity,
  removeCartItem,
  removeFlag,
} = itemSlice.actions;

// Todo: separate slice for cartItems.
