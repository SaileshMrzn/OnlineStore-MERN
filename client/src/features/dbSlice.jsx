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

export const incrementFromDatabase = (item) => {
  return async (dispatch, getState) => {
    const database = getState().db.database[0].data;
    const itemToUpdate = database.find((dbItem) => dbItem._id === item._id);

    if (!itemToUpdate) {
      console.error("Item not found in database:", item._id);
      return;
    }

    const data = {
      ...itemToUpdate,
      totalQuantity: itemToUpdate.totalQuantity + 1,
      totalPrice: itemToUpdate.totalPrice,
    };

    axios
      .put(`http://localhost:5555/product/${item._id}`, data)
      .then(async (response) => {
        console.log("Data updated successfully:", response.data);
        await dispatch(fetchDatabase());
      })
      .catch((error) => {
        console.log("Error updating data:", error);
      });
  };
};
export const decrementFromDatabase = (item) => {
  return async (dispatch, getState) => {
    const database = getState().db.database[0].data;
    const itemToUpdate = database.find((dbItem) => dbItem._id === item._id);

    if (!itemToUpdate) {
      console.error("Item not found in database:", item._id);
      return;
    }

    const data = {
      ...itemToUpdate,
      totalQuantity: itemToUpdate.totalQuantity - 1,
      totalPrice: itemToUpdate.totalPrice,
    };

    axios
      .put(`http://localhost:5555/product/${item._id}`, data)
      .then(async (response) => {
        console.log("Data updated successfully:", response.data);
        await dispatch(fetchDatabase());
      })
      .catch((error) => {
        console.log("Error updating data:", error);
      });
  };
};

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
export const { removeFlag } = dbSlice.actions;
