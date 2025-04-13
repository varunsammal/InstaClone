const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");



// to get user profile
router.get("/user/:id", async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId first
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
        const user = await USER.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await POST.find({ postedBy: id })
            .populate("postedBy", "_id");

        // Convert documents to plain objects
        const plainUser = user.toObject();
        const plainPosts = posts.map(post => post.toObject());

        res.json({ user: plainUser, posts: plainPosts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

//to follow user
router.put("/follow", requireLogin, async (req, res) => {
    try {
        const { followId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(followId)) {
            return res.status(400).json({ error: "Invalid follow ID" });
        }

        // Update the user to be followed: add current user as a follower
        const updatedFollowedUser = await USER.findByIdAndUpdate(
            followId,
            { $addToSet: { followers: req.user._id } }, // $addToSet prevents duplicates
            { new: true }
        ).select("-password");

        // Update current user: add followId to following list
        const updatedCurrentUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { following: followId } },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Followed successfully",
            followedUser: updatedFollowedUser,
            currentUser: updatedCurrentUser
        });

    } catch (error) {
        console.error("Follow error:", error.message);
        res.status(500).json({ error: "Something went wrong while following" });
    }
});


router.put("/unfollow", requireLogin, async (req, res) => {
    try {
        const { followId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(followId)) {
            return res.status(400).json({ error: "Invalid follow ID" });
        }

        // Update the user to be unfollowed: remove current user from followers
        const updatedUnfollowedUser = await USER.findByIdAndUpdate(
            followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        ).select("-password");

        // Update current user: remove followId from following
        const updatedCurrentUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: followId } },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Unfollowed successfully",
            unfollowedUser: updatedUnfollowedUser,
            currentUser: updatedCurrentUser
        });

    } catch (error) {
        console.error("Unfollow error:", error.message);
        res.status(500).json({ error: "Something went wrong while unfollowing" });
    }
});


// to upload profile pic
// to upload profile pic
router.put("/uploadProfilePic", requireLogin, async (req, res) => {
    try {
        const updatedUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $set: { Photo: req.body.pic } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error("Error updating profile pic:", err);
        res.status(500).json({ error: "Server error while updating profile picture" });
    }
});




module.exports = router;
