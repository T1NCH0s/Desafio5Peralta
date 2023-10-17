const productsApi = require("../components/products");
const cartsApi = require("../components/carts");
const UsersApi = require("../components/users");

module.exports = (app) => {
  productsApi(app);
  cartsApi(app);
  UsersApi(app);

  app.get("/", (req, res) => {
    const settings = {
      name: "Usuario",
      lastname: "/a",
      title: "Home",
    };
    res.render("home", settings);
  });
};
