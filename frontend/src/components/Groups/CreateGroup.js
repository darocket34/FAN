import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createNewGroup } from "../../store/groups";

const CreateGroup = ({ group }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [newErrors, setNewErrors] = useState({});
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [visibility, setVisibility] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const sessionUser = useSelector((state) => state.session.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNewErrors({});

    const newGroup = {
      name,
      organizerId: sessionUser.id,
      about,
      type,
      city,
      state,
      private: visibility,
    };

    try {
      const res = await dispatch(createNewGroup(newGroup))
      history.push(`/groups/${res.id}`);
    } catch (err) {
      if (err) {
        const { errors } = await err.json();
        setNewErrors(errors);
      }
    }
  };

  return (
    <>
      <div>
        <form className="create group" onSubmit={handleSubmit}>
          <p className="topLine">BECOME AN ORGANIZER</p>
          <h1 className="form title">
            Fill out the information below to get started!
          </h1>
          <hr></hr>
          <h1 className="form title">Where is this Group's base?</h1>
          <p className="form subtitle">
            F.A.N groups meet both in person and online. Setting the location
            will allow us to connect you with locals in your area.
          </p>
          {newErrors?.city && <p className="newErrors">{newErrors?.city}</p>}
          {newErrors?.state && <p className="newErrors">{newErrors?.state}</p>}
          <input
            className="form location"
            name="location"
            placeholder="City, State"
            onChange={(e) => {
              const [newCity, newState] = e.target.value.split(", ");
              setCity(newCity);
              setState(newState);
            }}
          />
          <hr></hr>
          <h1 className="form title">What will you name the Group?</h1>
          <p className="form subtitle">
            Pick a fun name to grab folks attention and also give a clue as to
            what the group is about. This can always be changed in the future.
          </p>
          {newErrors?.name && <p className="newErrors">{newErrors?.name}</p>}
          <input
            className="form name"
            name="name"
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <hr></hr>
          <h1 className="form title">Give a description for the group</h1>
          <p className="form subtitle">
            Think about what you want people to see when we promote your group
            to others.
            <li>What is the group's focus?</li>
            <li>Who should join?</li>
            <li>What kind of events will you hold?</li>
          </p>
          {newErrors?.about && <p className="newErrors">{newErrors?.about}</p>}
          <textarea
            className="form about"
            name="about"
            rows="9"
            cols="50"
            placeholder="Give a brief description with a minimum of 30 characters."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <hr></hr>
          <h1 className="form title">Almost there!</h1>
          <p className="form subtitle">Is this an in person or online group?</p>
          {newErrors?.type && <p className="newErrors">{newErrors?.type}</p>}
          <select
            className="form type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Online">Online</option>
            <option value="In person">In Person</option>
          </select>
          <p className="form subtitle">Is this group private or public?</p>
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
          <p className="form subtitle">
            Please add an image url for your group!
          </p>
          <input type="url" className="form img url" placeholder="Image Url" />
          <hr></hr>
          <button className="form submit" type="submit">
            Create Group
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateGroup;
