import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { createNewEvent, deleteEvent } from "../../store/events";

const EventForm = ({ event }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const [newErrors, setNewErrors] = useState({});
  const [newImgErrors, setNewImgErrors] = useState({});
  //   const [venueId, setVenueId] = useState(event?.venueId);
  const [name, setName] = useState(event?.name);
  const [type, setType] = useState(event?.type);
  //   const [capacity, setCapacity] = useState(event?.capacity);
  const [visibility, setVisibility] = useState(event?.visibility);
  const [price, setPrice] = useState(event?.price);
  const [description, setDescription] = useState(event?.description);
  const [startDate, setStartDate] = useState(event?.startDate);
  const [endDate, setEndDate] = useState(event?.endDate);
  const [url, setUrl] = useState(event?.url);
  const sessionUser = useSelector((state) => state.session.user);
  //   const [newStartDate, setNewStartDate] = useState('')
  //   const [newEndDate, setNewEndDate] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNewErrors({});

    const newStart = new Date(startDate).toString().split(" ");
    const newStartYear = newStart[3];
    const startMonth = newStart[1];
    const newStartDay = newStart[2];
    const newStartTime = newStart[4];

    const testStartDate = new Date(
      `${newStartYear} ${startMonth} ${newStartDay}`
    );
    const newStartMonth = testStartDate.getMonth() + 1;

    const newEnd = new Date(endDate).toString().split(" ");
    const newEndYear = newEnd[3];
    const endMonth = newEnd[1];
    const newEndDay = newEnd[2];
    const newEndTime = newEnd[4];

    const testEndDate = new Date(`${newEndYear} ${endMonth} ${newEndDay}`);
    const newEndMonth = testEndDate.getMonth() + 1;

    setStartDate(`${newStartYear}-${newStartMonth}-${newStartDay}`);
    setEndDate(`${newEndYear}-${newEndMonth}-${newEndDay}`);

    const newEvent = {
      name,
      type,
      price,
      description,
      startDate,
      endDate,
      url,
    };

    // if (url) {
    //   const imgUrlArr = url.split(".");
    //   const imgUrlEnding = imgUrlArr[imgUrlArr.length - 1];
    //   if (
    //     imgUrlEnding !== "jpg" &&
    //     imgUrlEnding !== "jpeg" &&
    //     imgUrlEnding !== "png"
    //   ) {
    //     setNewImgErrors({
    //       url: "Image Url must be a .jpg, .jpeg, or .png",
    //     });
    //   }
    // } else {
    //   setNewImgErrors({ url: "Image Url is required" });
    // }

    try {
      const response = await dispatch(createNewEvent(newEvent, groupId));
      if (response && !response.errors) {
        history.push(`/events/${response.id}`);
      }
      console.log("RES LEFT SIDE NO ERRORS", response);
      const { errors } = response;
      console.log("RES LEFT SIDE ERRORS", errors);
      if (response && response.errors) {
        setNewErrors(errors);
      }
    } catch (err) {
      if (err) {
        console.log("ERR LEFT SIDE", err);
        const { errors } = err;
        console.log("ERRORS LEFT SIDE", errors);
        setNewErrors(errors);
        console.log("newERRORS LEFT SIDE", errors);
      }
    }
  };

  return (
    <>
      <div>
        <form className="create event" onSubmit={handleSubmit}>
          <h1 className="form title">Create an event for </h1>
          <hr></hr>
          <p className="form subtitle">What is the name of your event?</p>
          {newErrors?.name && <p className="newErrors">{newErrors?.name}</p>}
          <input
            className="form name"
            name="name"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <hr></hr>
          <p className="form subtitle">Is this an in person or online event?</p>
          {newErrors?.type && <p className="newErrors">{newErrors?.type}</p>}
          <select
            className="form type"
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
            className="form private"
            name="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="">Select</option>
            <option value="true">Private</option>
            <option value="false">Public</option>
          </select>
          <p className="form subtitle">What is the price for your event?</p>
          {newErrors?.price && <p className="newErrors">{newErrors?.price}</p>}
          <input
            type="text"
            className="form price"
            placeholder="$0"
            value={"$" + (price !== undefined ? `${price}` : "0")}
            onChange={(e) => setPrice(e.target.value.slice(1))}
          />
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
            Please add an image url for your event!
          </p>
          {newErrors?.url && <p className="newErrors">{newErrors?.url}</p>}
          <input
            type="text"
            className="form img url"
            placeholder="Image Url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <hr></hr>
          <p className="form subtitle">Give a description for the event</p>
          {newErrors?.description && (
            <p className="newErrors">{newErrors?.description}</p>
          )}
          <textarea
            className="form description"
            name="description"
            rows="9"
            cols="50"
            placeholder="Give a brief description with a minimum of 30 characters."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="form submit" type="submit">
            Create event
          </button>
        </form>
      </div>
    </>
  );
};

export default EventForm;
