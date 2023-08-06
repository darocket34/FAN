import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteGroup } from "../../store/groups";
import { useModal } from "../../context/Modal";
import "./Groups.css";

const DeleteGroupModal = ({ group }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    dispatch(deleteGroup(group.id)).then(closeModal);
    history.push("/groups");
  };

  return (
    <>
      <div className="delete modal container">
        <h1 className="delete modal title"> Confirm Delete</h1>
        <h2 className="delete modal title">Are you sure you want to remove this group?</h2>
        <div className="delete modal button container">
          <button className="delete modal yes" onClick={handleDelete}>
            Yes (Delete Group)
          </button>
          <button className="delete modal no" onClick={closeModal}>
            No (Keep Group)
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteGroupModal;
