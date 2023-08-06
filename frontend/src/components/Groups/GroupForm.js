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
  const [name, setName] = useState(group?.name);
  const [about, setAbout] = useState(group?.about);
  const [type, setType] = useState(group?.type);
  const [visibility, setVisibility] = useState(group?.private);
  const [city, setCity] = useState(group?.city);
  const [state, setState] = useState(group?.state);
  const [url, setUrl] = useState(group?.GroupImages[0].url);
  const sessionUser = useSelector((state) => state.session.user);
  const currGroup = useSelector((state) => state.groups.singleGroup);

  useEffect(() => {
    if (!group && formType === "update") {
      dispatch(loadSingleGroup(groupId)).then(() => {
        if (sessionUser?.id !== currGroup?.organizerId) {
          history.push("/unauthorized").catch(() => {
            history.push("/pagenotfound");
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    setName(group?.name);
    setAbout(group?.about);
    setType(group?.type);
    setVisibility(group?.private);
    setCity(group?.city);
    setState(group?.state);
    setUrl(group?.GroupImages[0].url);
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
        url,
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
              Fill out the information below to get started!
            </h1>
            <hr></hr>
            <h1 className="form title">Where is this Group's base?</h1>
            <p className="form subtitle">
              F.A.N groups meet both in person and online. Setting the location
              will allow us to connect you with locals in your area.
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
              placeholder="State"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
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
            {newErrors?.about && (
              <p className="newErrors">{newErrors?.about}</p>
            )}
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
            <p className="form subtitle">
              Is this an in person or online group?
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
            <p className="form subtitle">
              Please add an image url for your group!
            </p>
            {newErrors?.url && <p className="newErrors">{newErrors?.url}</p>}
            <input
              type="url"
              className="form img url"
              placeholder="Image Url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
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
