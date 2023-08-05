import "../Listings/Listings.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadEvents } from "../../store/events";
import { Link } from "react-router-dom";
import { loadSingleGroup } from "../../store/groups";

const GroupsCard = ({ group }) => {
  const dispatch = useDispatch();
  let numEvents = group.Events?.length;
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(loadEvents())
      .then(() => setIsLoaded(true))
      .then(() => loadSingleGroup(group.id));
  }, [dispatch, isLoaded]);

  return (
    <>
      {isLoaded && (
        <>
        <hr></hr>
        <div
          key={`${isLoaded && group.id}`}
          className="listing master container"
        >
          <Link className="listing link" to={`/groups/${isLoaded && group.id}`}>
            <div className="listing card">
              <div className="listing img container">
                <img
                  className="listing img"
                  src={group.previewImage}
                  alt="hike img"
                />
              </div>
              <div className="groups card text container">
                <p className="card title">{isLoaded && group.name}</p>
                <p className="card location grayout">
                  {isLoaded && group.city}, {isLoaded && group.state}
                </p>
                <p className="card about">{isLoaded && group.about}</p>
                <div className="card additionalInfo container">
                  <p className="card numEvents grayout">
                    {isLoaded && numEvents} Events
                  </p>
                  <p className="card dot grayout">·</p>
                  <p className="card private grayout">
                    {isLoaded && group.private === false ? "Public" : "Private"}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
        </>
      )}
    </>
  );
};

export default GroupsCard;
