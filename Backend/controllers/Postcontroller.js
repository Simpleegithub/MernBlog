const Post = require("../Models/PostModel");
const { ErrorHandler } = require("../utils/Error");

exports.create = async (req, res, next) => {
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

  // Create a new post instance
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    // Save the new post to the database
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
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
      updatedAt: { $gte: OneMonthAgo }
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts
    });

  } catch (error) {
    next(error);
  }
};

