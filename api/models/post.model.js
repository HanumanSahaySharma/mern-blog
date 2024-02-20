import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      unique: true,
      required: true,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    image: {
      type: String,
      default:
        "https://www.blogtyrant.com/wp-content/uploads/2017/02/how-to-write-a-good-blog-post.png",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
