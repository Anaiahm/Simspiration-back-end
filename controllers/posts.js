const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Post = require('../models/post.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);
router.post('/', async (req, res) => { 
    try {
    req.body.author = req.user._id;
    const post = await Post.create(req.body);
    post._doc.author = req.user;
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
router.get('/', async (req, res) => {
    try {
    const posts = await Post.find({})
      .populate('author')
      .sort({ createdAt: 'desc' });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate('author');
        res.status(200).json(post);
      } catch (error) {
        res.status(500).json(error);
      }
});
router.put('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
    
        if (!post.author.equals(req.user._id)) {
          return res.status(403).send("You're not allowed to do that!");
        }
    
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.postId,
          req.body,
          { new: true }
        );
    
        updatedPost._doc.author = req.user;
    
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json(error);
      }
});
router.delete('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
    
        if (!post.author.equals(req.user._id)) {
          return res.status(403).send("You're not allowed to do that!");
        }
    
        const deletedPost = await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json(deletedPost);
      } catch (error) {
        res.status(500).json(error);
      }
});
// controllers/hoots.js

router.post('/:postId/comments', async (req, res) => {
    try {
        req.body.author = req.user._id;
        const post = await Post.findById(req.params.postId);
        post.comments.push(req.body);
        await post.save();
    
        const newComment = post.comments[post.comments.length - 1];
    
        newComment._doc.author = req.user;
    
        res.status(201).json(newComment);
      } catch (error) {
        res.status(500).json(error);
      }
});
router.put('/:postId/comments/:commentId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        const comment = post.comments.id(req.params.commentId);
        comment.text = req.body.text;
        await post.save();
        res.status(200).json({ message: 'Ok' });
      } catch (err) {
        res.status(500).json(err);
      }
});
router.delete('/:postId/comments/:commentId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        post.comments.remove({ _id: req.params.commentId });
        await post.save();
        res.status(200).json({ message: 'Ok' });
      } catch (err) {
        res.status(500).json(err);
      }
});


module.exports = router;