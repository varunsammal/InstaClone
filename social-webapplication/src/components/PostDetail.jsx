import React from 'react'
import '../css/PostDetail.css'
export default function PostDetail({ item, toggleDetails, onPostDelete }) {


    const removePost = (postId) => {
        if (window.confirm("Do you really want to delete the post ?")) {
            fetch(`/api/deletePost/${postId}`, {
                method: "delete",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt")
                }
            }
            ).then((res) => res.json())
                .then((result) => {
                    console.log(result);
                    onPostDelete(postId); // 👈 update UI in parent
                })
                .catch((err) => {
                    console.error("Failed to delete post:", err);
                });

        }

    }

    return (
        <div className="showComment">
            <div className="container">
                <div className="postPic">
                    <img src={item.photo}
                        alt="" />
                </div>
                <div className="details">
                    <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                        <div className="card-pic">
                            <img
                                src="https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=500&auto=format&fit=crop&q=60"
                                alt="profile"
                            />
                        </div>
                        <h5>{item.postedBy.name}</h5>
                        <div className="deletePost" onClick={() => { removePost(item._id) }} >
                            <span className="material-symbols-outlined">
                                delete
                            </span>
                        </div>
                    </div>


                    {/* commentSection  */}
                    <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>

                        {item.comments.map((comment, index) => {
                            return (<p className='comm' key={index}>
                                <span className='commenter' style={{ fontWeight: 'bolder' }}>{comment.postedBy.name}</span>
                                <span className='commentText'> {comment.comment}</span>
                            </p>)
                        })}
                    </div>
                    <div className="card-content">
                        <p>{item.likes.length}</p>
                        <p>{item.body}</p>
                    </div>

                    <div className="add-comment">
                        <span className="material-symbols-outlined">
                            sentiment_satisfied
                        </span>
                        <input
                            type="text"
                            placeholder='Add a comment'
                        // value={comment}
                        // onChange={(e) => setComment(e.target.value)}
                        />
                        <button className='comment'
                        //  onClick={() => { makeComment(comment, item._id); toggleComment() }}
                        >Post</button>
                    </div>
                </div >
            </div >
            <div className="close-comment"
                onClick={() => { toggleDetails() }}
            >
                <span class="material-symbols-outlined">
                    close
                </span>
            </div>
        </div >
    )
}
