import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadSingleGroup } from "../../store/groups";
import { Link, useHistory } from "react-router-dom";
import EventsCard from "../Events/EventsCard";
import DeleteGroupModal from "./DeleteGroupModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import "./Groups.css";

const GroupDetails = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [noFutureEvents, setNoFutureEvents] = useState(true);
  const [noPastEvents, setNoPastEvents] = useState(true);
  const today = new Date();
  const currGroup = useSelector((state) => state.groups.singleGroup?.[groupId]);
  const user = useSelector((state) => state.session.user);
  const group = { ...currGroup };
  const numEvents = group?.Events?.length;

  const sortEvents = (x, y) => {
    const a = new Date(x.startDate);
    const b = new Date(y.startDate);
    return a - b;
  };

  const groupEvents = group?.Events?.filter(
    (event) => event.groupId === group.id
  );

  const pastGroupEvents =
    groupEvents
      ?.filter((event) => {
        const start = new Date(event.startDate);
        return start < today;
      })
      .sort(sortEvents)


  const futureGroupEvents = groupEvents
    ?.filter((event) => {
      const start = new Date(event.startDate);
      return start > today;
    })
    .sort(sortEvents);

  useEffect(() => {
    if (user && user.id === group.organizerId) {
      setIsOrganizer(true);
    }
  }, [user, group]);

  useEffect(() => {
    dispatch(loadSingleGroup(groupId))
      .then(() => setIsLoaded(true))
      .catch(() => {
        history.push("/pagenotfound");
      });

      if (group) {
        if (futureGroupEvents?.length > 0) {
          setNoFutureEvents(false);
        }
        if (pastGroupEvents?.length > 0) {
          setNoPastEvents(false);
        }
      }
  }, [dispatch, isLoaded]);


  return (
    <>
      {isLoaded && (
        <>
          <div key="topContainer" className="detail page container">
            <div
              key="upper groups link container"
              className="upper groups link container"
            >
              <i className="fa-solid fa-chevron-left fa-xs"></i>
              <i className="fa-solid fa-chevron-left fa-xs"></i>
              <Link className="upper toGroups" to="/groups">
                Groups
              </Link>
            </div>
            <div
              key="upperSection container"
              className="upperSection container"
            >
              <div className="upper img container">
                <img
                  className="upper img"
                  src={group?.GroupImages[0]?.url}
                  alt="hike img"
                ></img>
              </div>
              <div className="upper details text container">
                <div className="upper textbox">
                  <h1 className="upper groups title">{group?.name}</h1>
                  <p className="upper location grayout">
                    {group?.city}, {group?.state}
                  </p>
                  <div className="upper additionalInfo">
                    <p className="upper numEvents grayout">
                      {numEvents && numEvents} Events
                    </p>
                    <p className="upper dot grayout">·</p>
                    <p className="upper private grayout">
                      {group?.private === false ? "Public" : "Private"}
                    </p>
                  </div>
                  <p className="upper organizer grayout">
                    Organized by {group?.Organizer?.firstName}{" "}
                    {group?.Organizer?.lastName}
                  </p>
                </div>
                {!isOrganizer && user && (
                  <button
                    className="upper join"
                    onClick={() => alert("Feature coming soon...")}
                  >
                    Join this group
                  </button>
                )}
                {isOrganizer && (
                  <div className="crud container">
                    <Link
                      to={`/groups/${group?.id}/events`}
                      className="upper crud create event"
                    >
                      <button className="upper crud create">
                        Create Event
                      </button>
                    </Link>
                    <Link
                      to={`/groups/${group?.id}/edit`}
                      className="upper crud update group"
                    >
                      <button className="upper crud update">Update</button>
                    </Link>

                    <button className="upper crud delete referencebutton">
                      <OpenModalMenuItem
                        className="modal-menu-item"
                        itemText="Delete"
                        modalComponent={<DeleteGroupModal group={group} />}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div key="bottomContainer" className="lowerSection container">
            <div className="lowerSection background">
              <div className="lower text container">
                <h1 className="lower title organizer">Organizer</h1>
                <p className="lower subtitle organizer grayout">
                  {group?.Organizer?.firstName} {group?.Organizer?.lastName}
                </p>
                <h1 className="lower title">What we're about</h1>
                <p className="lower subtitle about">{group?.about}</p>
                <>
                  <div className="future container">
                    {noFutureEvents && (
                      <h1 className="lower title noevents">
                        No Upcoming Events
                      </h1>
                    )}
                    {!noFutureEvents && (
                      <h1 className="lower title">
                        Upcoming Events ({futureGroupEvents?.length})
                      </h1>
                    )}
                    {!noFutureEvents &&
                      futureGroupEvents.map((event) => {
                        return (
                          <div
                            key={`${event.id}`}
                            className="lower card individual container"
                          >
                            <EventsCard
                              key={event?.id}
                              event={event}
                              city={group?.city}
                              state={group?.state}
                            />
                          </div>
                        );
                      })}
                  </div>
                  <div className="past container">
                    {!noPastEvents && (
                      <h1 className="lower title">
                        Past Events ({pastGroupEvents?.length})
                      </h1>
                    )}
                    {!noPastEvents &&
                      pastGroupEvents.map((event) => {
                        return (
                          <div
                            key={event.id}
                            className="lower card individual constainer"
                          >
                            <EventsCard
                              key={event.id}
                              event={event}
                              city={group?.city}
                              state={group?.state}
                            />
                          </div>
                        );
                      })}
                  </div>
                </>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GroupDetails;
