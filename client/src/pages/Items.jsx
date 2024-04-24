import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import { useSelector } from "react-redux";
import {
  getAllItems,
  getLoaderState,
  getThemeState,
} from "../features/itemSlice";

export default function Items() {
  const items = useSelector(getAllItems);
  const loader = useSelector(getLoaderState);
  const theme = useSelector(getThemeState);
  const filteredItems = useSelector((state) => state.items.filteredItems);

  const textRegular = theme === false ? "text-gray-500" : "text-gray-300";
  const textBold = theme === false ? "text-gray-900" : "text-gray-100";
  const border = theme === false ? " border-gray-200" : "border-gray-700";

  return (
    <>
      {loader === true ? (
        <div
          className={`flex justify-center w-screen h-[75vh] text-base mt-5  overflow-hidden ${textRegular}`}
        >
          Loading...
        </div>
      ) : (
        (filteredItems.length > 0 ? filteredItems : items).map((item) => (
          <div className="xl:w-[20%] md:w-[30%] p-5">
            <div className={`border-solid border-2  p-6 rounded-lg ${border}`}>
              <Link
                to={`/item/${item.id}`}
                className={`hover:text-pink-600 ${textBold}`}
              >
                <div className="h-60 items-center justify-center flex">
                  <img
                    className="h-[75%] rounded object-center mb-6 mx-auto"
                    src={item.image}
                    alt="content"
                  />
                </div>
                <div className="mt-4">
                  <h3
                    className={`${textRegular} text-xs tracking-widest title-font mb-1`}
                  >
                    {item.category.charAt(0).toUpperCase() +
                      item.category.slice(1)}
                  </h3>
                  <h2 className="title-font text-lg font-medium">
                    {item.title.substring(0, 15)}...
                  </h2>
                  <p className="mt-1">${item.price}</p>
                </div>
              </Link>
            </div>
          </div>
        ))
      )}
    </>
  );
}
