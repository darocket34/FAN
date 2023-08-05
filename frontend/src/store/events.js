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

const postNewEvent = (newEvent) => {
  return {
    type: CREATE_EVENT,
    newEvent,
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
      const imgRes = await csrfFetch(`/api/events/${freshEvent.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imgObj),
      });
      if (imgRes.ok && res.ok && !newImgErrors.url) {
        console.log('IMG POSTED', newImgErrors)
        await dispatch(postNewEvent(freshEvent));
        return freshEvent;
      }
      // else {
      //   console.log("NOTHING TO SEE HERE");
      //   const imgRes = await csrfFetch(`/api/"/event-images"/${imgRes.id}`, {
      //     method: "DELETE",
      //     headers: { "Content-Type": "application/json" }
      //   });
      //   errCollector = { errors: { ...newImgErrors } };
      //   return {errCollector};
      // }
    } catch (err1) {
      console.log("RIGHT SIDE RES", err1);
      await dispatch(deleteEvent(newEventId));
      const { errors } = await err1.json();
      errCollector = {errors: {...newImgErrors, ...errors} };
      return {...errCollector};
    }
  } catch (err) {
    console.log("RIGHT SIDE ERR", err);
    if (err) {
      const { errors } = await err.json()
      console.log("RIGHT SIDE EVENT", freshEvent);
      console.log("RIGHT SIDE ERRCollector", errCollector);
      console.log("RIGHT SIDE ERRORS", errors);
      console.log("RIGHT SIDE NEWEVENTID", newEventId);
      if (newEventId) await dispatch(deleteEvent(newEventId));
      errCollector = { errors: {...errors, ...newImgErrors } };
      return { ...errCollector };
    } else {
      if (newEventId) await dispatch(deleteEvent(newEventId));
      errCollector = { errors: { ...newImgErrors } };
      return { ...errCollector };
    }
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    const event = await res.json();
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
      // const event = {...state}
      // const singleEvent = Object.values(action.event)
      // return { singleEvent: {...Object.values(...event)[0]}};
      return { ...state, singleEvent: action.event };
    case CREATE_EVENT:
      state = { ...state, allEvents: action.newEvent };
      return state;
    case DELETE_EVENT:
      const newState = { ...state };
      delete newState[action.eventId];
      return newState;
    default:
      return state;
  }
};

export default eventsReducer;
