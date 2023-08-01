import "./Listings.css";
import { useDispatch, useSelector } from "react-redux";
import { loadGroups } from "../../store/groups";
import { useEffect } from "react";

const GroupsList = () => {
  const groups = useSelector((state) => Object.values(state.groups));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadGroups());
  }, [dispatch]);

  return (
    <>
      <div className="listings">
        {groups.map((group) => {
          return (
            <div key={`${group.id}`}>
              <hr></hr>
              <div className="listing card">
                <div className="listing img">
                  <img
                    className="listing img"
                    src="https://i.imgur.com/ye8yURO.jpeg"
                    alt="hike img"
                  ></img>
                </div>
                <div className="card text">
                  <div className="card title">
                    <p className="card title">{group.name}</p>
                  </div>
                  <div className="card location">
                    <p className="card location">
                      {group.city}, {group.state}
                    </p>
                  </div>
                  <div className="card about">
                    <p className="card about">{group.about}</p>
                  </div>
                  <div className="card additionalInfo">
                    <div className="card numEvents">
                      <p className="card numEvents">### Events</p>
                    </div>
                    <p className="card dot">·</p>
                    <div className="card private">
                      <p className="card private">
                        {group.private === false ? "Public" : "Private"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GroupsList;
