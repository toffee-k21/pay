const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../model/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { Account } = require("../model/Account");

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  // const { success } = signupBody.safeParse(req.body);
  // console.log(success)
  // if (!success) {
  //   return res.status(411).json({
  //     message: "Incorrect inputs",
  //   });
  // }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
  const userId = user._id;

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  res.json({
    message: "User created successfully",
    token: token,
  });
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const exists = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (!exists) {
    return res.status(411).json({
      message: "Incorrect username/password or user not exists",
    });
  }

  const token = jwt.sign(
    {
      userId: exists._id,
    },
    JWT_SECRET
  );

  res.json({
    message: "User logged in successfully",
    token: token,
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = User.find({
    $or: [
      {
        firstname: {
          $ragex: filter,
        },
      },
      {
        lastname: {
          $ragex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
