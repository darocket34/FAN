import { Link } from "react-router-dom";
import "../Listings/Listings.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadEvents } from "../../store/events";

const EventsCard = ({ event }) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => Object.values(state.events.allEvents));
  let newEvent = {};

  if (!event.Venue) {
    newEvent = {
      ...events.filter((currEvent) => event.venueId === currEvent.venueId)[0],
    };
  }

  useEffect(() => {
    dispatch(loadEvents());
  }, []);

  return (
    <div key={`${event.id}`}>
      <hr></hr>
      <Link className="listing link" to={`/events/${event.id}`}>
        <div className="listing card">
          <img
            className="listing img"
            src="https://i.imgur.com/ye8yURO.jpeg"
            alt="hike img"
          ></img>
          <div className="event card text">
            <p className="event card startDate">{event.startDate}</p>
            <p className="event card title">{event.name}</p>
            <p className="event card location">
              {event.Venue?.city || newEvent.Venue?.city},{" "}
              {event.Venue?.state || newEvent.Venue?.state}
            </p>
            {<p className="event card description">{event.description}</p>}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventsCard;
