import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assests/instagram-text.png'
import { LoginContext } from '../context/LoginContext'

import '../css/SignIn.css'
import { toast } from 'react-toastify';

export default function SignIn() {
  const { setUserLogin } = useContext(LoginContext)
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const postData = () => {

    if (!emailRegex.test(email)) {
      return notifyA("Invalid Email");
    }
    // else if (!strongPasswordRegex.test(password)) {
    //  notifyA("Password must contain at least eight character,including at least on number and one includes both lower and upper case letter and special character for example # @ !")
    //     return 
    // }

    fetch("https://instaclone-backend.up.railway.app/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          notifyA(data.error)
        }
        else {
          notifyB("Signed In Successfully")
          console.log(data.token)
          localStorage.setItem("jwt", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          setUserLogin(true)
          navigate("/")
        }
      }
      ).catch((err) => {
        console.error("Fetch failed:", err)
        notifyA("Server unreachable or some error occurred.")
      });
  }

  return (
    <div className='signIn'>
      <div className="loginForm">
        <img className='signUpLogo' src={logo} alt="" />
        <div>
          <input type="email" name='email' required id='email' placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
        </div>
        <div>
          <input type="password" name='password' id='password' placeholder='Password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
        </div>
        <input type="submit" id='submit-btn' onClick={() => postData()} value="Sign Ip" />
      </div>

      <div className="loginForm2">
        Don't have an account?
        <Link to={"/signup"}>
          <span style={{ color: "blue", cursor: "pointer" }}> Sign Up</span>
        </Link>
      </div>
    </div>


  )
}
