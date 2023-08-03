import "../Listings/Listings.css";
import { useDispatch, useSelector } from "react-redux";
import { loadGroups } from "../../store/groups";
import { useEffect } from "react";
import GroupsCard from "./GroupsCard";

const GroupsList = () => {
  const groups = useSelector((state) => Object.values(state.groups.allGroups));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadGroups());
  }, [dispatch]);

  return (
    <div className="listings">
      {Object.values(groups).map((group) => {
        console.log(group)
        return <GroupsCard key={group.id} group={group} />;
      })}
    </div>
  );
};

export default GroupsList;
