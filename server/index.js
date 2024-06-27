import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import { Product } from "./models/ProductModel.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import cors from "cors";
import axios from "axios";

dotenv.config();
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

const port = process.env.PORT;
const pw = process.env.PASSWORD;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://online-store-mern.vercel.app",
      "http://localhost:5173/",
      "https://onlinestore-mern.onrender.com",
    ],
  })
);

app.listen(port, () => {
  console.log(`App is listening to port ${port}`);
});

app.use("/product", ProductRoutes);

app.post("/paymentKhalti", async (req, res) => {
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

app.post("/paymentStripe", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: "",
      cancel_url: "",
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.totalQuantity,
      })),
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const mongoDBURL = `mongodb+srv://shaileshmrzn:${pw}@onlinestore-2.ph2tdbf.mongodb.net/test?retryWrites=true&w=majority&appName=OnlineStore-2`;
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Database connected.");
  })
  .catch((error) => {
    console.log(error);
  });
