const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [
    auth,
    [check('text', 'Please enter something to create Post').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('ERROR occured while creating Post');
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error('ERROR while getting posts' + err.message);
    return res.status(500).send('Internal Server Error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by post id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.error('Post Not Found');
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    res.json(post);
  } catch (err) {
    console.error('ERROR while getting posts' + err.message);
    if (err.kind === 'ObjectId') {
      console.error('Post Not Found');
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete post by post id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.error('Post Not Found');
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    // check if the current user owns the post to be deleted
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'User not owns this post, so not authorized to delete' });
    }

    await post.remove();

    res.json({ msg: 'Post removed successfully' });
  } catch (err) {
    console.error('ERROR while Deleting post' + err.message);
    if (err.kind === 'ObjectId') {
      console.error('Post Not Found');
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.error('Post Not Found');
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    // check if the post has already been liked by user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error('ERROR occured while liking the post: ' + err.message);
    if (err.kind === 'ObjectId') {
      console.error('Post Not Found');
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.error('Post Not Found');
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    // check if the post has already been unliked by user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res
        .status(400)
        .json({ msg: 'Post has not been liked yet, so can not dislike ' });
    }

    // get the remove index for the like
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error('ERROR occured while unliking the post: ' + err.message);
    if (err.kind === 'ObjectId') {
      console.error('Post Not Found');
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Please enter comment to post').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('ERROR occured while posting comment');
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

// @route   DELETE api/posts/:post_id/comment/:comment_id
// @desc    Delete a comment on a post
// @access  Private
router.delete('/:post_id/comment/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      console.error('Post not found');
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    // pull out comment from the post
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      console.error('Comment not found');
      return res.status(404).json({ msg: 'Comment Not Found' });
    }

    // Now checking if the current user owns the comment to delete
    if (comment.user.toString() !== req.user.id) {
      console.error('User not authorized to delete comment of someone else');
      return res
        .status(401)
        .json({ msg: 'User not authorized to delete comment of someone else' });
    }

    // get the remove index for the like
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error('ERROR occured while deleting comment from given post');
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
