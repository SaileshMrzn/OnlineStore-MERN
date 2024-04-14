import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import { Product } from "./models/ProductModel.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import cors from "cors";

dotenv.config();
const port = process.env.PORT;
const pw = process.env.PASSWORD;

const app = express();

app.use(express.json());

app.use(cors());

app.listen(port, () => {
  console.log(`App is listening to port ${port}`);
});

app.use("/product", ProductRoutes);

const mongoDBURL = `mongodb+srv://shaileshmrzn:${pw}@onlinestore-2.ph2tdbf.mongodb.net/?retryWrites=true&w=majority&appName=OnlineStore-2`;
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Database connected.");
  })
  .catch((error) => {
    console.log(error);
  });
