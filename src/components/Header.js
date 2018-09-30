import React from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem, NavLink, Navbar, NavbarBrand, Button} from "reactstrap";

const Header = () => (
    <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Re:Music</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/"><Button color="secondary" size="sm">Add New Score</Button></NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/"><Button color="secondary" size="sm">Instructions</Button></NavLink>
          </NavItem>
        </Nav>
    </Navbar>
);

export default Header
