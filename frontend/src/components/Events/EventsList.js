import "../Listings/Listings.css";
import { useDispatch, useSelector } from "react-redux";
import { loadEvents } from "../../store/events";
import { useEffect, Fragment } from "react";
import EventsCard from "./EventsCard";

const EventsList = () => {
  const events = useSelector((state) => state.events.allEvents);
  const dispatch = useDispatch();
  const sortEvents = (x, y) => {
    const a = new Date(x.startDate);
    const b = new Date(y.startDate);
    return a - b;
  };
  const eventsListSorted = Object.values(events).sort(sortEvents);
  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  return (
    <div className="listings">
      {Object.values(eventsListSorted).map((event) => {
        return (
          <Fragment key={event.id}>
            <hr />
            <EventsCard key={event.id} event={event} />
          </Fragment>
        );
      })}
    </div>
  );
};

export default EventsList;
