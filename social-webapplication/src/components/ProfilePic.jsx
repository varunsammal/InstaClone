import React, { useState, useEffect, useRef } from 'react';
import '../css/ProfilePic.css';

export default function ProfilePic({ changeprofile }) {
    const hiddenFileInput = useRef(null);
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");

    const notifyA = (msg) => {
        alert(msg); // you can replace this with toast or Snackbar
    };

    const handleClick = () => {
        hiddenFileInput.current.click(); // triggers the hidden file input
    };

    const postPic = () => {
        fetch("https://instaclone-backend.up.railway.app/uploadProfilePic", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                pic: url
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log("Profile updated:", data);
                notifyA("Profile picture updated successfully");
                changeprofile(); // close the modal
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                notifyA("Failed to update profile picture");
            });
    };

    const postDetails = () => {
        if (!image) {
            notifyA("Please select an image");
            return;
        }

        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta_clone");
        data.append("cloud_name", "varunsammal");

        fetch("https://api.cloudinary.com/v1_1/varunsammal/image/upload", {
            method: "POST",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                if (data.url) {
                    setUrl(data.url);
                } else {
                    notifyA("Cloudinary upload failed");
                }
            })
            .catch(err => {
                console.error("Cloudinary error:", err);
                notifyA("Something went wrong while uploading image.");
            });
    };

    useEffect(() => {
        if (image) {
            postDetails();
        }
    }, [image]);

    useEffect(() => {
        if (url) {
            postPic(); // FIX: you had just written `postPic` instead of calling it
        }
    }, [url]);

    return (
        <div className="profilePic darkBg">
            <div className="changePic">
                <h2>Change Profile Photo</h2>
                <button className="upload-btn" onClick={handleClick}>Upload Photo</button>
                <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={(e) => setImage(e.target.files[0])}
                    accept='image/*'
                    style={{ display: "none" }}
                />
                <button className="cancel-btn" onClick={() => {
                    setUrl(null)
                    postPic()
                }}>Remove Current Photo</button>
                <button className="cancel-btn" onClick={changeprofile}>Cancel</button>
            </div>
        </div>
    );
}
