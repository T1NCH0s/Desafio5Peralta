const fs = require("fs");
class tools {
  constructor() {}
  
  async existFile(file) {
    try {
      fs.accessSync(file);
      return true;
    } catch (error) {
      return false;
    }
  }

  async readFile(fileName) {
    try {
      const file = await fs.promises.readFile(fileName, "utf-8");
      return JSON.parse(file);
    } catch (error) {
      console.log(`error al leer el archivo, error: ${error}`);
    }
  }
}

module.exports = tools;