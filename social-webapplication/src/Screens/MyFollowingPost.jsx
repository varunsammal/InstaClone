import React, { useEffect, useState } from 'react';
import "../css/Home.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function MyFollowingPost() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [comment, setComment] = useState("");
    const [userId, setUserId] = useState(null);
    const [show, setShow] = useState(false);
    const [item, setItem] = useState([]);

    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user) {
            navigate("/signup");
            return;
        }

        setUserId(user._id);

        fetch("/api/myfollowingpost", {
            headers: {
                Authorization: "Bearer " + token
            },
        })
            .then(res => res.json())
            .then(result => {
                setData(result);
            })
            .catch(err => console.log(err));
    }, [navigate]);

    const toggleComment = (post) => {
        setShow(!show);
        setItem(post);
        setComment("");
    };

    const likePost = (id) => {
        fetch("/api/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map((post) => post._id === result._id ? result : post);
                setData(newData);
            });
    };

    const unlikePost = (id) => {
        fetch("/api/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map((post) => post._id === result._id ? result : post);
                setData(newData);
            });
    };

    const makeComment = (text, id) => {
        if (!text.trim()) return;

        fetch("/api/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ text, postId: id })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map((post) => post._id === result._id ? result : post);
                setData(newData);
                notifyB("Comment Posted");
                setComment("");
                if (item._id === result._id) setItem(result);
            });
    };

    return (
        <div className='home'>
            {data.map((post) => (
                <div className="card" key={post._id}>
                    <div className="card-header">
                        <div className="card-pic">
                            <img
                                src={post.postedBy.Photo || "https://www.shutterstock.com/shutterstock/photos/147255872/display_1500/stock-vector-male-profile-picture-silhouette-profile-avatar-147255872.jpg"}
                                alt="profile"
                            />
                        </div>
                        <h5>
                            <Link to={`/profile/${post.postedBy._id}`}>
                                {post.postedBy.name}
                            </Link>
                        </h5>
                    </div>
                    <div className="card-image">
                        <img src={post.photo} alt="post" />
                    </div>
                    <div className="card-content">
                        <span
                            className={`material-symbols-outlined ${post.likes.includes(userId) ? "liked" : ""}`}
                            onClick={() => {
                                post.likes.includes(userId) ? unlikePost(post._id) : likePost(post._id);
                            }}
                        >
                            favorite
                        </span>
                        <p>{post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}</p>
                        <p>{post.body}</p>
                        <p style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => toggleComment(post)}>View all comments</p>
                    </div>
                    <div className="add-comment">
                        <span className="material-symbols-outlined">sentiment_satisfied</span>
                        <input
                            type="text"
                            placeholder='Add a comment'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button className='comment' onClick={() => makeComment(comment, post._id)}>Post</button>
                    </div>
                </div>
            ))}

            {show && (
                <div className="showComment">
                    <div className="container">
                        <div className="postPic">
                            <img src={item.photo} alt="" />
                        </div>
                        <div className="details">
                            <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                                <div className="card-pic">
                                    <img
                                        src={item.postedBy.Photo || "https://www.shutterstock.com/shutterstock/photos/147255872/display_1500/stock-vector-male-profile-picture-silhouette-profile-avatar-147255872.jpg"}
                                        alt="profile"
                                    />
                                </div>
                                <h5>{item.postedBy.name}</h5>
                            </div>
                            <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
                                {item.comments.map((comment, index) => (
                                    <p className='comm' key={index}>
                                        <span className='commenter' style={{ fontWeight: 'bolder' }}>{comment.postedBy.name}</span>
                                        <span className='commentText'> {comment.comment}</span>
                                    </p>
                                ))}
                            </div>
                            <div className="card-content">
                                <p>{item.likes.length}</p>
                                <p>{item.body}</p>
                            </div>
                            <div className="add-comment">
                                <span className="material-symbols-outlined">sentiment_satisfied</span>
                                <input
                                    type="text"
                                    placeholder='Add a comment'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button className='comment' onClick={() => { makeComment(comment, item._id); toggleComment(); }}>Post</button>
                            </div>
                        </div>
                    </div>
                    <div className="close-comment" onClick={() => toggleComment()}>
                        <span className="material-symbols-outlined">close</span>
                    </div>
                </div>
            )}
        </div>
    );
}
