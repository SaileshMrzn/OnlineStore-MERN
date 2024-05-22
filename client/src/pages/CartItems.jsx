import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementFromDatabase,
  deleteFromDatabase,
  fetchDatabase,
  getDbTotal,
  incrementFromDatabase,
  removeFlag,
} from "../features/dbSlice";
import { getThemeState } from "../features/itemSlice";
import axios from "axios";

import { AiOutlineDelete } from "react-icons/ai";

function CartItems() {
  const theme = useSelector(getThemeState);
  const { finalPrice, finalQuantity } = useSelector((state) => state.db);
  const { database, flag } = useSelector((state) => state.db);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDatabase());
    dispatch(getDbTotal());
    return () => {
      dispatch(removeFlag());
    };
  }, [flag]);

  const textBold = theme === false ? "text-gray-900" : "text-gray-100";
  const background = theme === false ? "" : "bg-slate-900";
  const cartbackground = theme === false ? "bg-gray-200" : "bg-gray-700";
  const border = theme === false ? " border-gray-700" : "border-gray-700";

  const handleCheckout = async () => {
    const payload = {
      return_url: "http://localhost:5173/paymentSuccess/",
      website_url: "http://localhost:5173/",
      amount: 1000,
      purchase_order_id: "test12",
      purchase_order_name: "test",
      customer_info: {
        name: "Khalti Bahadur",
        email: "example@gmail.com",
        phone: "9800000123",
      },
    };

    console.log(payload.amount);

    try {
      const response = await axios.post(
        "http://localhost:5555/payment",
        payload
      );
      console.log(response);

      window.location.href = `${response?.data?.payment_url}`;
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className={`${background} px-14 py-10`}>
      <div class="h-screen">
        <div class="container mx-auto px-4">
          <h1 class={`text-2xl font-semibold mb-4 ${textBold}`}>
            Shopping Cart
          </h1>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="md:w-3/4">
              <div
                class={`${cartbackground} ${textBold} rounded-lg shadow-md p-6 mb-4`}
              >
                <table class="w-full">
                  <thead>
                    <tr>
                      <th class="text-left font-semibold">Product</th>
                      <th class="text-left font-semibold">Price</th>
                      <th class="text-left font-semibold">Quantity</th>
                      <th class="text-left font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {database.length !== 0 ? (
                      database[0].data.map((item) => (
                        <tr>
                          <td class="py-4 max-w-sm">
                            <div class="flex items-center pr-5">
                              <img
                                class="h-16 w-16 mr-4"
                                src={item.image}
                                alt="Product image"
                              />
                              <span class="font-semibold">{item.title}</span>
                            </div>
                          </td>
                          <td class="py-4">${item.price}</td>
                          <td class="py-4">
                            <div class="flex items-center">
                              <button
                                class={`border-${border} border rounded-md py-2 px-4 mr-2`}
                                onClick={() => {
                                  item.totalQuantity > 1
                                    ? dispatch(decrementFromDatabase(item))
                                    : alert("Quantity cannot be less than 1");
                                }}
                              >
                                -
                              </button>
                              <span class="text-center w-8">
                                {item.totalQuantity}
                              </span>
                              <button
                                class={`border border-${border} rounded-md py-2 px-4 ml-2`}
                                onClick={() => {
                                  dispatch(incrementFromDatabase(item));
                                }}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td class="py-4">
                            $
                            {parseFloat(
                              item.price * item.totalQuantity
                            ).toFixed(2)}
                          </td>
                          <td className="">
                            <AiOutlineDelete
                              style={{ color: "#f4244a" }}
                              onClick={() => {
                                dispatch(deleteFromDatabase(item._id));
                              }}
                              className="cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <td className="py-4">No any items</td>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div class="md:w-1/4">
              <div
                class={`${cartbackground} ${textBold} rounded-lg shadow-md p-6`}
              >
                <h2 class="text-lg font-semibold mb-4">Summary</h2>
                <div class="flex justify-between mb-2">
                  <span>Total Amount</span>
                  <span>${finalPrice}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span>Total Quantity</span>
                  <span>{finalQuantity}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <hr class="my-2" />
                <div class="flex justify-between mb-2">
                  <span class="font-semibold">Total</span>
                  <span class="font-semibold">${finalPrice}</span>
                </div>
                <button
                  class="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
