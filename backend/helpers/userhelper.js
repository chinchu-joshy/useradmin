const bcrypt = require("bcrypt");
const db = require("../config/connection");
const collections = require("../config/collections");
const objectId = require("mongodb").ObjectId;

module.exports = {
  addUser: (data) => {
    return new Promise(async (resolve, reject) => {
      data.password = await bcrypt.hash(data.password, 10);
      db.get()
        .collection(collections.USER)
        .insertOne(data)
        .then((result) => {
          console.log(result);
          resolve(result);
        });
    });
  },
  userLogin: (data) => {
    return new Promise(async (resolve, reject) => {
      let response = {};

      let user = await db
        .get()
        .collection(collections.USER)
        .findOne({ username: data.username });
      if (user && user.status == false) {
        bcrypt.compare(data.password, user.password).then((result) => {
          if (result) {
            response.user = user;
            response.status = true;
            console.log("login success");
            resolve(response);
          } else {
            console.log("failed");
            response.status = false;
            response.alert = "Invalid username or password";
            resolve(response);
          }
        });
      } else if (user && user.status == true) {
        response.status = false;
        response.alert = "You are blocked";
        resolve(response);
      } else {
        console.log("failed to login");
        response.status = false;
        response.alert = "Invalid username or password";
        resolve(response);
      }
    });
  },
  findUser: (emails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER)
        .findOne({ username: emails })
        .then((response) => {
          resolve(response);
        });
    });
  },
};
