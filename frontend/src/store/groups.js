import { csrfFetch } from "./csrf";

// Action Types

const LOAD_GROUPS = "groups/loadGroups";
const LOAD_SINGLE_GROUP = "events/loadSingleGroup";
const LOAD_EVENTS_BY_GROUPID = "events/loadEventsByGroupId";

// Action Creators

const getGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    groups,
  };
};

const getSingleGroup = (group) => {
  return {
    type: LOAD_SINGLE_GROUP,
    ...group,
  };
};

const getEventsByGroupId = (group) => {
  return {
    type: LOAD_EVENTS_BY_GROUPID,
    group,
  };
};
// Thunk Action Creators

export const loadGroups = () => async (dispatch) => {
  const res = await csrfFetch("/api/groups/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    const groups = await res.json();
    await dispatch(getGroups(groups));
    return groups;
  } else {
    const { errors } = await res.json();
    return errors;
  }
};

export const loadSingleGroup = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    const group = await res.json();
    await dispatch(getSingleGroup(group));
    return group;
  } else {
    const { errors } = await res.json();
    return errors;
  }
};

export const loadEventsByGroupId = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    const group = await res.json();
    await dispatch(getEventsByGroupId(group));
    return group;
  } else {
    const { errors } = await res.json();
    return errors;
  }
};

// Reducers

const initialState = { allGroups: {}, singleGroup: {} };

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_GROUPS:
      const newGroups = {};
      action.groups.allGroups.forEach((group) => {
        newGroups[group.id] = group;
      });
      return { ...state, allGroups: newGroups };
    case LOAD_SINGLE_GROUP:
      state = { ...state, singleGroup: { [action.group.id]: action.group } };
      return state;
    case LOAD_EVENTS_BY_GROUPID:
      const sum = action.group;
      return { ...state, numEvents: sum };
    default:
      return state;
  }
};

export default groupsReducer;
