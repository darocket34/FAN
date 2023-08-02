import "./Listings.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import GroupsList from "../Groups/GroupsList";
import EventsList from "../Events/EventsList";
import { useState } from "react";

const AllListings = (list) => {
  const [listEvents, setListEvents] = useState(false);
  const [listGroups, setListGroups] = useState(false);
  const [hideEventsLink, setHideEventsLink] = useState("");
  const [hideGroupsLink, setHideGroupsLink] = useState("");

  useEffect(() => {
    if (window.location.toString().includes("groups")) {
      setListGroups(true);
      setListEvents(false);
      setHideEventsLink("grayout");
      setHideGroupsLink("");
    } else if (window.location.toString().includes("events")) {
      setListEvents(true);
      setListGroups(false);
      setHideGroupsLink("grayout");
      setHideEventsLink("");
    }
  }, [list]);

  return (
    <div className="listingPage">
      <div className="allgroups container">
        <div className="header links">
          <h2 className="allevents link">
            <Link className={`allevents link ${hideEventsLink}`} to="/events/">
              Events
            </Link>
          </h2>
          <h2 className="allgroups link">
            <Link className={`allgroups link ${hideGroupsLink}`} to="/groups/">
              Groups
            </Link>
          </h2>
        </div>
        <div className="header subtitle">
          <p className="header subtitle" style={{ color: "gray" }}>
            {listGroups && "Groups in F.A.N."}
            {listEvents && "Events in F.A.N."}
          </p>
        </div>
      </div>
      <>
        {listGroups && <GroupsList />}
        {listEvents && <EventsList />}
      </>
    </div>
  );
};

export default AllListings;
