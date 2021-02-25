const { Schema, model, Types } = require("mongoose");
const { CommentSchema } = require("./Comment");

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    //user: { type: Types.ObjectId, required: true, ref: "user" },
    user: {
      _id: { type: Types.ObjectId, required: true, ref: "user" },
      username: { type: String, required: true },
      name: {
        first: { type: String, requried: true },
        last: { type: String, requried: true },
      },
    },
    commentsCount: { type: Number, default: 0, required: true },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

BlogSchema.index({ "user._id": 1, updatedAt: 1 });
BlogSchema.index({ title: "text", content: "text" }); // search 시 'text' 지정.  title 또는 content를 검색에 사용할 때: text는 하나만 걸 수 있음. 복합 키는 가능. 정확한 단어만 검색 가능.

// comment 조회를 위한 DB 가상 필드
// BlogSchema.virtual("comments", {
//   ref: "comment",
//   localField: "_id",
//   foreignField: "blog",
// });

// BlogSchema.set("toObject", { virtuals: true });
// BlogSchema.set("toJSON", { virtuals: true });

const Blog = model("blog", BlogSchema);

module.exports = { Blog };
