import "./HomePage.css";
import { section1img, section31, section32, section33 } from "../../images/";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="section1 container">
        <div className="section1 info">
          <h1 className="section1 title">
            Make <b>Friends</b>, Do <b>Activites</b>, Start <b>Networking</b>
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
        <h2 className="section2 title">How F.A.N works</h2>
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

          {/*//! ADD REAL LINK */}

          <h3 className="section3 navlink findevent">Find an event</h3>
          <p className="section3 subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="section33 link startnewgroup container">
          <img src={section33} alt="sec33 img" className="section3 img33" />

          {/*//! ADD REAL LINK */}

          <h3 className="section3 navlink startgroup">Start a new group</h3>
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
