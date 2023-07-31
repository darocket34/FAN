import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [chevron, setChevron] = useState("up");
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
    document.addEventListener("click", setChevron('up'));

    return () => {
      document.removeEventListener("click", closeMenu);
      document.removeEventListener("click", setChevron('down'));
    }
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
          <div className="profile-dropdown div">
            <i className="fas fa-user-circle fa-2x" />
            <i className={`fa-solid fa-chevron-${chevron} fa-2x`} />
          </div>
        </button>
        <ul className={ulClassName} ref={ulRef}>
          {user ? (
            <>
              <div className="modal-menu-profile">
                <li className="modal-menu-user">{user.username}</li>
                <li className="modal-menu-user">
                  {user.firstName} {user.lastName}
                </li>
                <li className="modal-menu-user">{user.email}</li>
                <li className="modal-menu-user">
                  <button className="modal-menu-item" onClick={logout}>
                    Log Out
                  </button>
                </li>
              </div>
            </>
          ) : (
            <>
            <div className="modal-menu">
              <button className="modal-menu-item">
                <OpenModalMenuItem
                  className="modal-menu-item"
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </button>
              <button className="modal-menu-item">
                <OpenModalMenuItem
                  className="modal-menu-item"
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </button>
              </div>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default ProfileButton;
