import React from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem, NavLink, Navbar, NavbarBrand} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import Button from '@material-ui/core/Button';
import './Header.css';



class Header extends React.Component {

    render() {
      return(
      <Navbar color="dark" dark expand="md">
        <NavbarBrand tag={Link} to="/"><FontAwesomeIcon icon={faPlay} size="sm"/> Re:Music</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/score"><Button className={'white'}>Add New Score</Button></NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/help"><Button className={'white'}>Instructions</Button></NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      );
    }
}



export default Header
