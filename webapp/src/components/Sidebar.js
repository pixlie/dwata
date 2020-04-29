import React from "react";
import { connect } from "react-redux";

import { toggleSidebar } from "services/global/actions";


const Sidebar = ({ global, toggleSidebar, children }) => {
  if (global.isSidebarOn) {
    return (
      <div id="sidebar">
        <div className="head">
          <button className="button is-rounded" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {children}
      </div>
    );
  }

  return null;
}


const mapStateToProps = state => ({
  global: state.global,
});


export default connect(
  mapStateToProps,
  { toggleSidebar }
)(Sidebar);