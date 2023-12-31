import { csrfFetch } from "./csrf";

// Action Types

const LOAD_EVENTS = "events/loadEvents";
const LOAD_SINGLE_EVENT = "events/loadSingleEvent";
const CREATE_EVENT = "events/createEvent";
const DELETE_EVENT = "events/deleteEvent";

// Action Creators

const getEvents = (events) => {
  return {
    type: LOAD_EVENTS,
    events,
  };
};

const getSingleEvent = (event) => {
  return {
    type: LOAD_SINGLE_EVENT,
    event,
  };
};

const postNewEvent = (event) => {
  return {
    type: CREATE_EVENT,
    event,
  };
};

const removeEvent = (eventId) => {
  return {
    type: DELETE_EVENT,
    eventId,
  };
};

// Thunk Action Creators

export const loadEvents = () => async (dispatch) => {
  const res = await csrfFetch("/api/events/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    const events = await res.json();
    await dispatch(getEvents(events));
    return events;
  } else {
    const { errors } = await res.json();
    return errors;
  }
};

export const loadSingleEvent = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    let event = await res.json();
    event = event.singleEvent[0];
    await dispatch(getSingleEvent(event));
    return event;
  } else {
    const { errors } = await res.json();
    return errors;
  }
};

export const createNewEvent = (newEvent, groupId) => async (dispatch) => {
  let newImgErrors = {};
  var errCollector = {};
  var newEventId = 0;
  // var newImageId = 0;

  if (newEvent.url) {
    const imgUrlArr = newEvent.url.split(".");
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
    const res = await csrfFetch(`/api/groups/${groupId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });
    var freshEvent = await res.json();
    newEventId = freshEvent.id;
    try {
      const imgObj = {
        eventId: freshEvent.id,
        url: newEvent.url,
        preview: true,
      };
      if (newEvent.url.length > 255) {
        newImgErrors = { url: "Image url must be less than 255 characters" };
      } else {
        const imgRes = await csrfFetch(`/api/events/${freshEvent.id}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(imgObj),
        });
        // const newImage = await imgRes.json();
        // newImageId = newImage.id;
        if (imgRes.ok && res.ok && !newImgErrors.url) {
          await dispatch(postNewEvent(freshEvent));
          return freshEvent;
        }
      }
    } catch (err1) {
      await dispatch(deleteEvent(newEventId));
      const { errors } = await err1.json();
      errCollector = { errors: { ...newImgErrors, ...errors } };
      return { ...errCollector };
    }
  } catch (err) {
    if (err) {
      const { errors } = await err.json();
      if (newEventId) await dispatch(deleteEvent(newEventId));
      errCollector = { errors: { ...errors, ...newImgErrors } };
      return { ...errCollector };
    } else {
      if (newEventId) await dispatch(deleteEvent(newEventId));
      errCollector = { errors: { ...newImgErrors } };
      return { ...errCollector };
    }
  }
  if (newImgErrors.url) {
    await dispatch(deleteEvent(newEventId));
    // await csrfFetch(`/api/group-images/${newImageId}`, {
    //   method: "DELETE",
    //   headers: { "Content-Type": "application/json" },
    // });
    return { errors: { ...newImgErrors } };
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    // const event = await res.json();
    await dispatch(removeEvent(eventId));
    return;
  } else {
    const { errors } = await res.json();
    return errors;
  }
};

// Reducers

const initialState = { allEvents: {}, singleEvent: {} };

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      const newEvents = {};
      action.events.allEvents.forEach((event) => {
        newEvents[event.id] = event;
      });
      return { ...state, allEvents: newEvents };
    case LOAD_SINGLE_EVENT:
      return { ...state, singleEvent: action.event };
    case CREATE_EVENT:
      state = { ...state, singleEvent: {[action.event.id]: action.event} };
      return state;
    case DELETE_EVENT:
      const newStateDelete = { ...state };
      delete newStateDelete.allEvents[action.eventId];
      delete newStateDelete.singleEvent
      return {...newStateDelete, singleEvent: {}};
    default:
      return state;
  }
};



export default eventsReducer;
