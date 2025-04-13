import React, { useEffect, useState } from 'react'
import '../css/Profile.css'

import PostDetail from '../components/PostDetail'
import ProfilePic from '../components/ProfilePic';

export default function Profile() {
    const [pic, setPic] = useState([])
    const [show, setShow] = useState(false);
    const [posts, setPosts] = useState([])
    const [user, setUser] = useState({}); // ← for user info
    const [changePic, setChangePic] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false);

    const handleDeletePost = (deletedPostId) => {
        setPic(prev => prev.filter(p => p._id !== deletedPostId));
        setShow(false); // optional: hide the detail modal after deletion
    };


    const toggleDetails = (post) => {
        if (show) {
            setShow(false);
            setPosts([])
        }
        else {
            setShow(true)
            setPosts(post);

        }
    }

    const changeprofile = () => {
        if (changePic) {
            setChangePic(false)
        }
        else {
            setChangePic(true)
        }
    }

    useEffect(() => {
        fetch(`/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then((result) => {
                setPic(result.posts);      // 💥 Only the posts array here
                setUser(result.user);      // ✅ Set user info

                const currentUser = JSON.parse(localStorage.getItem("user"));
                setIsFollowing(result.user.followers.includes(currentUser._id));
            });
    }, []);

    const handleFollowToggle = () => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const action = isFollowing ? 'unfollow' : 'follow';

        fetch(`/${action}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ followId: user._id })
        })
            .then(res => res.json())
            .then((data) => {
                setIsFollowing(!isFollowing); // toggle follow status
                // Update followers count
                setUser(prevUser => ({
                    ...prevUser,
                    followers: isFollowing
                        ? prevUser.followers.filter(id => id !== currentUser._id)
                        : [...prevUser.followers, currentUser._id]
                }));
            });
    };



    return (
        <div className='profile'>
            {/* profile-frame */}
            <div className="profile-frame">
                {/* profile-pic */}
                <div className="profile-pic"
                    onClick={changeprofile}>
                    <img src={user.Photo || "https://www.shutterstock.com/shutterstock/photos/147255872/display_1500/stock-vector-male-profile-picture-silhouette-profile-avatar-147255872.jpg"} />
                </div>
                {/* profile-data */}
                <div className="profile-data">
                    <h1>{user.name}</h1>

                    {/* Follow/Unfollow Button */}
                    {
                        JSON.parse(localStorage.getItem("user"))._id !== user._id && (
                            <button onClick={handleFollowToggle} className="follow-btn">
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )
                    }
                    <div className="profile-info" style={{ display: "flex" }}>
                        <p>{pic.length} posts</p>
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
                {pic.map((pics) => {
                    return <img src={pics.photo} className='item'
                        onClick={() => {
                            toggleDetails(pics)
                        }}></img>
                })}
            </div>
            {show &&
                <PostDetail
                    item={posts}
                    toggleDetails={toggleDetails}
                    onPostDelete={handleDeletePost}
                />
            }
            {
                changePic &&
                <ProfilePic changeprofile={changeprofile} />
            }
        </div>
    )
}
