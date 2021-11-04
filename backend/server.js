const express = require("express");
const app = express();
const cores = require("cors");
const jwt = require("jsonwebtoken");
var db = require("./config/connection");
const userhelper = require("./helpers/userhelper");
const adminhelper = require("./helpers/adminhelper");
const { ServerResponse } = require("http");
const { access } = require("fs");
adminhelper;
const port = process.env.PORT || 5000;

// app.use('/login',(req,res,next)=>{
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
// res.header('Expires', '-1');
// res.header('Pragma', 'no-cache');
// console.log("checkind hdvhdhf")
// next()
// })
// app.use('/logout',(req,res,next)=>{
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
// res.header('Expires', '-1');
// res.header('Pragma', 'no-cache');
// console.log("checkind hdvhdhf")
// next()
// })

// const createToken=async()=>{
//    let token=await jwt.sign({id:"758734597406q76847"},"secret",{
//        expiresIn:"15m"
//    })
//    console.log(token)

//    let verify=await jwt.verify(token,"secret")
//    console.log(verify)

// }
// createToken()

app.use(express.json());
app.use(cores());
db.connect((err) => {
  if (err) console.log("connection error" + err);
  else console.log("database connected to port 27017");
});
//user
//middleware

const checkblock = async (req, res, next) => {
  const tokens = await req.headers["x-access-token"];

  if (tokens) {
    jwt.verify(tokens, "adminsecret key", (err, data) => {
      if (err) {
        console.log(err + "khkj");
        res.json({ status: false });
        console.log("not");
      } else {
        adminhelper.findUser(data.email).then((response) => {
          res.send(response);
        });
      }
    });
  } else {
    console.log("done");
    next();
  }
};

const verifys = async (req, res, next) => {
  const tokens = await req.headers["x-access-token"];

  if (tokens) {
    jwt.verify(tokens, "usersecret key", (err, data) => {
      console.log(data);
      if (err) {
        console.log(err + "khkj");
        res.json({ status: false });
        console.log("not");
      } else {
        userhelper.findUser(data.username).then((response) => {
          console.log(response);
          res.json({ response: response, status: true });
        });
      }
    });
  } else {
    console.log("done");
    next();
  }
};

const adminverifys = async (req, res, next) => {
  const tokens = await req.headers["x-access-token"];

  if (tokens) {
    jwt.verify(tokens, "adminsecret key", (err, data) => {
      console.log(data);
      if (err) {
        console.log(err + "khkj");
        res.json({ status: false });
        console.log("not");
      } else {
        adminhelper.getAllUser().then((response) => {
          res.json({ status: true, response: response });
        });
      }
    });
  } else {
    console.log("done");
    next();
  }
};

app.get("/", verifys, (req, res) => {
  res.status(200).send("welcome");
  // let val=req.header.authorization
  // console.log(val)
});
// app.get('/admin/check',adminverifys,(req,res)=>{
//     res.status(200).send("welcome")
//     console.log("connected to check")

// })
app.post("/login", (req, res) => {
  userhelper.userLogin(req.body).then((response) => {
    if (response.status === true) {
      const token = jwt.sign(
        {
          username: req.body.username,
          isAdmin: req.body.isAdmin,
          status: req.body.status,
        },
        "usersecret key",
        { expiresIn: 3000 }
      );

      res.status(200).json({ response: response, token: token });
    } else {
      res.status(200).json({ response: response });
    }
  });
});

app.post("/register", (req, res) => {
  userhelper.addUser(req.body).then((response) => {
    res.status(200).send(response);
  });
});

app.get("/logout", async (req, res) => {
  await res.json({ flag: true });
});
app.get("/login", verifys, async (req, res) => {
  await res.json({ status: false });
});
app.get("/main", verifys, async (req, res) => {
  await res.json({ status: false });
});

//admin
app.post("/admin/login", (req, res) => {
  adminhelper.checkAdmin(req.body).then((response) => {
    if (response.status === true) {
      const token = jwt.sign(
        {
          username: req.body.username,
          isAdmin: req.body.isAdmin,
        },
        "adminsecret key",
        { expiresIn: 3000 }
      );
      console.log(token);
      res.status(200).json({ response: response, token: token });
    } else {
      res.status(200).json({ response: response });
    }
  });
});
app.post("/admin/edit", (req, res) => {
  console.log(req.body);
  adminhelper.updateProduct(req.body).then((response) => {
    res.send(response);
  });
});

app.get("/admin/logout", async (req, res) => {
  await res.json({ flag: true });
});
app.get("/admin/login", adminverifys, async (req, res) => {
  await res.json({ status: false });
});
app.get("/admin/view", adminverifys, (req, res) => {
  res.json({ status: false });
});
app.get("/admin/edit/:id", async (req, res) => {
  console.log(req.params.id);
  adminhelper.editProduct(req.params.id).then((response) => {
    res.send(response);
  });
});
app.get("/admin/delete/:id", async (req, res) => {
  adminhelper.deleteProduct(req.params.id).then((response) => {
    res.send(response);
  });
});
app.get("/admin/block/:id", async (req, res) => {
  adminhelper.blockUser(req.params.id).then((response) => {
    res.send(response);
  });
});
app.post("/admin/add", (req, res) => {
  userhelper.addUser(req.body).then((response) => {
    console.log(response);
    res.send(response);
  });
});

app.listen(port, () => {
  console.log(`server ${port}`);
});
