const fs = require("fs")
const utils = require("../../../utils/utils.js")

class ProductsServices extends utils{
  constructor() {
    super()
    this.products = "./src/data/products.json";
  }

  async validateId() {
    if (!await super.existFile(this.products)) return 1;
    let file = await super.readFile(this.products);
    if (file.length) {
      let idMayor = file.reduce((p, c) => {
        return c.id > p ? c.id : p;
      }, 0);
      return idMayor + 1;
    }
    return 1;
  }

  async getProducts() {
    return (await super.readFile(this.products));
  }

  async addProduct(obj) {
    //Verifica que todos los campos sean obligatorios
    let { title, description, code, price, stock, category, status, thumbnail } = obj;

    //Verifica que el campo thumbnail contenga informacion. de lo contrario lo establece en []
    if(!thumbnail){
        thumbnail = []
      }

    try {
      let file = [];
      if (await super.existFile(this.products)) {
        file = await super.readFile(this.products);
      }

      let newProduct = {
        id: await this.validateId(),
        title,
        description,
        code,
        price: Number(price),
        status: Boolean(status),
        stock: Number(stock),
        category,
        thumbnail,
      }
      file.push(newProduct);
      let objeto = JSON.stringify(file, null, 2);
      await fs.promises.writeFile(this.products, objeto);
      return newProduct //Returno el producto
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(productId) {
    let products = await super.readFile(this.products);
    let product = products.find((producto) => producto.id === Number(productId));
    return product
  }

  async deleteProduct(productId) {
    let products = await super.readFile(this.products);
    let operacionEliminar = products.findIndex((producto) => producto.id === Number(productId));

    if (operacionEliminar !== -1) {
        products.splice(operacionEliminar, 1);
      await fs.promises.writeFile(this.products, JSON.stringify(products, null, 2));
      return true
    } else {
      return false
    }
  }

  async updateProduct(obj, id) {
    let products = await super.readFile(this.products);
    let oldObj = products.find((producto) => producto.id === Number(id));

    //Verifica si ya hay un producto con el mismo code.
    let verifyCode = await products.some((product) => product.code === obj.code);
    if (verifyCode && obj.code != oldObj.code) return "existCode"
    
    let operacionUpdate = products.findIndex((producto) => producto.id === Number(id));
    if (operacionUpdate !== -1) {
        products[operacionUpdate] = {...oldObj, ...obj};
        await fs.promises.writeFile(this.products, JSON.stringify(products, null, 2));
        return true
    } else {
      return false
    }
  }
}

module.exports = new ProductsServices();