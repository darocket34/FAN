function SearchBar() {
  return (
    <form className="searchbarform">
      <div className="searchbardivevents">
        <i className="fas fa-magnifying-glass static" />
        <input
          className="searchbarinput searchevents"
          type="search"
          placeholder="Search Events"
        />
      </div>
      <div className="searchbardivlocation">
        <input
          className="searchbarinput searchlocation"
          type="search"
          placeholder="Neighborhood, city or zip"
        />
      </div>
      <button
        className="searchbar searchbutton"
        onClick={() => {
          alert("Feature Coming Soon");
        }}
      >
        <i className="fas fa-magnifying-glass fa-md search" />
      </button>
    </form>
  );
}

export default SearchBar;
