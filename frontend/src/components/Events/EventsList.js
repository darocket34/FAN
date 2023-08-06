import "../Listings/Listings.css";
import { useDispatch, useSelector } from "react-redux";
import { loadEvents } from "../../store/events";
import { useEffect } from "react";
import EventsCard from "./EventsCard";

const EventsList = () => {
  const events = useSelector((state) => state.events.allEvents);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  return (
    <div className="listings">
      {Object.values(events).map((event) => {
        return <><hr /><EventsCard key={event.id} event={event} /></>
      })}
    </div>
  );
};

export default EventsList;
