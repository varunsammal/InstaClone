import React from 'react'
import { RiCloseLine } from "react-icons/ri"
import '../css/Modal.css'
import { useNavigate } from 'react-router-dom'

export default function Modal({ setModalOpen }) {
  const navigate = useNavigate();
  return (
    <div className="darkBg" onClick={() => setModalOpen(false)}>
      <div className="centered">

        <div className='modal'>
          {/* modal header */}
          <div className="modalHeader">
            <h5 className='heading'>Confirm</h5>
          </div>
          <button className='closeBtn'>
            <RiCloseLine></RiCloseLine>
          </button>
          {/* modalContent */}
          <div className="modalContent">
            Are You really want to log out ?
          </div>
          <div className="modalActions">
            <div className="actionContainer">
              <button className="logOutBtn" onClick={() => {
                setModalOpen(false);
                localStorage.clear();
                navigate("/signin");
              }}>Log Out</button>
              <button className="cancelBtn" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}
