import React from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem, NavLink, Navbar, NavbarBrand, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import Dropzone from 'react-dropzone'
import "./Header.css";
import {firebase} from '../firebase';
import 'firebase/storage'
console.log(firebase.storage());
import Button from '@material-ui/core/Button';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
    this.storage = firebase.storage();
    this.database = firebase.database();
    this.scores = this.database.ref("scores");
    this.versions = this.database.ref("versions");
  }

  toggle(){
    this.setState({
      modal: !this.state.modal
    });
  }

  //assume one file per upload
  upload(acceptedFiles, rejectedFiles) {
    acceptedFiles.forEach(file => {
      var scoreItem = this.scores.push();
      scoreItem.set({
        title:file.name
      }).then(function(snapshot){
        console.log("scores sent." + scoreItem.key)
      });
      var versionItem = this.database.ref("versions/"+scoreItem.key).push();
      versionItem.set({
        file:file.name
      }).then(function(snapshot){
        console.log("versions sent")
      });
      var pdfRef = this.storage.ref("pdfs/"+scoreItem.key+'/'+versionItem.key + '/' + file.name)
      pdfRef.put(file).then(function(snapshot){
        console.log('Uploaded a file!');
        //window.location = "./score.html?id="+scoreItem.key;
    });
  });
}
  

  render() {
    return (
    <div>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand tag={Link} to="/"><FontAwesomeIcon icon={faPlay} size="sm" />  Re:Music</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/signup"><Button className={'white'}>Sign Up</Button></NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={()=>this.toggle()}><Button className={'white'}>Add New Score</Button></NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/help"><Button className={'white'}>Instructions</Button></NavLink>
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
