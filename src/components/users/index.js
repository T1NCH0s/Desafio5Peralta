const { Router } = require("express");
const userController = require("./usersController/usersController.js")

module.exports = (app) => {
  let router = new Router();
  app.use("/", router);
  router.get("/register", userController.register);
  router.post("/register", userController.newUser);
  router.get("/login", userController.login);
  router.post("/login", userController.VerifyLogin);
};
