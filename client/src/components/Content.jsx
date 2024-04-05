import React from "react";
import Items from "./Items";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAsyncItems, getThemeState } from "../features/itemSlice";

export default function Content() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAsyncItems());
  }, []);

  const theme = useSelector(getThemeState);

  const textBold = theme === false ? "text-gray-900" : "text-gray-100";
  const background = theme === false ? "" : "bg-slate-900";

  return (
    <>
      <div className={`${background}`}>
        <h2 className={`${textBold} title-font text-center text-xl py-6`}>
          Top Deals
        </h2>
        <div className="flex flex-wrap justify-center items-center mx-10">
          <Items />
        </div>
        <Footer />
      </div>
    </>
  );
}
