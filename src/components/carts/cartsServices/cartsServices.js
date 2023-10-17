const fs = require("fs");
const utils = require("../../../utils/utils.js")

class CartsServices extends utils{
  constructor() {
    super()
    this.carts = "./src/data/carts.json";
    this.products = "./src/data/products.json";
  }

  async validateId() {
    if (!await super.existFile(this.carts)) return 1;
    let file = await super.readFile(this.carts);
    if (file.length) {
      let idMayor = file.reduce((p, c) => {
        return c.id > p ? c.id : p;
      }, 0);
      return idMayor + 1;
    }
    return 1;
  }

  async newCart() {
    try {
      let file = [];
      if (await super.existFile(this.carts)) {
        file = await super.readFile(this.carts);
      }
      file.push({
        id: await this.validateId(),
        products: [],
      });
      let objeto = JSON.stringify(file, null, 2);
      await fs.promises.writeFile(this.carts, objeto);
    } catch (error) {
      console.log(error);
    }
  }

  async getProductsByCartId(cartId) {
    try {
      let productCarts = await super.readFile(this.carts);
      let cart = productCarts.find((producto) => producto.id === Number(cartId));
      return cart.products;
    } catch (error) {}
  }

  async addProductCartId(cartId, productId) {
    try {
      //Obtengo los productos de la cart por el ID
      let productCarts = await super.readFile(this.carts);
      let carts = productCarts.find((cart) => cart.id === Number(cartId));
      if (!carts) return "cartNotFound";
      // console.log(carts.products) -- Ejemeplo id 1 [ { product: 1, quantity: 1 }, { product: 2, quantity: 2 } ]

      //Verifico si el Producto existe en el products.json
      let products = await super.readFile(this.products);
      let product = products.find((producto) => producto.id === Number(productId));
      if (!product) return "ProductNotFound";

      let verifyProduct = carts.products.find((producto) => producto.product === Number(productId));
      let operacionUpdate = carts.products.findIndex((producto) => producto.product === Number(productId));
      if (operacionUpdate !== -1) {
        carts.products[operacionUpdate] = {
          product: Number(productId),
          quantity: verifyProduct.quantity + 1,
        };
        await fs.promises.writeFile(this.carts, JSON.stringify(productCarts, null, 2));
      } else {
        carts.products.push({
          product: Number(productId),
          quantity: 1,
        });
        let objeto = JSON.stringify(productCarts, null, 2);
        await fs.promises.writeFile(this.carts, objeto);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new CartsServices();
