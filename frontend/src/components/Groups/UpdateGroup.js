import { useParams } from "react-router-dom";
import GroupForm from "./GroupForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadSingleGroup } from "../../store/groups";

const UpdateGroup = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups.singleGroup[groupId]);

  useEffect(() => {
    dispatch(loadSingleGroup(groupId));
  }, [dispatch]);

  return <>{group && <GroupForm group={group} formType="update" />}</>;
};

export default UpdateGroup;
