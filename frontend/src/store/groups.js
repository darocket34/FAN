import { csrfFetch } from "./csrf";

// Action Types

const LOAD_GROUPS = "groups/loadGroups";
const LOAD_SINGLE_GROUP = "groups/loadSingleGroup";
const LOAD_EVENTS_BY_GROUPID = "groups/loadEventsByGroupId";
const CREATE_GROUP = "groups/createGroup";
const UPDATE_GROUP = 'group/updateGroup'
const DELETE_GROUP = "groups/deleteGroup";

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
    group,
  };
};

const getEventsByGroupId = (group) => {
  return {
    type: LOAD_EVENTS_BY_GROUPID,
    group,
  };
};

const postNewGroup = (newGroup) => {
  return {
    type: CREATE_GROUP,
    newGroup,
  };
};

const updateExistingGroup = (group) => {
  return {
    type: UPDATE_GROUP,
    group
  }
}

const removeGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId,
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

export const createNewGroup = (newGroup) => async (dispatch) => {
  const res = await csrfFetch("/api/groups/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newGroup),
  });
  if (res.ok) {
    const group = await res.json();
    await dispatch(postNewGroup(group));
    return group;
  } else {
    const { errors } = await res.json();
    return errors;
  }
};

export const updateGroup = (group) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${group.id}/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(group),
  });
  if (res.ok) {
    const group = await res.json();
    await dispatch(updateExistingGroup(group));
    return group;
  } else {
    const { errors } = await res.json();
    return errors;
  }
};

export const deleteGroup = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    const group = await res.json();
    await dispatch(removeGroup(groupId));
    return;
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
    case CREATE_GROUP:
      state = { ...state, allGroups: action.newGroup };
      return state
      case UPDATE_GROUP:
        state = {...state, allGroups: action.group}
    case DELETE_GROUP:
      const newState = { ...state };
      delete newState[action.reportId];
      return newState;
    default:
      return state;
  }
};

export default groupsReducer;
