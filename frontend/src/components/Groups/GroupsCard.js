import { useState } from "react";
import "../Listings/Listings.css";
import { Link } from "react-router-dom";

const GroupsCard = ({ group }) => {
  // const [eventsLabel, setEventsLabel] = useState("Events");
  let eventsLabel = 'Events'
  let numEvents = group.Events?.length;
  if (numEvents === 1) eventsLabel = "Event";

  return (
    <>
      {group && (
        <>
          <hr></hr>
          <div
            key={`${group && group.id}`}
            className="listing master groupslist container"
          >
            <Link
              className="listing groupslist link"
              to={`/groups/${group && group.id}`}
            >
              <div className="listing groupslist card">
                <div className="listing img groupslist  container">
                  <img
                    className="listing groupslist img"
                    src={group.previewImage}
                    alt="group preview img"
                  />
                </div>
                <div className="groups card groupslist text container">
                  <p className="card groupslist title">{group && group.name}</p>
                  <p className="card groupslist location grayout">
                    {group && group.city}, {group && group.state}
                  </p>
                  <p className="card groupslist about">
                    {group && group.about}
                  </p>
                  <div className="card additionalInfo container">
                    <p className="card numEvents grayout">
                      {group && numEvents} {group && eventsLabel}
                    </p>
                    <p className="card groupslist dot grayout">·</p>
                    <p className="card groupslist private grayout">
                      {group && group.private === false ? "Public" : "Private"}
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
