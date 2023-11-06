import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
//import "express-async-errors";
import products from "./routes/products.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/products', products);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});