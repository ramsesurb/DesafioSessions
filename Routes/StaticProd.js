import { Router } from "express";
import ProductManagerMongo from "../MongoDao/ProductManagerMongo.js";
import productoModel from "../Models/mongo.js";

const productos = new ProductManagerMongo("../Controllers/ProductManagerMongo.js");
const staticProd = Router();

staticProd.get("/", async (req, res) => {
  const { page = 1, limit: queryLimit, sort, descripcion } = req.query;

  // Obtener los productos paginados de Mongoose
  const options = { limit: 6, page, lean: true };

  if (queryLimit) {
    options.limit = parseInt(queryLimit);
  }

  if (sort) {
    options.sort = sort;
  }

 
  const query = {};
  if (descripcion) {
    query.descripcion = descripcion;
  }

  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productoModel.paginate(query, options);

  const prodsRaw = await productos.getProducts(queryLimit, sort);
  const prods = prodsRaw.map(item => item.toObject());

  res.render("home", {
    productos: docs,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage
  });
});


export default staticProd;