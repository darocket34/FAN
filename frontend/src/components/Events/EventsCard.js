import { Link } from "react-router-dom";
import "../Listings/Listings.css";
import { useEffect, useState } from "react";

const EventsCard = ({ event, city, state }) => {
  const [imgUrl, setImgUrl] = useState(event?.previewImage);
  const [cityLocation, setCityLocation] = useState(event?.Group?.city);
  const [stateLocation, setStateLocation] = useState(event?.Group?.state);

  useEffect(() => {
    console.log(event);
    if (event.EventImages && event.EventImages[0]) {
      setImgUrl(event?.EventImages[0].url);
    }
    if (city) {
      setCityLocation(city);
    }
    if (state) {
      setStateLocation(state);
    }
  });
  return (
    <div key={`${event?.id}`}>
      <hr></hr>
      <Link className="listing link" to={`/events/${event?.id}`}>
        <div className="listing card">
          <div className="listing img container">
          {imgUrl && (
            <img className="listing img" src={imgUrl} alt="hike img" />
          )}</div>
          <div className="event card text container">
            <p className="event card startDate">{event?.startDate}</p>
            <p className="event card title">{event?.name}</p>
            <p className="event card location grayout">
              {cityLocation}, {stateLocation}
            </p>
          </div>
        </div>
          <div className="event card description container">
            {<p className="event card description">{event?.description}</p>}
          </div>
      </Link>
    </div>
  );
};

export default EventsCard;
