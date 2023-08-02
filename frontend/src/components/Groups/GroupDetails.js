import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadSingleGroup } from "../../store/groups";
import { loadEvents } from "../../store/events";
import { Link } from "react-router-dom";
import EventsCard from "../Events/EventsCard";
import "./Groups.css";

const GroupDetails = () => {
  const { groupId } = useParams();
  const today = new Date();
  const currGroup = useSelector((state) =>
    Object.values(state.groups.singleGroup)
  );
  const group = currGroup[0];
  const events = useSelector((state) => Object.values(state.events.allEvents));
  const groupEvents = events.filter((event) => event.groupId === group.id);
  const pastGroupEvents = groupEvents.filter((event) => {
    const start = new Date(event.startDate);
    return start < today;
  });
  const futureGroupEvents = groupEvents.filter((event) => {
    const start = new Date(event.startDate);
    return start > today;
  });
  const numEvents = groupEvents.length;
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(loadSingleGroup(groupId))
      .then(() => dispatch(loadEvents()))
      .then(() => setIsLoaded(true));
  }, [dispatch, groupId]);

  return (
    <>
      {isLoaded && (
        <>
          <div className="detail page container">
            <div className="upper link container">
              <i className="fa-solid fa-chevron-left fa-xs"></i>
              <i className="fa-solid fa-chevron-left fa-xs"></i>
              <Link className="upper toGroups" to="/groups">
                Groups
              </Link>
            </div>
            <div className="upperSection container">
              <div className="upper img container">
                <img
                  className="upper img"
                  src="https://i.imgur.com/ye8yURO.jpeg"
                  alt="hike img"
                ></img>
              </div>
              <div className="upper text container">
                <h1 className="upper title">{group.name}</h1>
                <p className="upper location">
                  {group.city}, {group.state}
                </p>
                <div className="upper additionalInfo">
                  <p className="upper numEvents">{numEvents} Events</p>
                  <p className="upper dot">·</p>
                  <p className="Upper private">
                    {group.private === false ? "Public" : "Private"}
                  </p>
                </div>
                <p className="upper organizer">
                  {group.Organizer.firstName} {group.Organizer.lastName}
                </p>
                <button className="upper join">Join this group</button>
              </div>
            </div>
          </div>
          <div className="lowerSection container">
            <div className="lowerSection background"></div>
            <div className="lower text container">
              <h1 className="lower title">Organizer</h1>
              <p className="lower organizer">
                {group.Organizer.firstName} {group.Organizer.lastName}
              </p>
              <h1 className="lower title">What we're about</h1>
              <p className="lower about">{group.about}</p>
              {futureGroupEvents && (
                <h1 className="lower title">
                  Upcoming Events ({futureGroupEvents.length})
                </h1>
              )}
              {futureGroupEvents &&
                futureGroupEvents.map((event) => {
                  return <EventsCard key={event.id} event={event} />;
                })}
              <h1 className="lower title">
                Past Events ({pastGroupEvents.length})
              </h1>
              {pastGroupEvents &&
                pastGroupEvents.map((event) => {
                  return <EventsCard key={event.id} event={event} />;
                })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GroupDetails;
