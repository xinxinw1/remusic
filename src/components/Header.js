import React from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem, NavLink, Navbar, NavbarBrand, Button} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

const Header = () => (
    <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/"><FontAwesomeIcon icon={faPlay} size="sm"/>  Re:Music</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/score"><Button color="secondary" size="sm">Add New Score</Button></NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/help"><Button color="secondary" size="sm">Instructions</Button></NavLink>
          </NavItem>
        </Nav>
    </Navbar>
);

export default Header
