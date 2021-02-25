const express = require("express");
const app = express();
const mongoose = require("mongoose");

//const { generateFakeData } = require("../faker");
const { generateFakeData } = require("../faker2");

const { userRouter, blogRouter, commentRouter } = require("./routes/");

// const users = []
//const MONGO_URI =
// "mongodb+srv://admin:" +
// "Kona!234" +
// "@cluster0.wmtyh.mongodb.net/" +
// "BlogService" +
// "?retryWrites=true&w=majority";

const server = async () => {
  try {
    const { MONGO_URI } = process.env;

    if (!MONGO_URI) throw new Error("MONGI_URI is required!!!");

    await mongoose.connect(MONGO_URI, {
      useCreateIndex: true,
      useFindAndModify: false /* useNewUrlParser: true, useUnifiedTopology: true */,
    });
    //mongoose.set("debug", true);
    //await generateFakeData(100, 10, 300); // dummy data gen
    app.use(express.json());
    app.use("/user", userRouter);
    app.use("/blog", blogRouter);

    app.listen(3000, async () => {
      // await Promise.all([
      //   generateFakeData(10, 10, 10),
      //   generateFakeData(10, 10, 10),
      //   generateFakeData(10, 10, 10),
      //   generateFakeData(10, 10, 10),
      //   generateFakeData(10, 10, 10),
      // ]);
      //await generateFakeData(10, 20, 100); // dummy data gen
      console.log("Server lisntening on port 3000");
    });
  } catch (err) {
    console.log(err);
  }
};

server();
