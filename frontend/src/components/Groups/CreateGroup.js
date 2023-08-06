import { useSelector } from "react-redux";
import GroupForm from "./GroupForm";
import { useHistory } from "react-router-dom";

const CreateGroup = () => {
  const user = useSelector(state => state.session.user)
  const history = useHistory()
  if(!user)history.push('/')
  return (
    <>
      {user && <GroupForm type='new'/>}
    </>
  );
};

export default CreateGroup;
