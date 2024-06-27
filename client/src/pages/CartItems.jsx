import React, { useEffect, useState } from "react";
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
import { FaCcStripe } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";

function CartItems() {
  const theme = useSelector(getThemeState);
  const { finalPrice, finalQuantity } = useSelector((state) => state.db);
  const { database, flag } = useSelector((state) => state.db);

  const [checkoutClick, setCheckoutClick] = useState(false);

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

  const backendURL = "https://onlinestore-mern.onrender.com";

  const handleKhaltiCheckout = async () => {
    const payload = {
      return_url: "https://online-store-mern.vercel.app/paymentSuccess/",
      website_url: "https://online-store-mern.vercel.app",
      amount: Math.round(finalPrice * 100),
      purchase_order_id: "test12",
      purchase_order_name: "test",
      customer_info: {
        name: "Khalti Bahadur",
        email: "example@gmail.com",
        phone: "9800000123",
      },
    };

    try {
      const response = await axios.post(`${backendURL}/paymentKhalti`, payload);
      console.log(response);

      window.location.href = `${response?.data?.payment_url}`;
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleStripeCheckout = () => {
    const body = {
      items: database[0].data,
    };

    axios
      .post(`${backendURL}/paymentStripe`, body)
      .then((response) => {
        window.location.href = response.data.url;
      })
      .catch((error) => {
        console.error("Error creating checkout session:", error.error || error);
      });
  };

  return (
    <div className={`${background} px-14 py-10`}>
      <div className="h-screen">
        <div className="container mx-auto px-4">
          <h1 className={`text-2xl font-semibold mb-4 ${textBold}`}>
            Shopping Cart
          </h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-3/4">
              <div
                className={`${cartbackground} ${textBold} rounded-lg shadow-md p-6 mb-4`}
              >
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left font-semibold">Product</th>
                      <th className="text-left font-semibold">Price</th>
                      <th className="text-left font-semibold">Quantity</th>
                      <th className="text-left font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {database.length !== 0 ? (
                      database[0].data.map((item) => (
                        <tr>
                          <td className="py-4 max-w-sm">
                            <div className="flex items-center pr-5">
                              <img
                                className="h-16 w-16 mr-4"
                                src={item.image}
                                alt="Product image"
                              />
                              <span className="font-semibold">
                                {item.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-4">${item.price}</td>
                          <td className="py-4">
                            <div className="flex items-center">
                              <button
                                className={`border-${border} border rounded-md py-2 px-4 mr-2`}
                                onClick={() => {
                                  item.totalQuantity > 1
                                    ? dispatch(decrementFromDatabase(item))
                                    : alert("Quantity cannot be less than 1");
                                }}
                              >
                                -
                              </button>
                              <span className="text-center w-8">
                                {item.totalQuantity}
                              </span>
                              <button
                                className={`border border-${border} rounded-md py-2 px-4 ml-2`}
                                onClick={() => {
                                  dispatch(incrementFromDatabase(item));
                                }}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-4">
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
            <div className="right">
              <div className="md:w-[175%] relative">
                <div
                  className={`${cartbackground} ${textBold} rounded-lg shadow-md p-6 `}
                >
                  <h2 className="text-lg font-semibold mb-4">Summary</h2>
                  <div className="flex justify-between mb-2">
                    <span>Total Amount</span>
                    <span>${finalPrice}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Total Quantity</span>
                    <span>{finalQuantity}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">${finalPrice}</span>
                  </div>
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
                    onClick={() => setCheckoutClick(true)}
                  >
                    Checkout
                  </button>
                </div>
              </div>
              {checkoutClick && (
                <div className="payment">
                  <h1 className={`text-2xl font-semibold mt-4 ${textBold}`}>
                    Payment Options
                  </h1>
                  <div
                    className={`${cartbackground} ${textBold} rounded-lg shadow-md p-6 mt-4 md:w-[175%] flex justify-around items-center`}
                  >
                    <img
                      src="/icons/khalti2.jpg"
                      alt=""
                      className="h-16 w-28 cursor-pointer"
                      onClick={handleKhaltiCheckout}
                    />
                    <FaCcStripe
                      className="scale-[300%] cursor-pointer"
                      onClick={handleStripeCheckout}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
