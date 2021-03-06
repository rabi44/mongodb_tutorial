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
    const { MONGO_URI, PORT } = process.env;

    if (!MONGO_URI) throw new Error("MONGI_URI is required!!!");
    if (!PORT) throw new Error("PORT is required!!!");

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false, 
    });
    //mongoose.set("debug", true);
    //await generateFakeData(100, 10, 300); // dummy data gen
    app.use(express.json());
    app.use("/user", userRouter);
    app.use("/blog", blogRouter);

    app.listen(PORT, async () => {
      // await Promise.all([
      //   generateFakeData(10, 10, 10),
      //   generateFakeData(10, 10, 10),
      //   generateFakeData(10, 10, 10),
      //   generateFakeData(10, 10, 10),
      //   generateFakeData(10, 10, 10),
      // ]);
      //await generateFakeData(10, 20, 100); // dummy data gen
      console.log(`Server lisntening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

server();
