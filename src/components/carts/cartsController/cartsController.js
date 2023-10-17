const cartsServices = require("../cartsServices/cartsServices.js");

class Carts {
  //POST
  async newCart(req, res) {
    try {
      await cartsServices.newCart();
      return res.json({ response: "Carrito creado!" });
    } catch (error) {
        res.status(500).send("Ha ocurrido un error en el servidor");
    }
}

//GET
async getProductsByCartId(req, res) {
    try {
        if (isNaN(req.params.cid)) return res.json({ response: "El cid debe ser un número!" });
        const ProductsByCartId = await cartsServices.getProductsByCartId(req.params.cid);
        if (!ProductsByCartId) return res.json({ response: "El carrito no existe! Revisa el ID." });
        res.json(ProductsByCartId);
    } catch (error) {
        res.status(500).send("Ha ocurrido un error en el servidor");
    }
}

//POST
async addProductCartId(req, res) {
    try {
        if (isNaN(req.params.cid)) return res.json({ response: "El cid debe ser un número!" });
        if (isNaN(req.params.pid)) return res.json({ response: "El pid debe ser un número!" });
        const addProductCartId = await cartsServices.addProductCartId(req.params.cid, req.params.pid);
        if (addProductCartId === 'cartNotFound') return res.json({response:"No se encontro el carrito, revisa el id."})
        if (addProductCartId === 'ProductNotFound') return res.json({response:"No se encontro el producto, revisa el id."})
        return res.json({ response: "Producto agregado, a la cart correspondiente!" });
    } catch (error) {
      res.status(500).send("Ha ocurrido un error en el servidor");
    }
  }
}

module.exports = new Carts();
