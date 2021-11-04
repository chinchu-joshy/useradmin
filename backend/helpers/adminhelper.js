const collections = require("../config/collections");
const db = require("../config/connection");
const objectId = require("mongodb").ObjectId;
module.exports = {
  checkAdmin: (admin) => {
    return new Promise(async (resolve, reject) => {
      let response = {};

      let user = await db
        .get()
        .collection(collections.ADMIN)
        .findOne({ username: admin.username });
      if (user) {
        let result = await db
          .get()
          .collection(collections.ADMIN)
          .findOne({ password: admin.password });
        if (result) {
          response.user = user;
          response.status = true;
          console.log("login success");
          resolve(response);
        } else {
          console.log("failed the login");
          response.status = false;
          response.alert = "Invalid username or password";
          resolve(response);
        }
      } else {
        console.log("failed");
        response.status = false;
        response.alert = "Invalid username or password";
        resolve(response);
      }
    });
  },

  getAllUser: () => {
    return new Promise(async (resolve, reject) => {
      let users = await db.get().collection(collections.USER).find().toArray();

      resolve(users);
    });
  },
  deleteProduct: (data) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER)
        .deleteOne({ _id: objectId(data) })
        .then(async (response) => {
          let users = await db
            .get()
            .collection(collections.USER)
            .find()
            .toArray();
          resolve(users);
        });
    });
  },
  editProduct: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER)
        .findOne({ _id: objectId(id) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  updateProduct: (product) => {
    return new Promise((resolve, reject) => {
      if (product.username) {
        db.get()
          .collection(collections.USER)
          .updateOne(
            { _id: objectId(product.id) },
            {
              $set: {
                username: product.username,
              },
            }
          )
          .then(async (response) => {
            let users = await db
              .get()
              .collection(collections.USER)
              .find()
              .toArray();
            resolve(users);
          });
      }
      if (product.phone) {
        db.get()
          .collection(collections.USER)
          .updateOne(
            { _id: objectId(product.id) },
            {
              $set: {
                phone: product.phone,
              },
            }
          )
          .then(async (response) => {
            let users = await db
              .get()
              .collection(collections.USER)
              .find()
              .toArray();
            resolve(users);
          });
      }
      if (product.email) {
        db.get()
          .collection(collections.USER)
          .updateOne(
            { _id: objectId(product.id) },
            {
              $set: {
                email: product.email,
              },
            }
          )
          .then(async (response) => {
            let users = await db
              .get()
              .collection(collections.USER)
              .find()
              .toArray();
            resolve(users);
          });
      }

      //    db.get().collection(collections.USER).updateOne({_id:objectId(product.id)},{
      //        $set:{
      //           username:product.username,
      //           email:product.email,
      //           phone:product.phone
      //        }
      //    }).then((response)=>{
      //        console.log(response)
      //        resolve(response)

      //     })
    });
  },
  blockUser: (id) => {
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collections.USER)
        .findOne({ _id: objectId(id) });
      if (user.status == true) {
        let val = await db
          .get()
          .collection(collections.USER)
          .findOneAndUpdate(
            { _id: objectId(id) },
            {
              $set: {
                status: false,
              },
            }
          ); //.then((response)=>{
        let users = await db
          .get()
          .collection(collections.USER)
          .find()
          .toArray();
        resolve(users);
        //    resolve(val.value.status)
        // })
      } else {
        let val = await db
          .get()
          .collection(collections.USER)
          .findOneAndUpdate(
            { _id: objectId(id) },
            {
              $set: {
                status: true,
              },
            }
          ); //.then((response)=>{
        let userss = await db
          .get()
          .collection(collections.USER)
          .find()
          .toArray();
        resolve(userss);
        // })
      }
    });
  },
};
