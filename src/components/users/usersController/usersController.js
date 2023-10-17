const { response } = require("express");
const userServices = require("../usersServices/usersServices.js");

class Users {
    //GET
    async register(req, res){
        try {
            res.render("register", {title:"Register"});
        }
        catch(error){
            res.status(500).send("Ha ocurrido un error en el servidor");
        }
    }
    async login(req, res){
        try {
            res.render("login", {title:"Login"});
        }
        catch(error){
            
            res.status(500).send("Ha ocurrido un error en el servidor");
        }
    }

    //Post
    async newUser(req, res){
        try {
            if (!req.body.name || !req.body.surname || !req.body.email || !req.body.password) return  res.status(400).send("Verifica que todos los campos esten completos.")
            const CreateUser = await userServices.CreateUser(req.body);
            if (CreateUser === "existEmail") return res.json({response: "Ya hay una cuenta registrada con ese Email."})
            res.redirect('/login');
        }
        catch(error){
            res.status(500).send("Ha ocurrido un error en el servidor");
        }
    }
    async VerifyLogin(req, res){
        try {
            if (!req.body.email || !req.body.password) return  res.status(400).send("Verifica que todos los campos esten completos.")
            const VerifyLogin = await userServices.VerifyLogin(req.body);
            if (VerifyLogin === "EmailInvalidUser") return res.json({response: "El Email no esta asociado a ninguna cuenta existente."})
            if (!VerifyLogin) return res.json({response: "Contraseña incorrecta."})
            res.redirect('/');
        }
        catch(error){
            res.status(500).send("Ha ocurrido un error en el servidor");
        }
    }
  }
  
  module.exports = new Users();
  