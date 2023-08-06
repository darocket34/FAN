import "../Listings/Listings.css";
import { useDispatch, useSelector, useStore } from "react-redux";
import { loadGroups } from "../../store/groups";
import { useEffect, useState } from "react";
import GroupsCard from "./GroupsCard";

const GroupsList = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false)
  const groupsObj = useSelector((state) => state.groups.allGroups);
  const groups = Object.values(groupsObj);

  useEffect(() => {
    dispatch(loadGroups());
    setIsLoaded(true)
  }, [dispatch, isLoaded]);

  return (
    <div className="listings">
      {Object.values(groups).map((group) => {
        return <GroupsCard key={group.id} group={group} />;
      })}
    </div>
  );
};

export default GroupsList;
