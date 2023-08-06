import "../Listings/Listings.css";
import { useDispatch, useSelector } from "react-redux";
import { loadEvents } from "../../store/events";
import { useEffect, Fragment } from "react";
import EventsCard from "./EventsCard";
import { useState } from "react";

const EventsList = () => {
  const [eventsListSorted, setEventsListSorted] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const events = useSelector((state) => state.events.allEvents);
  const dispatch = useDispatch();
  const sortEvents = (x, y) => {
    const a = new Date(x.startDate);
    const b = new Date(y.startDate);
    return a - b;
  };
  useEffect(() => {
    dispatch(loadEvents()).then(() => setIsLoaded(true));

    setEventsListSorted(events);
  }, [dispatch, isLoaded]);

  useEffect(() => {
    setEventsListSorted(Object.values(events).sort(sortEvents));
  }, [isLoaded]);

  return (
    <div className="listings">
      {Object.values(eventsListSorted).map((event) => {
        return (
          <Fragment key={event.id}>
            <hr key={event.id * 400} />
            <EventsCard event={event} />
          </Fragment>
        );
      })}
    </div>
  );
};

export default EventsList;
