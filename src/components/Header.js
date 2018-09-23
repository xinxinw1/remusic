import React from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";

const Header = () => (
  <header>
    <Nav tabs>
      <NavItem>
        <NavLink tag={Link} to="/">Home</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} to="/help">Help</NavLink>
      </NavItem>
    </Nav>
  </header>
)

export default Header
