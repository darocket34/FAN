import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadSingleEvent } from "../../store/events";
import { Link } from "react-router-dom";
import { loadGroups } from "../../store/groups";
import DeleteEventModal from "./DeleteEventModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import "./Events.css";

const EventDetails = () => {
  const { eventId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoadedEvents, setIsLoadedEvents] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const event = useSelector((state) => state?.events?.singleEvent);
  const [eventImgUrl, setEventImgUrl] = useState("");
  const [groupImgUrl, setGroupImgUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventPrice, setEventPrice] = useState('')
  const user = useSelector((state) => state.session.user);
  const [displayDate, setDisplayDate] = useState(
    event?.startDate?.toString().slice(0, 11)
  );

  useEffect(() => {
    dispatch(loadSingleEvent(eventId))
      .then(() => setIsLoadedEvents(true))
      .catch(() => {
        history.push("/pagenotfound");
      });
  }, [dispatch, eventId, isLoadedEvents]);

  useEffect(() => {
    console.log(event.startDate);
    if (event.startDate) {
      const startDateUTC = new Date(event.startDate);
      const startTime = startDateUTC.toLocaleTimeString("en-US");
      setStartTime(startTime);
      const endDateUTC = new Date(event.endDate);
      const endTime = endDateUTC.toLocaleTimeString("en-US");
      setEndTime(endTime);
    }
    if (event?.EventImages?.length > 0) {
      setEventImgUrl(event?.EventImages[0].url);
      setGroupImgUrl(event?.Group?.GroupImages[0].url);
      setStartDate(event?.startDate.split(" ")[0]);
      setEndDate(event?.endDate?.split(" ")[0]);
    }

    if (event?.price === 0){
      setEventPrice(' Free')
    }
  }, [event]);
  // if (user && event?.Group?.organizerId && user?.id === event?.Group?.organizerId) {
  //   setIsOrganizer(true);
  // }

  return (
    <>
      {event && (
        <div>
          <div className="detail page container">
            <div className="upper link container">
              <i className="fa-solid fa-chevron-left fa-xs"></i>
              <i className="fa-solid fa-chevron-left fa-xs"></i>
              <Link className="upper toEvents" to="/events">
                Events
              </Link>
              <h1 className="upper event title">{event?.name}</h1>
              <p className="upper organizer grayout">
                Hosted By {event?.Group?.User?.firstName}{" "}
                {event?.Group?.User?.lastName}
              </p>
            </div>
            <div className="upperSection event container">
              <div className="lowerSection event background">
                <div className="lowerSection event allcard container">
                  <div className="upper event img container">
                    <img
                      className="upper event img"
                      src={eventImgUrl}
                      alt="event main"
                    ></img>
                  </div>
                  <div className="upper event card container">
                    <div className="lower event group card container">
                      <div className="lower event group card layout">
                        <img
                          className="lower group card"
                          alt="group preview image"
                          src={groupImgUrl}
                        />
                        <div className="lower group event card info">
                          <div className="lower group event card text">
                            <p className="lower group event card title">
                              {event?.Group?.name}
                            </p>
                          </div>
                          <p className="lower group event card private">
                            {event?.Group?.private === false
                              ? "Public"
                              : "Private"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="lower event additionalInfo card container">
                      <div className="lower event details maincontainer">
                        <div className="lower event details dates container">
                          <i className="fa-regular fa-clock fa-2x events details" />
                          <div className="lower datebox">
                            <div className="lower event text additionalInfo dates start">
                              <p className="lower event text additionalInfo dates start">
                                Start
                              </p>
                              <p className="lower event text additionalInfo dates startdateactual start">
                                {`${startDate}  ·  ${startTime}`}
                              </p>
                            </div>
                            <div className="lower event text additionalInfo dates dates end">
                              <p className="lower event text additionalInfo dates dates end">
                                End
                              </p>
                              <p className="lower event text additionalInfo dates enddateactual end">
                                {`${endDate}  ·  ${endTime}`}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="lower event details cost container">
                          <i className="fa-solid fa-sack-dollar fa-2x events details" />
                          <p className="lower event text details cost">
                            {`$ ${eventPrice}`}
                          </p>
                        </div>
                        <div className="lower event details location container">
                          <i className="fa-solid fa-map-pin fa-2x events details" />
                          <p className="lower event text details location">
                            {event?.type}
                          </p>
                        </div>
                        {event?.Group?.organizerId && (
                          <div className="crud container">
                            {/* <button className="upper crud create" disabled={true}>
                            Create Event
                          </button>

                          <button className="upper crud update">Update</button> */}

                            <button className="upper crud delete reference-button">
                              <OpenModalMenuItem
                                className="modal-menu-item"
                                itemText="Delete"
                                modalComponent={
                                  <DeleteEventModal eventId={eventId} />
                                }
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lower event text container">
                  <h1 className="lower event subtitle details">Details</h1>
                  <p className="lower event description">
                    {event?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetails;
