const mongoose = require('mongoose');
const Post = mongoose.model('Post', postSchema);

const postSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
        enum: ['Cheats', 'Tips', 'Build Challenges', 'GamePlay Challenges'],
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comments: [commentSchema],
    },
    { timestamps: true }
  );



  const commentSchema = new mongoose.Schema(
    {
      text: {
        type: String,
        required: true
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
  );

  module.exports = Post;