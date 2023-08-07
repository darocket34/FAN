import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

function ProfileButton({ user }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [chevron, setChevron] = useState("down");
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
    document.addEventListener("click", setChevron("up"));

    return () => {
      document.removeEventListener("click", closeMenu);
      document.removeEventListener("click", setChevron("down"));
    };
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div className="dropdown-menu">
        <button className="profile-dropdown" onClick={openMenu}>
          <div className="profile-dropdown div">
            <i className="fas fa-user-circle fa-xl" />
            <i className={`fa-solid fa-chevron-${chevron} fa-xl`} />
          </div>
        </button>
        <ul className={ulClassName} ref={ulRef}>
          {user ? (
            <>
              <div className="modal-menu-profile">
                <li className="modal-menu-user firstname">Hello, {user.firstName}.</li>
                <li className="modal-menu-user email">{user.email}</li>
                <li className="modal-menu-user">
                  <Link className="modal-menu-item dropdown groups" to='/groups'>
                    View Groups
                  </Link>
                </li>
                <li className="modal-menu-user">
                  <Link className="modal-menu-item dropdown groups" to='/events'>
                    View Events
                  </Link>
                </li>
                <hr></hr>
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
