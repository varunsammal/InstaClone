import React, { useEffect, useState } from 'react';
import "../css/Home.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([])


  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      navigate("/signup");
      return;
    }

    setUserId(user._id);

    // Fetch all posts
    fetch("/allposts", {
      headers: {
        Authorization: "Bearer " + token
      },
    })
      .then(res => res.json())
      .then(result => {
        setData(result)
        console.log(result)
      })
      .catch(err => console.log(err));
  }, [navigate]);

  // to show and hide comments 
  const toggleComment = (post) => {
    if (show) {
      setShow(false);
      setItem([])
    }
    else {
      setShow(true)
      setItem(post);
      setComment("")
    }
  }

  const likePost = (id) => {
    fetch("/like", {
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
    fetch("/unlike", {
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
    if (!text.trim()) return

    fetch("/comment", {
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
        notifyB("Comment Posted")
        setComment("");

        // update the comment modal also if open
        if (item._id === result._id) {
          setItem(result);
        }
      });
  };


  return (
    <div className='home'>
      {data.map((post) => (
        <div className="card" key={post._id}>
          {/* Card Header */}
          <div className="card-header">
            <div className="card-pic">
              <img
                src={post.postedBy.Photo ? post.postedBy.Photo : "https://www.shutterstock.com/shutterstock/photos/147255872/display_1500/stock-vector-male-profile-picture-silhouette-profile-avatar-147255872.jpg"}
                alt="profile"
              />
            </div>
            <h5>
              <Link to={`/profile/${post.postedBy._id}`}>
                {post.postedBy.name}
              </Link>

            </h5>
          </div>

          {/* Card Image */}
          <div className="card-image">
            <img src={post.photo} alt="post" />
          </div>

          {/* Card Content */}
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

          {/* Add Comment */}
          <div className="add-comment">
            <span className="material-symbols-outlined">
              sentiment_satisfied
            </span>
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


      {/* show comment  */}
      {show && (
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
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className='comment' onClick={() => { makeComment(comment, item._id); toggleComment() }} >Post</button>
              </div>
            </div >
          </div >
          <div className="close-comment" onClick={() => { toggleComment() }}>
            <span class="material-symbols-outlined">
              close
            </span>
          </div>
        </div >)
      }
    </div >
  );
}
