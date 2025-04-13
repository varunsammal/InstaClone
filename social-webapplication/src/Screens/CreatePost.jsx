import React, { useState, useEffect } from 'react'
import '../css/CreatePost.css'


import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


export default function CreatePost() {

    const notifyA = (msg) => toast.error(msg)
    const notifyB = (msg) => toast.success(msg)

    const [body, setBody] = useState("");
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const navigate = useNavigate("")

    useEffect(() => {
        //saving post to mongodb
        if (url) {
            fetch("https://instaclone-backend.up.railway.app/createPost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error || data.message) {
                        notifyA(data.error || data.message || "Something went wrong")
                        console.log(data)
                    } else {
                        notifyB("Successfully Posted")
                        navigate("/")
                    }
                })
                .catch(err => console.log(err))

        }
    }, [url])

    // posting image to cloudinary
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
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                if (data.url) {
                    setUrl(data.url);
                } else {
                    notifyA("Cloudinary upload failed");
                    console.log("Cloudinary error:", data);
                }
            })
            .catch(err => {
                console.error("Cloudinary catch error:", err);
                notifyA("Something went wrong while uploading image.");
            });
    }




    const loadfile = (event) => {
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src)
        }
    }

    return (
        <div className='createPost'>
            {/* header  */}
            <div className="post-header">
                <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
                <button id='post-btn' onClick={() => { postDetails() }}>Share</button>
            </div>
            {/* image-preview */}
            <div className="main-div">
                <img id='output' src='https://cdn4.iconfinder.com/data/icons/essentials-74/24/006_-_Image-64.png' />
                <input type="file" accept='image/*' onChange={(event) => {
                    {
                        loadfile(event)
                        setImage(event.target.files[0])
                    }
                }} />
            </div>

            {/* details  */}
            <div className="details">
                <div className="card-header">
                    <div className="card-pic">
                        <img src="https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8MnwwfHx8MA%3D%3D" alt="" />
                    </div>
                    <h5>Ramesh</h5>
                </div>
                <textarea value={body} onChange={(e) => {
                    setBody(e.target.value)
                }} type="text" placeholder='write a caption'></textarea>
            </div>
        </div>
    )
}
