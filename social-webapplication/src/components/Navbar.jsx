import React, { useContext } from 'react';
import logo from "../assests/instagram-text.png";
import '../css/Navbar.css';
import { Link, } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ login }) {
  const { setModalOpen } = useContext(LoginContext)
  const navigate = useNavigate();
  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return (
        <>
          <Link style={{ marginRight: '20px' }} to={'/followingpost'}>
            <li>Followings</li>
          </Link>
          <Link to={'/profile'}>
            <li>Profile</li>
          </Link>
          <Link to={'/createPost'}>
            <li>Create Post</li>
          </Link>
          <Link to={""}>
            <button className="primaryBtn" onClick={() => { setModalOpen(true) }}>Log Out</button>
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link to={'/signin'}>
            <li>SignIn</li>
          </Link>
          <Link to={'/signup'}>
            <li>SignUp</li>
          </Link>
        </>
      );
    }
  };

  return (
    <div className="navbar">
      <img onClick={() => {
        navigate('/')
      }} src={logo} alt="logo" />
      <ul className="nav-menu">
        {loginStatus()}
      </ul>
    </div>
  );
}
