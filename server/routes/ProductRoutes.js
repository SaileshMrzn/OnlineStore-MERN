import express from "express";
import { Product } from "../models/ProductModel.js";

const router = express.Router();

router.post("/", async (request, response) => {
  try {
    if (!request.body.prod_id) {
      response.status(400).send({ message: "An error occured" });
    }

    const newProduct = {
      prod_id: request.body.prod_id,
      title: request.body.title,
      price: request.body.price,
      totalQuantity: request.body.totalQuantity,
      totalPrice: request.body.totalPrice,
      image: request.body.image,
    };

    const product = await Product.create(newProduct);
    return response.status(201).send(product);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get("/", async (request, response) => {
  try {
    const product = await Product.find({});
    response.status(200).send({
      count: product.length,
      data: product,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get("/:id2", async (request, response) => {
  try {
    const { id2 } = request.params;

    const product = await Product.findById(id2);

    return response.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Product not found" });
    }

    return response
      .status(200)
      .send({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.put("/:id", async (request, response) => {
  try {
    if (!request.body.prod_id) {
      return response.status(400).send({
        message: "no id found",
      });
    }

    const { id } = request.params;

    const result = await Product.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "Book not found" });
    }

    return response.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
