import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteEvent } from "../../store/events";
import { useModal } from "../../context/Modal";
import { loadSingleGroup } from "../../store/groups";
import { useEffect } from "react";
import "../Groups/Groups.css";

const DeleteEventModal = ({ event }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    dispatch(deleteEvent(event.id)).then(closeModal);
    history.push("/events");
  };

  useEffect(() => {
    dispatch(loadSingleGroup(event.groupId));
  }, []);

  return (
    <>
      <div className="delete modal container">
        <h1 className="delete modal title">{`Are you sure you want to delete ${event.name}?`}</h1>
        <div className="delete modal button container">
          <button className="delete modal yes" onClick={handleDelete}>
            Yes (Delete Event)
          </button>
          <button className="delete modal no" onClick={closeModal}>
            No (Keep Event)
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteEventModal;
