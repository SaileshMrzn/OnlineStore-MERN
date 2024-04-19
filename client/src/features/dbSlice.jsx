import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { addCartItems, getCartTotal } from "../features/itemSlice";

export const fetchDatabase = createAsyncThunk("db/fetchDatabase", async () => {
  const res = await axios.get(`http://localhost:5555/product`);
  return res.data;
});

export const deleteFromDatabase = createAsyncThunk(
  "db/deleteFromDatabase",
  async (id) => {
    const res = await axios.delete(`http://localhost:5555/product/${id}`);
    return res.data;
  }
);

export const incrementFromDatabase = createAsyncThunk(
  "db/incrementFromDatabase",
  async (item, { dispatch, getState }) => {
    const database = getState().db.database[0].data;
    const itemToUpdate = database.find((dbItem) => dbItem._id === item._id);

    if (!itemToUpdate) {
      throw new Error(`Item not found in database: ${item._id}`);
    }

    const data = {
      ...itemToUpdate,
      totalQuantity: itemToUpdate.totalQuantity + 1,
      totalPrice: itemToUpdate.totalPrice,
    };

    const response = await axios.put(
      `http://localhost:5555/product/${item._id}`,
      data
    );
    console.log("Data updated successfully:", response.data);

    await dispatch(fetchDatabase());

    return response.data;
  }
);

export const decrementFromDatabase = createAsyncThunk(
  "db/decrementFromDatabase",
  async (item, { dispatch, getState }) => {
    const database = getState().db.database[0].data;
    const itemToUpdate = database.find((dbItem) => dbItem._id === item._id);

    if (!itemToUpdate) {
      throw new Error(`Item not found in database: ${item._id}`);
    }

    const data = {
      ...itemToUpdate,
      totalQuantity: itemToUpdate.totalQuantity - 1,
      totalPrice: itemToUpdate.totalPrice,
    };

    const response = await axios.put(
      `http://localhost:5555/product/${item._id}`,
      data
    );
    console.log("Data updated successfully:", response.data);

    await dispatch(fetchDatabase());

    return response.data;
  }
);

export const addCartItemsAndPostData = createAsyncThunk(
  "db/addCartItemsAndPostData",
  async (item, { dispatch, getState }) => {
    await dispatch(fetchDatabase());

    const database = getState().db.database[0].data;
    console.log(database);

    const existingItem = database.find((dbItem) => dbItem.prod_id === item.id);

    const { totalQuantity, totalPrice } = getState().db;

    console.log(totalQuantity);

    const updatedData = {
      prod_id: item.id,
      title: item.title,
      price: item.price,
      totalQuantity: existingItem
        ? existingItem.totalQuantity + 1
        : totalQuantity,
      totalPrice: totalPrice,
      image: item.image,
    };

    if (existingItem) {
      const response = await axios.put(
        `http://localhost:5555/product/${existingItem._id}`,
        updatedData
      );
      console.log("Data updated successfully:", response.data);
    } else {
      const response = await axios.post(
        "http://localhost:5555/product",
        updatedData
      );
      console.log("Data posted successfully:", response.data);
    }
    return updatedData;
  }
);

export const getDbTotal = createAsyncThunk(
  "db/getDbTotal",
  async (_, { dispatch, getState }) => {
    // Fetch the current state of the database
    await dispatch(fetchDatabase());

    // Get the current state of the database from the Redux store
    const database = getState().db.database[0].data;

    // Calculate the grand total of all prices and quantities
    const grandTotal = database.reduce(
      (total, item) => {
        const { price, totalQuantity } = item;
        const itemTotal = price * totalQuantity;
        total.finalPrice += itemTotal;
        total.finalQuantity += totalQuantity;
        return total;
      },
      { finalPrice: 0, finalQuantity: 0 }
    );

    return grandTotal;
  }
);

const initialState = {
  database: [],
  cartItems: [],
  totalPrice: 0,
  totalQuantity: 1,
  finalPrice: 0,
  finalQuantity: 0,
  flag: 0,
};

const dbSlice = createSlice({
  name: "db",
  initialState,
  reducers: {
    removeFlag: (state) => {
      state.flag = 0;
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
      })
      .addCase(getDbTotal.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.finalPrice = parseFloat(payload.finalPrice).toFixed(2);
        state.finalQuantity = payload.finalQuantity;
      })
      .addCase(incrementFromDatabase.fulfilled, (state, { payload }) => {
        state.flag += 1;
      })
      .addCase(decrementFromDatabase.fulfilled, (state, { payload }) => {
        state.flag += 1;
      });
  },
});

export default dbSlice.reducer;
export const { removeFlag } = dbSlice.actions;
