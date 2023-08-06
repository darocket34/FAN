import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteEvent } from "../../store/events";
import { useModal } from "../../context/Modal";
import { loadSingleGroup } from "../../store/groups";
import { useEffect } from "react";
import "../Groups/Groups.css";

const DeleteEventModal = ({ eventId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);

  const handleDelete = async (e) => {
    e.preventDefault();
    dispatch(deleteEvent(eventId)).then(closeModal);
    history.push("/events");
  };

  if (!sessionUser) {
    closeModal();
    history.push("/");
  }

  return (
    <>
      <div className="delete modal container">
        <h1 className="delete modal title"> Confirm Delete</h1>
        <h2 className="delete modal title">
          Are you sure you want to remove this event?
        </h2>
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
