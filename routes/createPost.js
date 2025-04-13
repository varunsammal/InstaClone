const express = require("express");
const router = express.Router()
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST")


router.get("/allposts", requireLogin, (req, res) => {
    POST.find()
        .populate("postedBy", "_id name Photo") // detailed information about specific field
        .sort("-createdAt") // sort posted according to the timestamp (-ve mean in descending order)
        .then(posts => {
            res.json(posts)
        }).catch(err => console.log(err))
})

//ROute
router.post("/createPost", requireLogin, (req, res) => {



    const { body, pic } = req.body;
    if (!body || !pic) {
        return res.status(422).json({ error: "please add all the fields" })
    }

    console.log(req.user)

    const post = new POST({
        body,
        photo: pic,

        postedBy: req.user
    })

    post.save().then((result) => {
        return res.json({ post: result })
    }).catch(err =>
        console.log(err))
})


//put is for update purpose
router.get("/myposts", requireLogin, async (req, res) => {
    try {
        const myposts = await POST.find({ postedBy: req.user._id })
            .populate("postedBy", "_id name Photo")
            .populate("comments.postedBy", "_id name Photo")
            .sort("-createAt")

        res.json({
            posts: myposts,
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                followers: req.user.followers,
                following: req.user.following,
                pic: req.user.pic // if you store profile pic
            }
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/like", requireLogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            { $push: { likes: req.user._id } },
            { new: true }
        ).populate("postedBy", "_id name Photo");

        res.json(result);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});



router.put("/unlike", requireLogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true }
        ).populate("postedBy", "_id name Photo");
        res.json(result);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
})



router.put("/comment", requireLogin, async (req, res) => {
    try {
        const comment = {
            comment: req.body.text, // text from frontend
            postedBy: req.user._id   // current logged-in user
        };

        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            {
                $push: {
                    comments: {
                        $each: [comment],
                        $sort: { _id: -1 } // 🆕 Optional: newest comment first
                    }
                }
            },
            {
                new: true
            }
        )
            .populate("comments.postedBy", "_id name") // populates user name in comments
            .populate("postedBy", "_id name");         // populates post author

        res.json(result); // send updated post back to frontend
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});

router.delete("/deletePost/:postId", requireLogin, async (req, res) => {
    try {
        const post = await POST.findById(req.params.postId).populate("postedBy", "_id");

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.postedBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized to delete this post" });
        }

        await post.deleteOne();
        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

// to show following post

router.get("/myfollowingpost", requireLogin, (req, res) => {
    POST.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name Photo")
        .populate("comments.postedBy", "_id name Photo")
        .then(posts => {
            res.json(posts)
        })
        .catch(err => { console.log(err) })
})

module.exports = router