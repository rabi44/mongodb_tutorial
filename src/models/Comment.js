const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const CommentSchema = new Schema(
  {
    content: { type: String, reqruied: true },
    user: { type: ObjectId, reqruied: true, ref: "user", index: true },
    userFullName: { type: String, reqruied: true },
    blog: { type: ObjectId, reqruied: true, ref: "blog" },
  },
  { timestamps: true }
);
CommentSchema.index({ blog: 1, createdAt: -1 });
const Comment = model("comment", CommentSchema);
module.exports = { Comment, CommentSchema };
