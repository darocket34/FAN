import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { createNewEvent } from "../../store/events";
import { loadSingleGroup } from "../../store/groups";

const EventForm = ({ event }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const [newErrors, setNewErrors] = useState({});
  const [name, setName] = useState(event?.name || '');
  const [type, setType] = useState(event?.type || '');
  const [visibility, setVisibility] = useState(event?.visibility || '');
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState(event?.description || '');
  const [startDate, setStartDate] = useState(event?.startDate || '');
  const [endDate, setEndDate] = useState(event?.endDate || '');
  const [url, setUrl] = useState(event?.url || '');
  const [isGroupLoaded, setIsGroupLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);
  const group = useSelector((state) => state?.groups?.singleGroup[groupId]);

  useEffect(() => {
    dispatch(loadSingleGroup(groupId))
      .then(() => {
        setIsGroupLoaded(true);
      })
      .then(() => {
        if (group) {
          if (!sessionUser || sessionUser.id !== group.organizerId) {
            history.push("/unauthorized");
          }
        }
      });
  }, [dispatch, isGroupLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNewErrors({});

    // if (startDate) {
    //   const newStart = new Date(startDate).toString().split(" ");
    //   const newStartYear = newStart[3];
    //   const startMonth = newStart[1];
    //   const newStartDay = newStart[2];
    //   const newStartTime = newStart[4].slice(0, 5);

    //   const testStartDate = new Date(
    //     `${newStartYear} ${startMonth} ${newStartDay}`
    //   );
    //   const newStartMonth = testStartDate.getMonth() + 1;
    //   setStartDate(
    //     `${newStartYear}-${newStartMonth}-${newStartDay} ${newStartTime}`
    //   );
    // }

    // if (endDate) {
    //   const newEnd = new Date(endDate).toString().split(" ");
    //   const newEndYear = newEnd[3];
    //   const endMonth = newEnd[1];
    //   const newEndDay = newEnd[2];
    //   const newEndTime = newEnd[4].slice(0, 5);

    //   const testEndDate = new Date(`${newEndYear} ${endMonth} ${newEndDay}`);
    //   const newEndMonth = testEndDate.getMonth() + 1;

    //   setEndDate(`${newEndYear}-${newEndMonth}-${newEndDay} ${newEndTime}`);
    // }
    const newUTCStartDate = new Date(startDate);
    const newUTCEndDate = new Date(endDate);
    console.log(newUTCStartDate)
    const newEvent = {
      name,
      type,
      price: price || 0,
      description,
      startDate: newUTCStartDate,
      endDate: newUTCEndDate,
      url,
    };
    try {
      const response = await dispatch(createNewEvent(newEvent, groupId));
      if (response && !response.errors) {
        history.push(`/events/${response.id}`);
      }
      const { errors } = response;
      if (response && response.errors) {
        setNewErrors(errors);
      }
    } catch (err) {
      if (err) {
        const { errors } = err;
        setNewErrors(errors);
      }
    }
  };

  return (
    <>
      <div className="event form master container">
        <form className="create event" onSubmit={handleSubmit}>
          <h1 className="form title">
            Create an event for {group?.name && group?.name}
          </h1>
          <p className="form subtitle">What is the name of your event?</p>
          {newErrors?.name && <p className="newErrors">{newErrors?.name}</p>}
          <input
            className="form event name"
            name="name"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <hr></hr>
          <p className="form subtitle">Is this an in person or online event?</p>
          {newErrors?.type && <p className="newErrors">{newErrors?.type}</p>}
          <select
            className="form event type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Online">Online</option>
            <option value="In Person">In Person</option>
          </select>
          <p className="form subtitle">Is this event private or public?</p>
          {newErrors?.private && (
            <p className="newErrors">{newErrors?.private}</p>
          )}
          <select
            className="form event private"
            name="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="">Select</option>
            <option value="true">Private</option>
            <option value="false">Public</option>
          </select>
          <p className="form subtitle event price">
            What is the price for your event?
          </p>
          {newErrors?.price && <p className="newErrors">{newErrors?.price}</p>}
          <div className="form price container">
            <span className="form price dollarsign">$</span>
            <input
              type="text"
              className="form event price input"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <hr></hr>
          <p className="form subtitle">When does your event start?</p>
          {newErrors?.startDate && (
            <p className="newErrors">{newErrors?.startDate}</p>
          )}
          <input
            className="form startdate"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <p className="form subtitle">When does your event end?</p>
          {newErrors?.endDate && (
            <p className="newErrors">{newErrors?.endDate}</p>
          )}
          <input
            className="form enddate"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <hr></hr>
          <p className="form subtitle">
            Please add an image url for your event below:
          </p>
          {newErrors?.url && <p className="newErrors">{newErrors?.url}</p>}
          <input
            type="text"
            className="form event img url"
            placeholder="Image Url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <hr></hr>
          <p className="form subtitle">Please describe your event</p>
          {newErrors?.description && (
            <p className="newErrors">{newErrors?.description}</p>
          )}
          <textarea
            className="form event description"
            name="description"
            rows="9"
            cols="50"
            placeholder="Please include at least 30 characters."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="form event create submit" type="submit">
            Create event
          </button>
        </form>
      </div>
    </>
  );
};

export default EventForm;
