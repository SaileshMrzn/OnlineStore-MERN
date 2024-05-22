import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import { Product } from "./models/ProductModel.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import cors from "cors";
import axios from "axios";

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

app.post("/payment", async (req, res) => {
  const payload = req.body;
  try {
    const khaltiResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );
    res.json(khaltiResponse.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const mongoDBURL = `mongodb+srv://shaileshmrzn:${pw}@onlinestore-2.ph2tdbf.mongodb.net/?retryWrites=true&w=majority&appName=OnlineStore-2`;
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Database connected.");
  })
  .catch((error) => {
    console.log(error);
  });
