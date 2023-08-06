import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import HomePage from "./components/HomePage/HomePage";
import AllListings from "./components/Listings/Listings";
import GroupDetails from "./components/Groups/GroupDetails";
import EventDetails from "./components/Events/EventDetails";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import CreateGroup from "./components/Groups/CreateGroup";
import UpdateGroup from "./components/Groups/UpdateGroup";
import EventForm from "./components/Events/EventForm";
import Unauthorized from "./components/PageNotFound/Unauthorized";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/groups">
            <AllListings list="groups" />
          </Route>
          <Route exact path="/events">
            <AllListings list="events" />
          </Route>
          <Route exact path="/groups/new">
            <CreateGroup />
          </Route>
          <Route exact path="/groups/:groupId">
            <GroupDetails />
          </Route>
          <Route exact path="/groups/:groupId/edit">
            <UpdateGroup />
          </Route>
          <Route exact path="/groups/:groupId/events">
            <EventForm />
          </Route>
          <Route exact path="/events/:eventId">
            <EventDetails />
          </Route>
          <Route exact path='/unauthorized'>
            <Unauthorized />
          </Route>
          <Route path='/'>
            <PageNotFound />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
