const Post = require("../Models/PostModel");
const { ErrorHandler } = require("../utils/Error");
const User = require("../Models/UserModel");

exports.create = async (req, res, next) => {

  const {title,category,image,content}=req.body;
  console.log(req.user.id)
  // Check if the user is an admin
  if (!req.user.isAdmin) {
    return next(ErrorHandler(403, "You are not allowed to create a post"));
  }

  // Check if required fields are present
  if (!req.body.content || !req.body.title) {
    return next(ErrorHandler(400, "Please provide all the required fields"));
  }

  // Generate slug from title
  const slug = req.body.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-");
    console.log(slug)

  // Create a new post instance
  const newPost = new Post({
    title,
    category,
    image,
    content,
    slug,
    userId: req.user.id,
  });

  try {
    // Save the new post to the database
    const savedPost = await newPost.save();
    console.log(savedPost);
    res.status(201).json(savedPost);
  } catch (error) {
    console.log("hello error");
    console.log(error);
    next(error);
  }
};

exports.getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex || 0);
    const limit = parseInt(req.query.limit || 9);
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const OneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      updatedAt: { $gte: OneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(ErrorHandler(403, "You are not allowed to delete a post"));
  }

  const DeletedPost = await Post.findByIdAndDelete(req.params.postId);
  if (!DeletedPost) {
    return next(ErrorHandler(404, "Post Not Found"));
  }

  res.status(200).json({
    message: "Deleted Successfully",
    DeletedPost,
  });
};

exports.updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(ErrorHandler(403, "You are not allowed to update a post"));
  }

  try {
    console.log("hello");
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
      },
      { new: true }
    );

    res.status(200).json({
      updatedPost,
    });
  } catch (error) {
    next(error);
  }
};


