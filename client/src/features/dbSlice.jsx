import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

    const { totalQuantity, totalPrice } = getState().items;

    const updatedData = {
      prod_id: item.id,
      title: item.title,
      price: item.price,
      totalQuantity: totalQuantity,
      totalPrice: totalPrice,
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
  database: [],
  cartItems: [],
  totalPrice: 0,
  totalQuantity: 0,
  flag: 0,
};

const dbSlice = createSlice({
  name: "db",
  initialState,
  reducers: {
    removeFlag: (state) => {
      state.flag = 0;
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
      .addCase(fetchDatabase.fulfilled, (state, { payload }) => {
        state.database = [];
        state.database.push(payload);
      })
      .addCase(deleteFromDatabase.fulfilled, (state) => {
        state.flag += 1;
      });
  },
});

export default dbSlice.reducer;
export const { getCartTotal, removeFlag } = dbSlice.actions;
