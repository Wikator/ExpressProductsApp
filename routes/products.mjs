import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    const { minPrice, maxPrice } = req.query;
    const collection = db.collection("Products");
    const query = {};

    if (minPrice) {
        query.price = { $gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
        if (query.price) {
            query.price.$lte = parseFloat(maxPrice);
        } else {
            query.price = { $lte: parseFloat(maxPrice) };
        }
    }

    let results = await collection.find(query)
      .limit(50)
      .sort({ name: 1 })
      .toArray();

    res.json(results);
});

router.get("/report", async (req, res) => {
  const collection = db.collection("Products");
  const report = await collection.aggregate([
    {
        $group: {
            _id: '$name',
            totalQuantity: { $sum: '$amount' },
            totalValue: { $sum: { $multiply: ['$amount', '$price'] } }
        }
    },
    {
        $project: {
            _id: 0,
            name: '$_id',
            totalQuantity: 1,
            totalValue: 1
        }
    }
  ]).toArray();

  res.json(report);
});

router.get("/:id", async (req, res) => {
  let id;
  try {
    id = new ObjectId(req.params.id);
  } catch {
    res.status(400).send("Invalid id");
    return;
  }
  const collection = db.collection("Products");
  const result = await collection.findOne({_id: id});

  if (result) {
    res.json(result);
  } else {
    res.status(404).send("Product not found");
  }
});

router.post("/", async (req, res) => {
  const collection = db.collection("Products");
  const productFromDb = await collection.findOne({name: req.body.name});

  if (productFromDb) {
    res.status(400).send("Product already exists");
    return;
  }

  const result = await collection.insertOne(req.body);

  if (result.insertedId) {
    const insertedProduct = await collection.findOne({ _id: result.insertedId });
    res.status(201).location('https://expressproductapi.onrender.com/products/' + insertedProduct._id).json(insertedProduct);
  } else {
    res.status(400).send("An error occurred while inserting the product.");
  }
});

router.put("/:id", async (req, res) => {
  let productId;

  try {
    productId = new ObjectId(req.params.id);
  } catch {
    res.status(400).send("Invalid id");
    return;
  }

  const collection = db.collection("Products");
  const existingProduct = await collection.findOne({ _id: productId });

  if (!existingProduct) {
    res.status(404).send("Product not found");
    return;
  }

  if (existingProduct.name !== req.body.name) {
    const productFromDb = await collection.findOne({ name: req.body.name });

    if (productFromDb) {
      res.status(400).send("Product name must be unique");
      return;
    }
  }

  await collection.updateOne({ _id: productId }, { $set: req.body });

  res.status(204).send();
});

router.delete("/:id", async (req, res) => {
  let id;
  try {
    id = new ObjectId(req.params.id);
  } catch {
    res.status(400).send("Invalid id");
    return;
  }

  const collection = db.collection("Products");
  if (!await collection.findOne({_id: id})) {
    res.status(404).send("Product not found");
  } else {
    await collection.deleteOne({_id: id});
    res.status(204).send();
  }
});



export default router;
