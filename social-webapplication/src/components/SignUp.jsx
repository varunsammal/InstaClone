import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/SignUp.css'



import logo from '../assests/instagram-text.png'
import { toast } from 'react-toastify';

export default function SignUp() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //toast function
    const notifyA = (msg) => toast.error(msg)
    const notifyB = (msg) => toast.success(msg)


    const postData = () => {

        if (!emailRegex.test(email)) {
            return notifyA("Invalid Email");
        }
        else if (!strongPasswordRegex.test(password)) {
            notifyA("Password must contain at least eight character,including at least on number and one includes both lower and upper case letter and special character for example # @ !")
            return
        }

        fetch("https://instaclone-backend.up.railway.app/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                userName: userName,
                email: email,
                password: password
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    notifyA(data.error)
                }
                else {
                    notifyB(data.message)
                    navigate("/signin")
                }
                console.log(data)
            }
            )
    }

    return (
        <div className='signup'>
            <div className="form-container">
                <div className="form">
                    <img className='signUpLogo' src={logo} alt="" />
                    <p className='loginPara'>
                        Sign up to see photos and videos <br /> from your friends and family
                    </p>
                    <div>
                        <input type="email" name='email' required id='email' placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    </div>
                    <div>
                        <input type="text" name='name' id='name' placeholder='Full Name' value={name} onChange={(e) => { setName(e.target.value) }} />
                    </div>
                    <div>
                        <input type="text" name='username' id='username' placeholder='Username' value={userName} onChange={(e) => { setUserName(e.target.value) }} />
                    </div>
                    <div>
                        <input type="password" name='password' id='password' placeholder='Password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    <p className='loginPara' style={{ fontSize: "12px", margin: "3px 0px" }}>
                        By signing up, you agree to out Terms, <br /> privacy policy and cookies policy
                    </p>
                    <input type="submit" id='submit-btn' value="Sign Up" onClick={() => { postData() }} />
                </div>

                <div className="form2">
                    Already have an account?
                    <Link to={"/signin"}>
                        <span style={{ color: "blue", cursor: "pointer" }}> Sign In</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
