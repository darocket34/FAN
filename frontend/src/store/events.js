import { csrfFetch } from "./csrf";

// Action Types

const LOAD_EVENTS = "events/loadEvents";
const LOAD_SINGLE_EVENT = "events/loadSingleEvent";
const CREATE_EVENT = "events/createEvent";
const DELETE_EVENT = 'events/deleteEvent'

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
    eventId
  }
}

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
  const res = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEvent),
  });
  if (res.ok) {
    const event = await res.json();
    console.log('first')
    await dispatch(postNewEvent(event));
    return event;
  } else {
    const { errors } = await res.json();
    return errors;
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
        const newState = {...state};
        console.log(newState)
        delete newState[action.eventId]
        return newState;
    default:
      return state;
  }
};

export default eventsReducer;
