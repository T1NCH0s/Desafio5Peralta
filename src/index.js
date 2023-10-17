require("dotenv").config();
const express = require("express");

const app = require("express")();
const http = require("http");

const routes = require("./routes");
const handlebars = require("express-handlebars");
const socketIo = require('socket.io');
const multer = require("multer");

const utils = require("./utils/utils");
const { newProduct } = require("./components/products/productsController/productsController");

/*
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

app.post("/subidaarchivo", upload.single("file"), (req, res) => {
  res.send("Se subio con exito!");
});*/


app.get("/realtimeproducts", (req,res) => {
  try {
    res.render("realtimeproducts", {title:"test"})
  }catch(error){
    res.status(500).send("Ha ocurrido un error en el servidor");
  }
})

class Server {
  constructor() {
    this.app = app;
    this.app.io = socketIo(this.server)
    this.settings();
    this.routes();
    this.server = http.createServer(this.app);
    this.ProductsSocket();
  }

  settings() {
    //Handlebars
    this.app.engine("handlebars", handlebars.engine());
    this.app.set("view engine", "handlebars");
    this.app.set("views", __dirname + "/views");

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(`${__dirname}/public`));
  }

  routes() {
    routes(this.app);
  }

  ProductsSocket() {
    this.app.io = socketIo(this.server);
      
    this.app.io.on("connection", async (socket) => {
      console.log("Nuevo cliente conectado, ID: " + socket.id);
      const utilse = new utils
      let products = utilse.readFile("./src/data/products.json")
      socket.emit('initialData', await products);
    });
  }

  listen() {
    this.server.listen(process.env.PORT, () => {
      console.log(`http:localhost:${process.env.PORT}`);
    });
  }
}

module.exports = new Server();
