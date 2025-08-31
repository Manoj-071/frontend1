import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "./logo.png"; // Assuming you have a logo image in the src folder
class InfoCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username:''
    };
  }
}

export default function Navbar() {
  const location = useLocation();
  const username = location.state?.username;
  const navigate = useNavigate();
  const add = () => {
    navigate("/addproblem", { state: { username } });
  };
  const home = () => {
    navigate("/dashboard", { state: { username } });
  };
  const view = () => {
    navigate("/viewproblem", { state: { username } });
  };
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ background: "linear-gradient(135deg, #fdfbfb, #ebedee)", borderRadius: "0.5rem" }}>
      <div className="container-fluid">
        <img  src={logo} alt="Code Tracker Logo" width="70" />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" onClick={home} style={{ cursor: "pointer"  ,marginLeft: "20px"}}>Home</a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: "pointer", marginLeft: "20px" }}
              >
                Problem
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" onClick={add} style={{ cursor: "pointer"}}>Add Problem</a></li>
                <li><a className="dropdown-item" onClick={view} style={{ cursor: "pointer"}}>View Problem</a></li>
              </ul>
            </li>
          </ul>

          <span className="navbar-text dropdown">
            <a
              className="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >{username}</a>
            <ul className="dropdown-menu ">
              <li><a className="dropdown-item" href="/">Logout</a></li>
            </ul>
          </span>
        </div>
      </div>
    </nav>
  );
}
