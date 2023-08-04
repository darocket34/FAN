import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import SearchBar from "./SearchBar";
import { fanLogo } from "../../images/";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav>
      <div className="nav left div">
        <NavLink exact to="/" className="logo link">
          <img src={fanLogo} className="logo" />
        </NavLink>
        <SearchBar className="searchBarComponent" />
      </div>
      <div className="nav right div">
        {sessionUser && (
          <Link className="nav startNewGroup" to="/groups/new">
            Start a new group
          </Link>
        )}
        {isLoaded && (
          <ProfileButton
            className="dropdown profilebutton"
            user={sessionUser}
          />
        )}
      </div>
    </nav>
  );
}

export default Navigation;
