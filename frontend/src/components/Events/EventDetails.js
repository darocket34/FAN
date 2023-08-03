import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadSingleEvent } from "../../store/events";
import { Link } from "react-router-dom";
import "./Events.css";
import { loadGroups } from "../../store/groups";

const EventDetails = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const [isLoadedEvents, setIsLoadedEvents] = useState(false);
  const [isLoadedGroups, setIsLoadedGroups] = useState(false);
  const event = useSelector((state) => state.events.singleEvent);
  const groups = useSelector((state) => Object.values(state.groups.allGroups));
  const currGroup = groups.filter((group) => group.id === event.groupId);
  const group = currGroup[0];

  console.log(typeof event.endDate)


  useEffect(() => {
    dispatch(loadSingleEvent(eventId))
      .then(() => setIsLoadedEvents(true))
      .then(() => dispatch(loadGroups()))
      .then(() => setIsLoadedGroups(true));
  }, [dispatch, isLoadedEvents, isLoadedGroups, eventId]);

  return (
    <>
      {isLoadedEvents && isLoadedGroups && (
        <div>
          <div className="detail page container">
            <div className="upper link container">
              <i className="fa-solid fa-chevron-left fa-xs"></i>
              <i className="fa-solid fa-chevron-left fa-xs"></i>
              <Link className="upper toEvents" to="/events">
                Events
              </Link>
              <h1 className="upper event title">{event.name}</h1>
              <p className="upper organizer">
                Hosted By {group.User.firstName} {group.User.lastName}
              </p>
            </div>
            <div className="upperSection event container">
              <div className="lowerSection event background"></div>
              <div className="lowerSection event allcard container">
                <div className="upper event img container">
                  <img
                    className="upper event img"
                    src="https://i.imgur.com/ye8yURO.jpeg"
                    alt="event main"
                  ></img>
                </div>
                <div className="upper event card container">
                  <div className="lower event group card container">
                    <div className="lower event group card layout">
                      <img
                        className="lower group card"
                        alt="group preview"
                        src={group.previewImage}
                      />
                      <div className="lower group card info">
                        <div className="lower group card title">
                          {group.name}
                        </div>
                        <p className="lower group card private">
                          {group.private === false ? "Public" : "Private"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="lower event additionalInfo card container">
                    <div className="lower event icon container">
                      <i class="fa-regular fa-clock fa-2x" />
                      <i class="fa-solid fa-sack-dollar fa-2x" />
                      <i class="fa-solid fa-map-pin fa-2x" />
                    </div>
                    <div className="lower event details maincontainer">
                      <div className="lower event details dates container">
                        <div className="lower datebox">
                          <div className="lower event text additionalInfo dates start">
                            <p className="lower event text additionalInfo dates start">
                              Start
                            </p>
                            <p className="lower event text additionalInfo dates startdateactual start">{event.startDate.split('T')[0]}</p>
                            <p className="card dot">·</p>
                            <p className="lower event text additionalInfo dates starttimeactual start">{event.startDate.split('T')[1].slice(0,5)}</p>
                          </div>
                          <div className="lower event text additionalInfo dates dates end">
                            <p className="lower event text additionalInfo dates dates end">
                              End
                            </p>
                            <p className="lower event text additionalInfo dates enddateactual end">{event.endDate.split('T')[0]}</p>
                            <p className="card dot">·</p>
                            <p className="lower event text additionalInfo dates endtimeactual end">{event.endDate.split('T')[1].slice(0,5)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="lower event details cost container">
                        <p className="lower event text details cost">
                          ${event.price}
                        </p>
                      </div>
                      <div className="lower event details location container">
                        <p className="lower event text details location">
                          {event.type}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="lower event subtitle details">Details</h1>
          <p className="lower event description">{event.description}</p>
          <div className="lower event text container"></div>
        </div>
      )}
    </>
  );
};

export default EventDetails;
