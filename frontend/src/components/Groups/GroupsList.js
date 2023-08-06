import "../Listings/Listings.css";
import { useDispatch, useSelector } from "react-redux";
import { loadGroups } from "../../store/groups";
import { useEffect } from "react";
import GroupsCard from "./GroupsCard";

const GroupsList = () => {
  const dispatch = useDispatch();
  const groupsObj = useSelector((state) => state.groups.allGroups);
  const groups = Object.values(groupsObj);

  useEffect(() => {
    dispatch(loadGroups());
  }, [dispatch]);

  return (
    <div className="listings">
      {Object.values(groups).map((group) => {
        return <GroupsCard key={group.id} group={group} />;
      })}
    </div>
  );
};

export default GroupsList;
