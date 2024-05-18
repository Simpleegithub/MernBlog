const User = require('../Models/UserModel');

exports.getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            message: "success",
            user
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message || err.toString(),
        });
    }
}
