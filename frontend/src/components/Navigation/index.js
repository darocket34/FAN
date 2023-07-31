import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import SearchBar from "./SearchBar";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav>
      <div className="nav left div">
        <NavLink exact to="/" className="logo link">
          F.A.N.
        </NavLink>
        <SearchBar className="searchBarComponent" />
      </div>
      <div className="nav right div">
        {" "}
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
