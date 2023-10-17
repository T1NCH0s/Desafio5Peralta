const fs = require("fs");
const crypto = require("crypto");
const utils = require("../../../utils/utils.js")
require("dotenv").config();

class UsersServices extends utils{
  constructor() {
    super()
    this.users = "./src/data/users.json";
  }

  async getUsers() {
    return await super.readFile(this.users);
  }

  async CreateUser(obj) {
    try {
      let file = [];
      const existFile = await super.existFile(this.users);
  
      if (existFile) {
        file = await super.readFile(this.users);
        if(file.some((user) => user.email === obj.email)) return "existEmail"
      }
      const claveCifrada = await this.encriptarPassword(obj.password);
      file.push({ ...obj, password: claveCifrada });
      let text = JSON.stringify(file, null, 2);
      await fs.promises.writeFile(this.users, text);
      return true
    } catch (error) {
      console.log(error);
    }
  }

  async encriptarPassword(password) {
    try {
      const textoCifrado = crypto.createHmac("sha256", process.env.SECRETKEYCRYPTO).update(password).digest("hex");
      return textoCifrado;
    } catch (error) {
      console.log(error);
    }
  }

  async VerifyLogin(obj) {
    try {
      let file = await super.readFile(this.users);
      let existUser = file.filter(user => user.email === obj.email);
      if (existUser.length){
        let passwordCifrado = await this.encriptarPassword(obj.password);
        if(existUser[0].password === passwordCifrado) return true
        else return false
      }else{
        return 'EmailInvalidUser'
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UsersServices();
