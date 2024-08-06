import express from 'express';
import bcrypt from "bcrypt";
const router = express.Router();

router.post("/login", async (req, res) => {
  console.log(req.body);
  if (req.body && req.body["email"] && req.body["pass"]) {
    let user = await req.models.Auth.findOne({"email": req.body["email"]});
    if (user) {
      try {
        if (await bcrypt.compare(req.body["pass"], user["password"])) {
          req.session.userId = user["_id"];

          res.type('text').send('Success!');
        } else {
          res.type('text').status(404).send("Wrong password!");
        }
      } catch (err) {
        console.error(err);
        res.type('text').status(500).send("There was an error on the server!")
      }
    } else {
      res.type('text').status(401).send("This account isn't registered yet!");
    }
  } else {
    res.type('text').status(400).send("Missing necessary user input!");
  }
});

router.post("/register", async (req, res) => {
  if (req.body && req.body["email"] && req.body["pass"]) {
    try {
      let hashedPass = await bcrypt.hash(req.body["pass"], 10);
      let newAuth = new req.models.Auth({
        "email": req.body["email"],
        "password": hashedPass,
      });
  
      await newAuth.save();

      req.session.userId = newAuth["_id"];

      res.type('text').send("Success!");
    } catch (err) {
      res.type('text').status(500).send("There was an error on the server")
    }
  } else {
    res.type('text').status(400).send("Missing necessary user input!");
  }
});

router.post("/logout", async (req, res) => {
  res.type('text');
  if (req.session.userId) {
    req.session.userId = null;
    res.send("Success!");
  } else {
    res.status(401).send("You can't log out if you haven't logged in.")
  }
});

export default router;