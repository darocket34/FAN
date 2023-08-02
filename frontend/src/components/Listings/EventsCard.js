import "./Listings.css";
import { useDispatch, useSelector } from "react-redux";
import { loadSingleEvent } from "../../store/events";
import { useEffect } from "react";

const EventsCard = ({ event }) => {
  const dispatch = useDispatch();
  const singleEvent = useSelector((state) => state.events.singleEvent);
  
  useEffect(() => {
    dispatch(loadSingleEvent(event.id));
  }, [dispatch, event.id, event]);

  return (
    <div className="listings">
      <div key={`${event.id}`}>
        <hr></hr>
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
              {event.Venue.city}, {event.Venue.state}
            </p>
            {singleEvent && singleEvent.id === event.id && (
              <p className="event card description">
                {singleEvent.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsCard;
