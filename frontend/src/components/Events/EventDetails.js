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
  const [eventPrice, setEventPrice] = useState("");
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
    if (event.startDate) {
      const startDateUTC = new Date(event.startDate);
      const rawstartDate = startDateUTC.toLocaleDateString("en-US").split("/");
      const rawStartTime = startDateUTC.toLocaleTimeString("en-US");
      let startHoursMin = rawStartTime.split(" ")[0].slice(0, 5);
      if (startHoursMin[4] === ":") startHoursMin = startHoursMin.slice(0, 4);
      const startAmPm = rawStartTime.split(" ")[1];
      const startTime = `${startHoursMin} ${startAmPm}`;
      setStartTime(startTime);
      const endDateUTC = new Date(event.endDate);
      const rawendDate = endDateUTC.toLocaleDateString("en-US").split("/");
      const rawEndTime = endDateUTC.toLocaleTimeString("en-US");
      let endHoursMin = rawEndTime.split(" ")[0].slice(0, 5);
      if (endHoursMin[4] === ":") endHoursMin = endHoursMin.slice(0, 4);
      const endAmPm = rawEndTime.split(" ")[1];
      const endTime = `${endHoursMin} ${endAmPm}`;
      setEndTime(endTime);
      let startmonth = rawstartDate[0];
      const startyear = rawstartDate[2];
      let startday = rawstartDate[1];
      if (startmonth.length === 1) startmonth = `0${startmonth}`;
      if (startday.length === 1) startday = `0${startday}`;
      const fullstartdate = `${startyear}-${startmonth}-${startday}`;
      setStartDate(fullstartdate);
      let endmonth = rawendDate[0];
      const endyear = rawendDate[2];
      let endday = rawendDate[1];
      if (endmonth.length === 1) endmonth = `0${endmonth}`;
      if (endday.length === 1) endday = `0${endday}`;
      const fullenddate = `${endyear}-${endmonth}-${endday}`;
      setEndDate(fullenddate);
    }
    if (event?.EventImages?.length > 0) {
      setEventImgUrl(event?.EventImages[0].url);
      setGroupImgUrl(event?.Group?.GroupImages[0].url);
    }

    if (event?.price === 0) {
      setEventPrice(" FREE");
    } else {
      setEventPrice(event?.price);
    }

    if (
      user &&
      event?.Group?.organizerId &&
      user?.id === event?.Group?.organizerId
    ) {
      setIsOrganizer(true);
    }
  }, [event]);

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
                            <p className="lower groupname event card">
                              {event?.Group?.name}
                            </p>
                          </div>
                          <p className="lower group event card private grayout">
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
                              <p className="lower event text additionalInfo dates label start grayout">
                                START
                              </p>
                              <p className="lower event text additionalInfo dates startdateactual">
                                {`${startDate}  ·  ${startTime}`}
                              </p>
                            </div>
                            <div className="lower event text additionalInfo dates dates end">
                              <p className="lower event text additionalInfo dates dates label end grayout">
                                END
                              </p>
                              <p className="lower event text additionalInfo dates enddateactual">
                                {`${endDate}  ·  ${endTime}`}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="lower event details cost container">
                          <i className="fa-solid fa-sack-dollar fa-2x events details" />
                          <p className="lower event text details cost grayout">
                            {`$ ${eventPrice}`}
                          </p>
                        </div>
                        <div className="lower event details location container">
                          <i className="fa-solid fa-map-pin fa-2x events details" />
                          <p className="lower event text details location grayout">
                            {event?.type}
                          </p>
                        </div>
                        {isOrganizer && (
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
                            <button
                              className="upper crud update reference-button"
                              onClick={() => alert("Feature coming soon...")}
                            >
                              Update
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
