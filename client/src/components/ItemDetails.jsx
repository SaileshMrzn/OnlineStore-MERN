// ItemDetails.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAsyncItemDetail,
  getAllDetails,
  getLoaderState,
  removeItemDetail,
  getThemeState,
  addCartItems,
  getCartTotal,
  incrementQuantity,
  decrementQuantity,
  addCartItemsAndPostData,
} from "../features/itemSlice";
import axios from "axios";

export default function ItemDetails() {
  const { id } = useParams();
  const details = useSelector(getAllDetails);
  const loader = useSelector(getLoaderState);
  const theme = useSelector(getThemeState);
  const { totalPrice, totalQuantity, cartItems } = useSelector(
    (state) => state.items
  );

  const [dataToSend, setDataToSend] = useState(null);

  const dispatch = useDispatch();

  console.log(details);

  useEffect(() => {
    dispatch(fetchAsyncItemDetail(id));
    return () => {
      dispatch(removeItemDetail());
    };
  }, [id]);

  // const addToCart = () => {
  //   dispatch(addCartItems(details[0]));
  //   dispatch(getCartTotal());
  //   alert("added to cart");

  //   console.log(cartItems);

  //   if (cartItems[0]) {
  //     const updatedData = {
  //       prod_id: id,
  //       title: cartItems[0].title,
  //       totalQuantity: totalQuantity,
  //       totalPrice: totalPrice,
  //     };

  //     axios
  //       .post("http://localhost:5555/product", updatedData)
  //       .then((response) => {
  //         console.log("Data posted successfully:", response.data);
  //       })
  //       .catch((error) => {
  //         console.log("Error posting data:", error);
  //       });
  //   }
  // };

  const addToCart = () => {
    dispatch(addCartItemsAndPostData(details[0]));
    alert("added to cart");
  };

  const textRegular = theme === false ? "text-gray-500" : "text-gray-300";
  const textBold = theme === false ? "text-gray-900" : "text-gray-100";
  const background = theme === false ? "" : "bg-slate-900";
  const border = theme === false ? " border-gray-200" : "border-gray-700";

  return (
    <>
      {loader === true ? (
        <div
          className={`flex justify-center h-[93vh] text-base pt-5 ${textBold}`}
        >
          Loading...
        </div>
      ) : (
        details.map((detail) => (
          <section
            className={`text-gray-600 body-font overflow-hidden h-screen ${background}`}
          >
            <div className="container px-5 py-24 mx-auto">
              <div className="lg:w-4/5 mx-auto flex flex-wrap">
                <img
                  alt="ecommerce"
                  className="lg:h-5/6 w-1/3 object-center rounded relative top-10"
                  src={detail.image}
                />
                <div className="lg:w-1/2 w-full lg:pl-12 lg:py-6 mt-6 lg:mt-0">
                  <h2 className={`${textRegular}`}>
                    {detail.category.charAt(0).toUpperCase() +
                      detail.category.slice(1)}
                  </h2>
                  <h1
                    className={` text-3xl title-font font-medium mb-1 ${textBold}`}
                  >
                    {detail.title}
                  </h1>
                  <div className="flex mb-4">
                    <span
                      className={`flex items-center ${
                        theme === false ? "" : "text-gray-300"
                      }`}
                    >
                      {"("}
                      {detail.rating.rate}
                      {")"} {detail.rating.count} reviews
                    </span>
                    <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                      <a className={`${textRegular}`}>
                        <svg
                          fill="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                        </svg>
                      </a>
                      <a className={`${textRegular}`}>
                        <svg
                          fill="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                        </svg>
                      </a>
                      <a className={`${textRegular}`}>
                        <svg
                          fill="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                        </svg>
                      </a>
                    </span>
                  </div>
                  <p className={`leading-relaxed ${textRegular}`}>
                    {detail.description.charAt(0).toUpperCase() +
                      detail.description.slice(1)}
                  </p>
                  <div
                    className={`flex mt-2 items-center pb-5 border-b-2 mb-5 ${border}`}
                  ></div>
                  <div className="flex">
                    <span
                      className={`title-font font-medium text-2xl ${textBold}`}
                    >
                      ${detail.price}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`${border} ${textRegular} border-2 px-8 py-2 mt-6 mr-2 rounded-lg hover:bg-pink-400 hover:text-white`}
                  >
                    Buy now
                  </button>
                  <button
                    type="button"
                    className={`${border} ${textRegular} border-2 px-8 py-2 rounded-lg hover:bg-pink-400 hover:text-white`}
                    onClick={addToCart}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </section>
        ))
      )}
    </>
  );
}
