import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";

const app = express();

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("database connected.");
  })
  .catch((error) => {
    console.log(error);
  });
