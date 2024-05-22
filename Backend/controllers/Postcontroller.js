const Post = require("../Models/PostModel");
const { ErrorHandler } = require("../utils/Error");


exports.create = async (req, res, next) => {
    // Check if the user is an admin
    if (!req.user.isAdmin) {
        return next(ErrorHandler(403, 'You are not allowed to create a post'));
    }

    // Check if required fields are present
    if (!req.body.content || !req.body.title) {
        return next(ErrorHandler(400, 'Please provide all the required fields'));
    }

    // Generate slug from title
    const slug = req.body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    // Create a new post instance
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id
    });

    try {
        // Save the new post to the database
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};
