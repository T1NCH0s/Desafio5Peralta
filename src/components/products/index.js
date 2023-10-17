const { Router } = require("express");
const productController = require("./productsController/productsController.js")

module.exports = (app) => {
  let router = new Router();
  app.use("/api/products", router);
  router.get("/", productController.getProducts);
  router.get("/:pid", productController.getProductsById);
  router.post("/", productController.newProduct);
  router.put("/:pid", productController.editProduct);
  router.delete("/:pid", productController.deleteProduct);
};
