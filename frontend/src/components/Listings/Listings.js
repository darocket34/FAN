import "./Listings.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import GroupsList from "../Groups/GroupsList";
import EventsList from "../Events/EventsList";
import { useState } from "react";

const AllListings = (list) => {
  const [listEvents, setListEvents] = useState(false);
  const [listGroups, setListGroups] = useState(false);
  const [hideEventsLink, setHideEventsLink] = useState("allevents link");
  const [hideGroupsLink, setHideGroupsLink] = useState("allgroups link");

  useEffect(() => {
    if (window.location.toString().includes("groups")) {
      setListGroups(true);
      setListEvents(false);
      setHideEventsLink("grayoutHeader");
      setHideGroupsLink("allgroups link");
    } else if (window.location.toString().includes("events")) {
      setListEvents(true);
      setListGroups(false);
      setHideGroupsLink("grayoutHeader");
      setHideEventsLink("allevents link");
    }
  }, [list]);

  return (
    <div className="listingPage">
      <div className="allgroups container">
        <div className="header links">
          <h2 className="allevents link">
            <Link className={hideEventsLink} to="/events/">
              Events
            </Link>
          </h2>
          <h2 className="allgroups link">
            <Link className={hideGroupsLink} to="/groups/">
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
