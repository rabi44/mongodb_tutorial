const { Router } = require("express");
const userRouter = Router();
const mongoose = require("mongoose");
const { User, Blog, Comment } = require("../models");

userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }

  // return res.send(users)
});

userRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userid" });
    const user = await User.findOne({ _id: userId });
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

userRouter.post("/", async (req, res) => {
  try {
    let { username, name } = req.body;
    if (!username) return res.status(404).send({ err: "username is required" });
    if (!name || !name.first || !name.last)
      return res
        .status(400)
        .send({ err: "Both first and last names are required" });
    const user = new User(req.body);
    await user.save();
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }

  // users.push({name:req.body.name, age:req.body.age})
  // return res.send({success:true});
});

userRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log({ userId });
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userid" });
    const { age, name } = req.body;
    if (!age && !name)
      return res.status(400).send({ err: "name or age is required" });
    if (age && typeof age !== "number")
      return res.status(400).send({ err: "age must be a number" });
    if (name && typeof name.first !== "string" && typeof name.last !== "string")
      return res
        .status(400)
        .send({ err: "first and last name should be string" });
    // store mongodb directry
    // let updateBody = {}
    // if(age) updateBody.age = age
    // if(name) updateBody.name = name
    // const user = await User.findByIdAndUpdate(userId, updateBody, { new:true})

    // using mongoose (check not null filed by mongoose)
    let user = await User.findById(userId);
    if (age) user.age = age;
    if (name) {
      user.name = name;
      await Promise.all([
        Blog.updateMany({ "user._id": userId }, { "user.name": name }), // Blog의 user 정보 업데이트
        Blog.updateMany(
          {},
          { "comments.$[comment].userFullName": `${name.first} ${name.last}` }, // 2. commet의 userFullName을 바꿔라
          { arrayFilters: [{ "comment.user": userId }] } // 1. comment의 user의 아이디가 userId 이면
        ), // Blog의 Comment 안의 user 정보 업데이트
      ]);
    }
    await user.save();
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

userRouter.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userid" });
    const [user] = await Promise.all([
      await User.findOneAndDelete({ _id: userId }),
      await Blog.deleteMany({ "user._id": userId }),
      await Blog.updateMany(
        { "comments.user": userId },
        { $pull: { comments: { user: userId } } }
      ),
      await Comment.deleteMany({ user: userId }),
    ]);
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = { userRouter };
