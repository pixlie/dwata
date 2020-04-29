import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { toggleSidebar } from "services/global/actions";


const Navbar = ({ toggleSidebar }) => (
  <nav className="navbar is-light" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <Link className="navbar-item is-mega" to="/">
        Admin
      </Link>

      <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" href="/">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div className="navbar-menu">
      <div className="navbar-start">
        <div className="buttons">
          <button className="button is-primary" onClick={toggleSidebar}>
            Sources
          </button>
        </div>
      </div>
    </div>
  </nav>
);


export default connect(
  () => ({}),
  { toggleSidebar }
)(Navbar);