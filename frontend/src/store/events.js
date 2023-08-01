import { csrfFetch } from "./csrf";

// Action Types

const LOAD_EVENTS = "events/loadEvents";

// Action Creators

const getEvents = (events) => {
  return {
    type: LOAD_EVENTS,
    events,
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

// Reducers

// const initialState = {}

const eventsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      const newState = {};
      action.events.allEvents.forEach((event) => {
        newState[event.id] = event;
      });
      return newState;
    default:
      return state;
  }
};

export default eventsReducer;
