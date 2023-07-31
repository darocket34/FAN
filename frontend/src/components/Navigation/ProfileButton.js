import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>

      <div className="dropdown-menu">
        <button className="profile-dropdown" onClick={openMenu}>
          <i className="fas fa-user-circle fa-2x" />
        </button>
          <ul className={ulClassName} ref={ulRef}>
            {user ? (
              <>
                <li className="modal-menu-profile">{user.username}</li>
                <li className="modal-menu-profile">
                  {user.firstName} {user.lastName}
                </li>
                <li className="modal-menu-profile">{user.email}</li>
                <li className="modal-menu-profile">
                  <button className='logout' onClick={logout}>Log Out</button>
                </li>
              </>
            ) : (
              <>
                <OpenModalMenuItem
                  className="modal-menu-item"
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
                <OpenModalMenuItem
                  className="modal-menu-item"
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </>
            )}
          </ul>
        </div>

    </>
  );
}

export default ProfileButton;
