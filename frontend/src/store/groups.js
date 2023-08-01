import { csrfFetch } from "./csrf";

// Action Types

const LOAD_GROUPS = "groups/loadGroups";

// Action Creators

const getGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    groups,
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

// Reducers

// const initialState = {}

const groupsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GROUPS:
      const newState = {};
      action.groups.allGroups.forEach((group) => {
        newState[group.id] = group;
      });
      return newState;
    default:
      return state;
  }
};

export default groupsReducer;
