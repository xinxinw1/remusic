import React from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem, NavLink, Navbar, NavbarBrand, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import Dropzone from 'react-dropzone'
import "./Header.css";
import { firebase } from '../firebase';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  toggle(){
    this.setState({
      modal: !this.state.modal
    });
  }

  upload(acceptedFiles, rejectedFiles) {
    console.log("received");
  }
  

  render() {
    return (
    <div>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/"><FontAwesomeIcon icon={faPlay} size="sm" />  Re:Music</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="" onClick={()=>this.toggle()}><Button color="secondary" size="sm">Add New Score</Button></NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/help"><Button color="secondary" size="sm">Instructions</Button></NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <Modal isOpen={this.state.modal} toggle={()=>this.toggle()} >
          <ModalHeader toggle={()=>this.toggle()}>Upload Score</ModalHeader>
          <ModalBody>
            <Dropzone onDrop={(acceptedFiles, rejectedFiles)=>this.upload(acceptedFiles,rejectedFiles)} className="dropzone">
              <p id="upload_text"><FontAwesomeIcon icon={faCloudUploadAlt} size="sm" />Drag the music score pdf file here</p>
            </Dropzone>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={()=>this.toggle()}>Cancel</Button>
          </ModalFooter>
        </Modal>
    </div>
    );

  }
}


export default Header
