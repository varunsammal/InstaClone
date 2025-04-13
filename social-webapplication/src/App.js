import Home from './Screens/Home';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './Screens/Profile';
import Modal from './components/Modal';
import { createContext, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css'
import CreatePost from './Screens/CreatePost';
import { LoginContext } from './context/LoginContext';
import UserProfile from './components/UserProfile';
import MyFollowingPost from './Screens/MyFollowingPost';

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <BrowserRouter>
      <div className="App">

        <LoginContext.Provider value={{ setUserLogin, setModalOpen }}>
          <Navbar login={userLogin} />
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/signup' element={<SignUp />}></Route>
            <Route path='/signin' element={<SignIn />}></Route>
            <Route path='/profile' element={<Profile />}></Route>
            <Route path='/createPost' element={<CreatePost />}></Route>
            <Route path='/profile/:userid' element={<UserProfile />}></Route>
            <Route path='/followingpost' element={<MyFollowingPost />}></Route>
          </Routes>
          <ToastContainer theme='dark' />
          {modalOpen && <Modal setModalOpen={setModalOpen} />}
        </LoginContext.Provider>

      </div>
    </BrowserRouter>
  );
}

export default App;
