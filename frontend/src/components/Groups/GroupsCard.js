import "../Listings/Listings.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadEvents } from "../../store/events";

const GroupsCard = ({ group }) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => Object.values(state.events.allEvents));
  const numEvents = events.filter((event) => event.groupId === group.id).length;

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  return (
    <div key={`${group.id}`}>
      <hr></hr>
      <div className="listing card">
        <img
          className="listing img"
          src="https://i.imgur.com/ye8yURO.jpeg"
          alt="hike img"
        ></img>
        <div className="card text">
          <p className="card title">{group.name}</p>
          <p className="card location">
            {group.city}, {group.state}
          </p>
          <p className="card about">{group.about}</p>
          <div className="card additionalInfo">
            <p className="card numEvents">{numEvents} Events</p>
            <p className="card dot">·</p>
            <p className="card private">
              {group.private === false ? "Public" : "Private"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsCard;
