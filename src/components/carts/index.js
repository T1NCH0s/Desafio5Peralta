const { Router } = require("express");
const cartsController = require("./cartsController/cartsController.js")

module.exports = (app) => {
  let router = new Router();
  app.use("/api/carts", router);
  router.post("/", cartsController.newCart);
  router.get("/:cid", cartsController.getProductsByCartId);
  router.get("/:cid/product/:pid", cartsController.addProductCartId);
};