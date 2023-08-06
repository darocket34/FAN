import { Link } from "react-router-dom";
import "../Listings/Listings.css";
import { useEffect, useState } from "react";

const EventsCard = ({ event, city, state }) => {
  const [imgUrl, setImgUrl] = useState(event?.previewImage);
  const [cityLocation, setCityLocation] = useState(event?.Group?.city);
  const [stateLocation, setStateLocation] = useState(event?.Group?.state);
  const [displayDate, setDisplayDate] = useState(
    event?.startDate?.toString().slice(0, 11)
  );
  const [localTime, setLocalTime] = useState("");
  // const [dateUTC, setDateUTC] = useState('')

  useEffect(() => {
    if (event.EventImages && event.EventImages[0]) {
      setImgUrl(event?.EventImages[0].url);
    }
    if (city) {
      setCityLocation(city);
    }
    if (state) {
      setStateLocation(state);
    }
    if (event.startDate) {
      const dateUTC = new Date(event.startDate);
      const time = dateUTC.toLocaleTimeString("en-US")
      setLocalTime(time);
    }
  });

  return (
    <div key={`${event?.id}`}>
      <Link className="listing event link" to={`/events/${event?.id}`}>
        <div className="listing event card">
          <div className="listing event img container">
            {imgUrl && (
              <img className="listing event img" src={imgUrl} alt="hike img" />
            )}
          </div>
          <div className="event card text container">
            <div className="event card time container">
              <p className="event card startDate">
                {displayDate && displayDate}
              </p>
              <p className="event card startDate"> · </p>
              <p className="event card startDate">{localTime && localTime}</p>
            </div>
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
