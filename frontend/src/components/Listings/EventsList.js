import "./Listings.css";
import { useDispatch, useSelector } from "react-redux";
import { loadEvents } from "../../store/events";
import { useEffect } from "react";

const EventsList = () => {
  const events = useSelector((state) => Object.values(state.events));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  return (
    <>
      <div className="listings">
        {events.map((event) => {
          return (
            <div key={`${event.id}`}>
              <hr></hr>
              <div className="listing card">
                <div className="listing img">
                  <img
                    className="listing img"
                    src="https://i.imgur.com/ye8yURO.jpeg"
                    alt="hike img"
                  ></img>
                </div>
                <div className="event card text">
                  <div className="event card startDate">
                      <p className="event card startDate">{event.startDate}</p>
                  </div>
                  <div className="event card title">
                    <p className="event card title">{event.name}</p>
                  </div>
                  <div className="event card location">
                    <p className="event card location">
                      {event.Venue.city}, {event.Venue.state}
                    </p>
                  </div>
                  <div className="event card description">
                    <p className="event card description">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default EventsList;
