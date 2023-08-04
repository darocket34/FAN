import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadSingleGroup, deleteGroup } from "../../store/groups";
import { Link, useHistory } from "react-router-dom";
import EventsCard from "../Events/EventsCard";
import DeleteGroupModal from "./DeleteGroupModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import "./Groups.css";

const GroupDetails = () => {
  const { groupId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const today = new Date();
  const currGroup = useSelector((state) => state.groups.singleGroup?.[groupId]);
  const user = useSelector((state) => state.session.user);
  const group = { ...currGroup };
  const numEvents = group.Events?.length;

  const groupEvents = group.Events?.filter(
    (event) => event.groupId === group.id
  );

  const pastGroupEvents = groupEvents?.filter((event) => {
    const start = new Date(event.startDate);
    return start < today;
  });

  const futureGroupEvents = group.Events?.filter((event) => {
    const start = new Date(event.startDate);
    return start > today;
  });

  useEffect(() => {
    dispatch(loadSingleGroup(groupId)).then(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (user && user.id === group.organizerId) {
      setIsOrganizer(true);
    }
  }, [isOrganizer, user, group]);

  return (
    <>
      {isLoaded && (
        <>
          <div className="detail page container">
            <div className="upper link container">
              <i className="fa-solid fa-chevron-left fa-xs"></i>
              <i className="fa-solid fa-chevron-left fa-xs"></i>
              <Link className="upper toGroups" to="/groups">
                Groups
              </Link>
            </div>
            <div className="upperSection container">
              <div className="upper img container">
                <img
                  className="upper img"
                  src={group?.GroupImages[0]?.url}
                  alt="hike img"
                ></img>
              </div>
              <div className="upper text container">
                <h1 className="upper title">{group?.name}</h1>
                <p className="upper location">
                  {group?.city}, {group?.state}
                </p>
                <div className="upper additionalInfo">
                  <p className="upper numEvents">
                    {numEvents && numEvents} Events
                  </p>
                  <p className="upper dot">·</p>
                  <p className="upper private">
                    {group?.private === false ? "Public" : "Private"}
                  </p>
                </div>
                <p className="upper organizer">
                  {group?.Organizer?.firstName} {group?.Organizer?.lastName}
                </p>
                {!isOrganizer && (
                  <button className="upper join">Join this group</button>
                )}
                {isOrganizer && (
                  <div className="crud container">
                    <Link to={`/groups/${group?.id}/events`} className="upper crud create event">
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

                    <button className="upper crud delete reference-button">
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
          <div className="lowerSection container">
            <div className="lowerSection background">
            <div className="lower text container">
              <h1 className="lower title">Organizer</h1>
              <p className="lower organizer">
                {group?.Organizer?.firstName} {group?.Organizer?.lastName}
              </p>
              <h1 className="lower title">What we're about</h1>
              <p className="lower about">{group?.about}</p>
              <div className="future container">
                {futureGroupEvents.length > 0 && (
                  <h1 className="lower title">
                    Upcoming Events ({futureGroupEvents?.length})
                  </h1>
                )}
                {futureGroupEvents.length > 0 &&
                  futureGroupEvents.map((event) => {
                    return (
                      <div className="lower card">
                        <EventsCard key={event.id} event={event} />
                      </div>
                    );
                  })}
              </div>
              <div className="past container">
                {pastGroupEvents.length > 0 && (
                  <h1 className="lower title">
                    Past Events ({pastGroupEvents?.length})
                  </h1>
                )}
                {pastGroupEvents.length > 0 &&
                  pastGroupEvents.map((event) => {
                    return (
                      <div className="lower card">
                        <EventsCard key={event.id} event={event} />
                      </div>
                    );
                  })}
              </div></div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GroupDetails;
