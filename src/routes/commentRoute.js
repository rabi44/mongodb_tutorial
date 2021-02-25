const { Router } = require("express");
const { isValidObjectId, startSession } = require("mongoose");
const commentRouter = Router({ mergeParams: true });

const { Comment, Blog, User } = require("../models");

commentRouter.post("/", async (req, res) => {
  const session = await startSession();
  let comment;
  try {
    //await session.withTransaction(async () => {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blogId is invalid" });
    const { content, userId } = req.body;
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: "userId is invalid" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required" });

    const [blog, user] = await Promise.all([
      // Blog.findById(blogId, {}, { session }),
      // User.findById(userId, {}, { session }),
      Blog.findById(blogId),
      User.findById(userId),
    ]);
    if (!blog || !user)
      return res.status(400).send({ err: "blog or user does not exist" });

    if (!blog.islive)
      return res.status(400).send({ err: "blog is not available" });
    comment = new Comment({
      content,
      user,
      userFullName: `${user.name.first} ${user.name.last}`,
      blog: blogId,
    });
    //await session.abortTransaction()
    // await Promise.all([
    //   comment.save(),
    //   Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }), // Blog의 comments 업데이트
    // ]);

    // commentsCounter가 병렬로 호출될 경우 제대로 업데이트 되지 않는 문제 -> 세션 사용 (API가 무거워짐)
    // blog.commentsCount++;
    // blog.comments.push(comment);
    // if (blog.commentsCount > 3) blog.comments.shift();
    // await Promise.all([
    //   comment.save({ session }),
    //   blog.save(), // 불러올 때 파라미터에 넣어서 이미 세션이 내장되어 있음
    //   // Blog.updateOne({ _id: blogId }, { $inc: { commentsCount: 1 } }),
    // ]);
    //});

    // commentsCounter 문제 session 안쓰고 해결
    // 내장을 적절히 잘하면 session (transaction)을 안써도 해결 가능
    // atomic 문제는 존재하나 금액과 같이 critical 한 데이터가 아니면 아래 방법 권장
    await Promise.all([
      comment.save(),
      Blog.updateOne(
        { _id: blogId },
        {
          $inc: { commentsCount: 1 },
          $push: { comments: { $each: [comment], $slice: -3 } },
        }
      ),
    ]);

    return res.send({ comment });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  } finally {
    //await session.endSession();
  }
});

commentRouter.get("/", async (req, res) => {
  let { page = 0 } = req.query;
  page = parseInt(page);
  const { blogId } = req.params;
  if (!isValidObjectId(blogId))
    return res.status(400).send({ err: "blogId is invalid" });

  const comments = await Comment.find({ blog: blogId })
    .sort({ createdAt: -1 })
    .skip(page * 3)
    .limit(3);
  //.populate([{ path: "user" }])
  return res.send({ comments });
});

commentRouter.patch("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (typeof content !== "string")
    return res.status(400).send({ err: "content is required" });

  const [comment] = await Promise.all([
    Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true }),
    Blog.updateOne(
      { "comments._id": commentId }, // comments._id: mongdb 문법 comments array안의 _id 값이 commentId 일 때
      { "comments.$.content": content } // comments.$.content: mongdb 문법 $는 array에서 조건을 만족하는 원소 값
    ),
  ]);

  return res.send({ comment });
});

commentRouter.delete("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findOneAndDelete({ _id: commentId });
  await Blog.updateOne(
    { "comments._id": commentId },
    { $pull: { comments: { _id: commentId } } }
  );
  return res.send({ comment });
});

module.exports = { commentRouter };
