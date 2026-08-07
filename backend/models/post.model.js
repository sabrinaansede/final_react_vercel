import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
  author: { type: String, required: true },
  category: { type: String },
  text: { type: String },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
});

const Post = mongoose.model('Post', postSchema);
export default Post;
