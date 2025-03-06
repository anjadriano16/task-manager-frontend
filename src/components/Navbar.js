import React from "react";
import Notifications from "./Notifications";

const Navbar = ({ token }) => {
  return (
    <nav className="navbar">
      <h1>Task Manager</h1>
      <Notifications token={token} />
    </nav>
  );
};

export default Navbar;
