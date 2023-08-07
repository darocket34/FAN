import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewGroup,
  loadSingleGroup,
  updateGroup,
} from "../../store/groups";
import "./Groups.css";

const GroupForm = ({ group, formType }) => {
  const { groupId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [newErrors, setNewErrors] = useState({});
  const [name, setName] = useState(group?.name || '');
  const [about, setAbout] = useState(group?.about|| '');
  const [type, setType] = useState(group?.type|| '');
  const [visibility, setVisibility] = useState(group?.private|| '');
  const [city, setCity] = useState(group?.city|| '');
  const [state, setState] = useState(group?.state|| '');
  const [url, setUrl] = useState("");
  const sessionUser = useSelector((state) => state.session.user);
  const currGroup = useSelector((state) => state.groups.singleGroup);

  if (group && formType === "update") {
    if (sessionUser?.id !== group?.organizerId || !sessionUser?.id) {
      history.push("/unauthorized");
    }
  }
  useEffect(() => {
    if (group && formType === "update") {
      dispatch(loadSingleGroup(groupId));
    }
  }, [dispatch]);

  useEffect(() => {
    setName(group?.name);
    setAbout(group?.about);
    setType(group?.type);
    setVisibility(group?.private);
    setCity(group?.city);
    setState(group?.state);
  }, [group]);

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
      url,
      private: visibility,
    };
    if (group) {
      group = {
        id: group.id,
        name,
        organizerId: sessionUser.id,
        about,
        type,
        city,
        state,
        private: visibility,
      };
    }

    if (formType === "update") {
      try {
        const resUpdate = await dispatch(updateGroup(group));
        if (resUpdate && !resUpdate.errors) {
          history.push(`/groups/${group.id}`);
        }
        const { errors } = resUpdate;
        if (resUpdate && resUpdate.errors) {
          setNewErrors(errors);
        }
      } catch (err) {
        if (err) {
          const { errors } = err;
          setNewErrors(errors);
        }
      }
    } else {
      try {
        const resCreate = await dispatch(createNewGroup(newGroup));
        if (resCreate && !resCreate.errors) {
          history.push(`/groups/${resCreate.id}`);
        }
        const { errors } = resCreate;
        if (resCreate && resCreate.errors) {
          setNewErrors(errors);
        }
      } catch (err) {
        if (err) {
          const { errors } = err;
          setNewErrors(errors);
        }
      }
    }
  };

  return (
    <>
      {sessionUser && (
        <div>
          <form className="create group" onSubmit={handleSubmit}>
            <p className="topLine">BECOME AN ORGANIZER</p>
            <h1 className="form title">
              {!group && "Start a New Group"}
              {group && "Update your Group"}
            </h1>

            <hr></hr>
            <h1 className="form title">Where is this Group's base?</h1>
            <p className="form subtitle">
              F.A.N groups meet locally, in person, and online. We'll connect
              you with people in your area
            </p>
            {newErrors?.city && <p className="newErrors">{newErrors?.city}</p>}
            {newErrors?.state && (
              <p className="newErrors">{newErrors?.state}</p>
            )}
            <input
              className="form group location city"
              name="city"
              placeholder="City"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
            />
            <input
              className="form group location state"
              name="state"
              placeholder="STATE"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
              }}
            />
            <hr></hr>
            <h1 className="form title">What will your group's name be?</h1>
            <p className="form subtitle">
              Choose a name that will give people a clear idea of what the group
              is about. Feel free to get creative! You can edit this later if
              you change your mind.
            </p>
            {newErrors?.name && <p className="newErrors">{newErrors?.name}</p>}
            <input
              className="form name"
              name="name"
              placeholder="What is your group name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <hr></hr>
            <h1 className="form title">Describe the purpose of your group.</h1>
            <p className="form subtitle">
              People will see this when we promote your group, but you'll be
              able to add to it later, too.
              <li className="first line list">1. What's the purpose of the group?</li>
              <li>2. Who should join?</li>
              <li>3. What will you do at your events?</li>
            </p>
            {newErrors?.about && (
              <p className="newErrors">{newErrors?.about}</p>
            )}
            <textarea
              className="form about"
              name="about"
              rows="9"
              cols="50"
              placeholder="Please write at least 30 characters"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
            <hr></hr>
            <h1 className="form title">Almost there!</h1>
            <p className="form subtitle">
              Is this an in-person or online group?
            </p>
            {newErrors?.type && <p className="newErrors">{newErrors?.type}</p>}
            <select
              className="form type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="" className="gray">
                Select
              </option>
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
              <option value="" className="gray">
                Select
              </option>
              <option value="true">Private</option>
              <option value="false">Public</option>
            </select>
            {!formType && (
              <p className="form subtitle">
                Please add an image URL for your group below:
              </p>
            )}
            {newErrors?.url && <p className="newErrors">{newErrors?.url}</p>}
            {!formType && (
              <input
                type="url"
                className="form img url"
                placeholder="Image Url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            )}
            <hr></hr>
            {group && (
              <button className="form submit" type="submit">
                Update Group
              </button>
            )}

            {!group && (
              <button className="form submit" type="submit">
                Create Group
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default GroupForm;
