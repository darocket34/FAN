import { csrfFetch } from "./csrf";

// Action Types

const LOAD_EVENTS = "events/loadEvents";
const LOAD_SINGLE_EVENT = "events/loadSingleEvent";

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
    const event = await res.json();
    await dispatch(getSingleEvent(event));
    return event;
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
      const event = Object.values(action.event)
      return { ...state, singleEvent: {...Object.values(...event)[0]}};
    default:
      return state;
  }
};

export default eventsReducer;
