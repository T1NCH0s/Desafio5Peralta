const productsServices = require("../productsServices/productsServices.js");

class Products {
  //GET
  async getProducts(req, res) {
    try {
      const products = await productsServices.getProducts();
      let limit = req.query.limit;
      if (!limit) return res.json(products);
      if (isNaN(limit)) return res.json({ response: "Limite invalido, intenta con un numero." });
      let productFilterLimit = products.slice(0, req.query.limit);
      res.json(productFilterLimit);
    } catch (error) {
      res.status(500).send("Ha ocurrido un error en el servidor");
    }
  }
  async getProductsById(req, res) {
    try {
      if (isNaN(req.params.pid)) return res.json({ response: "El id debe ser un número!" });
      const productById = await productsServices.getProductById(req.params.pid);
      if (!productById) return res.json({ response: "El producto no existe!" });
      res.json(productById);
    } catch (error) {
      res.status(500).send("Ha ocurrido un error en el servidor");
    }
  }
  
  //POST
  async newProduct(req, res) {
    try {
      const products = await productsServices.getProducts();
      const obj = req.body;

      let {title, description, code, price, status, stock, category} = obj;

          //Verifica si ya hay un producto con el mismo code.
          let verifyCode = await products.some((product) => product.code === code);
          if (verifyCode) return res.json({ response:"Ya hay un producto registrado con el mismo Code!"});
    
      if (!title || !description || !code || !price || !status || !stock || !category) {
        return  res.json({ response:"No puedes dejar un campo vacío, asegúrate de completarlos a todos."});
      }

  
      
      //Systema de verificacion del tipo de los valores..
      let camposInvalido = ""
      for (var i = 0; i < Object.keys(obj).length; i++) {
        if (Object.keys(obj)[i] =="title" && typeof(Object.values(obj)[i]) != 'string') camposInvalido = camposInvalido += " <titulo debe ser string> "
        if (Object.keys(obj)[i] =="description" && typeof(Object.values(obj)[i]) != 'string') camposInvalido = camposInvalido += " <descripcion debe ser string> "
        if (Object.keys(obj)[i] =="code" && typeof(Object.values(obj)[i]) != 'string') camposInvalido = camposInvalido += " <code debe ser string> "
        if (Object.keys(obj)[i] =="price" && typeof(Number(Object.values(obj)[i])) != 'number') camposInvalido = camposInvalido += " <precio debe ser un numero> "
        if (Object.keys(obj)[i] =="status" && typeof(Boolean(Object.values(obj)[i])) != 'boolean') camposInvalido = camposInvalido += " <status debe ser string> "
        if (Object.keys(obj)[i] =="stock" && typeof(Number(Object.values(obj)[i])) != 'number') camposInvalido = camposInvalido += " <stock debe ser un numero> "
        if (Object.keys(obj)[i] =="category" && typeof(Object.values(obj)[i]) != 'string') camposInvalido = camposInvalido += " <category debe ser string> "
      }
      if (!camposInvalido == ""){
        return  res.json({ response:`Error, verifica los siguientes campos que esten correctos [${camposInvalido}]`});
      }

      const newProduct = await productsServices.addProduct(obj);
      req.app.io.emit('newProduct', newProduct)
      return res.json({response: "Producto agregado!"})

    } catch (error) {
      res.status(500).send("Ha ocurrido un error en el servidor");
    }
  }
  
  //PUT
  async editProduct(req, res){
    try{
      if (isNaN(req.params.pid)) return res.json({ response: "El id debe ser un número!" });
      const editProduct = await productsServices.updateProduct(req.body, req.params.pid)
      if (!editProduct) return res.json({ response: "El producto a actualizar no existe, verifica el ID..." });
      if (editProduct == "existCode") return res.json({ response: "Ya hay un producto creado con ese Code." });
      if (req.body.id) return res.json({ response: "No proporciones el ID del producto, la app lo hará por ti." });
      return res.json({response: "Producto actualizado!"})
    }catch(error){
      res.status(500).send("Ha ocurrido un error en el servidor");
    }
  }
  
  //DELETE
  async deleteProduct(req, res){
    try{
      if (isNaN(req.params.pid)) return res.json({ response: "El id debe ser un número!" });
      const deleteProduct = await productsServices.deleteProduct(req.params.pid)
      if (!deleteProduct) return res.json({ response: "El producto a eliminar no existe, verifica el ID..." });
      req.app.io.emit('deleteProduct', req.params.pid)
      return res.json({response: "Producto eliminado!"})
    }
    catch(error){
      res.status(500).send("Ha ocurrido un error en el servidor");
    }
  }
}

module.exports = new Products();
