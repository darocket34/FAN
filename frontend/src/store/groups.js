import { csrfFetch } from "./csrf";

// Action Types

const LOAD_GROUPS = "groups/loadGroups";
const LOAD_SINGLE_GROUP = "groups/loadSingleGroup";
const LOAD_EVENTS_BY_GROUPID = "groups/loadEventsByGroupId";
const CREATE_GROUP = "groups/createGroup";
const UPDATE_GROUP = "group/updateGroup";
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
    group,
  };
};

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
  let newImgErrors = {};
  var errCollector = {};
  var newGroupId = 0;
  // var newImageId = 0;

  if (newGroup.url) {
    const imgUrlArr = newGroup.url.split(".");
    const imgUrlEnding = imgUrlArr[imgUrlArr.length - 1];

    if (
      imgUrlEnding !== "jpg" &&
      imgUrlEnding !== "jpeg" &&
      imgUrlEnding !== "png"
    ) {
      newImgErrors = { url: "Image Url must be a .jpg, .jpeg, or .png" };
    }
  } else {
    newImgErrors = { url: "Image Url is required" };
  }

  try {
    const res = await csrfFetch("/api/groups/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGroup),
    });
    var freshGroup = await res.json();
    newGroupId = freshGroup.id;

    try {
      const imgObj = {
        groupId: freshGroup.id,
        url: newGroup.url,
        preview: true,
      };
      if (newGroup.url.length > 255) {
        newImgErrors = { url: "Image url must be less than 255 characters" };
      } else {
        const imgRes = await csrfFetch(`/api/groups/${freshGroup.id}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(imgObj),
        });
        // const newImage = await imgRes.json();
        // newImageId = newImage.id;
        if (imgRes.ok && res.ok && !newImgErrors.url) {
          await dispatch(postNewGroup(freshGroup));
          return freshGroup;
        }
      }
    } catch (err1) {
      await dispatch(deleteGroup(newGroupId));
      const errors = await err1.json();
      errCollector = { errors: { ...newImgErrors, ...errors } };
      return { ...errCollector };
    }
  } catch (err) {
    if (err) {
      const { errors } = await err.json();
      if (newGroupId) await dispatch(deleteGroup(newGroupId));
      errCollector = { errors: { ...errors, ...newImgErrors } };
      return { ...errCollector };
    } else {
      if (newGroupId) await dispatch(deleteGroup(newGroupId));
      errCollector = { errors: { ...newImgErrors } };
      return { ...errCollector };
    }
  }
  if (newImgErrors.url) {
    await dispatch(deleteGroup(newGroupId));
    // await csrfFetch(`/api/group-images/${newImageId}`, {
    //   method: "DELETE",
    //   headers: { "Content-Type": "application/json" },
    // });
    return { errors: { ...newImgErrors } };
  }
};

export const updateGroup = (group) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/groups/${group.id}/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(group),
    });
    if (res.ok) {
      const group = await res.json();
      await dispatch(updateExistingGroup(group));
      return group;
    }
  } catch (err) {
    if (err) {
      const { errors } = await err.json();
      return { errors: { ...errors } };
    }
  }
};

export const deleteGroup = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    // const group = await res.json();
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
      state = {
        ...state,
        singleGroup: { [action.newGroup.id]: action.newGroup },
      };
      return state;
    case UPDATE_GROUP:
      state = { ...state, singleGroup: { [action.group.id]: action.group } };
      return state;
    case DELETE_GROUP:
      const newStateDelete = { ...state };
      delete newStateDelete.allGroups[action.groupId];
      delete newStateDelete.singleGroup;
      return { ...newStateDelete, singleGroup: {} };
    default:
      return state;
  }
};

export default groupsReducer;
