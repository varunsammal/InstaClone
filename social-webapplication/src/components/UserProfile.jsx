import React, { useEffect, useState } from 'react'
import '../css/UserProfile.css'

import PostDetail from './PostDetail' //taking userid from the url such as localhost:3000/profile/23423423423
import { useParams } from 'react-router-dom'

export default function UserProfile() {
    const { userid } = useParams()
    console.log(userid);
    const [posts, setPosts] = useState([])
    const [user, setUser] = useState("");
    const [isFollow, setIsFollow] = useState(false);

    // to follow user
    const followUser = (userId) => {
        fetch("/api/follow", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ followId: userId })
        })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(text) });
                }
                return res.json();
            })
            .then(data => console.log("Followed user:", data))
            .catch(err => console.error("Follow error:", err.message));
    };


    const unfollowUser = (userId) => {
        fetch("/api/unfollow", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ followId: userId })
        })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(text) });
                }
                return res.json();
            })
            .then(data => console.log("Followed user:", data))
            .catch(err => console.error("Follow error:", err.message));
    };


    useEffect(() => {

        fetch(`/api/user/${userid}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then((result) => {
                console.log(result)
                setUser(result.user)
                setPosts(result.posts)
                const currentUser = JSON.parse(localStorage.getItem("user"));
                if (result.user.followers.includes(currentUser._id)) {
                    setIsFollow(true);
                }
            })
    }, [userid])

    return (
        <div className='profile'>
            {/* profile-frame */}
            <div className="profile-frame">
                {/* profile-pic */}
                <div className="profile-pic">
                    <img src={user.Photo || "https://www.shutterstock.com/shutterstock/photos/147255872/display_1500/stock-vector-male-profile-picture-silhouette-profile-avatar-147255872.jpg"} />
                </div>
                {/* profile-data */}
                <div className="profile-data">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h1>{user.name}</h1>
                        <button className='followBtn' onClick={() => {
                            if (isFollow) {
                                unfollowUser(user._id)
                            } else {
                                followUser(user._id)
                            }

                        }}>{isFollow ? "Unfollow" : "Follow"}</button>
                    </div>
                    <div className="profile-info" style={{ display: "flex" }}>
                        <p>{posts.length} posts</p>
                        <p>{user.followers?.length || 0} followers</p>
                        <p>{user.following?.length || 0} following</p>

                    </div>
                </div>
            </div>

            <hr style={{
                width: "90%",

                opacity: "0.8",
                margin: "25px auto"
            }}></hr>

            {/* Gallery */}
            <div className="gallery">
                {posts.map((pics) => {
                    return <img src={pics.photo} className='item'
                    // onClick={() => {
                    //     toggleDetails(pics)
                    // }}
                    ></img>
                })}
            </div>

        </div>
    )
}
