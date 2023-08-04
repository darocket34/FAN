import "./HomePage.css";
import { section1img, section31, section32, section33 } from "../../images/";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const HomePage = () => {
  const [disable, setDisable] = useState(true);
  const sessionUser = useSelector((state) => state.session.user);
  useEffect(() => {
    if (sessionUser) setDisable(false);
  }, [sessionUser, disable]);
  return (
    <div className="homepage">
      <div className="section1 container">
        <div className="section1 info">
          <h1 className="section1 title">
            Make <i className="standout">Friends</i>, Do <i className="standout">Activites</i>, Start <i className="standout">Networking</i>
          </h1>
          <p className="section1 subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Tincidunt id aliquet risus feugiat in ante. Viverra accumsan in nisl
            nisi scelerisque. Lacus vestibulum sed arcu non. In tellus integer
            feugiat scelerisque varius morbi enim nunc.
          </p>
        </div>
        <img src={section1img} alt="sec1 img" className="section1 img" />
      </div>

      <div className="section2 container">
        <h2 className="section2 title">How <i className="standout">F.A.N.</i> works</h2>
        <p className="section2 subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="section3 feature links container">
        <div className="section31 link seeallgroups container">
          <img src={section31} alt="sec31 img" className="section3 img31" />
          <Link className="section3 navlink seeallgroups" to="/groups">
            See all Groups
          </Link>
          <p className="section3 subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="section32 link findanevent container">
          <img src={section32} alt="sec32 img" className="section3 img32" />

          <Link className="section3 navlink findevent" to="/events">
            Find an event
          </Link>
          <p className="section3 subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="section33 link startnewgroup container">
          <img src={section33} alt="sec33 img" className="section3 img33" />

          <Link
            className={`section3 navlink startgroup ${
              disable ? "grayout" : ""
            }`}
            to="/groups/new"
            onClick={(e) => {
              if (disable) e.preventDefault();
            }}
          >
            Start a new group
          </Link>
          <p className="section3 subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      <div className="section4 joinmeetup">
        <button className="section4 joinfan">Join F.A.N.</button>
      </div>
    </div>
  );
};

export default HomePage;
