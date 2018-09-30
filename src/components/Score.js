import React from "react";
import { firebase } from '../firebase';
import PDF from 'react-pdf-js';

class Score extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      page: 1
    };
    console.log(props);
    this.scoreId = props.match.params.id;
    this.displayVersions();
  }

  displayVersions() {
    console.log("display versions", this.scoreId);
    var versionsRef = firebase.database().ref('versions/' + this.scoreId);
    versionsRef.on('child_added', (version) => {
      this.displayVersion(version);
    });
  }

  displayVersion(version) {
    console.log("display version", this.scoreId, version);
    var pdfRef = firebase.storage().ref("pdfs/" + this.scoreId + '/' + version.key + '/' + version.val().file);
    pdfRef.getDownloadURL().then((url) => {
      console.log("url", url);
      this.setState({file: url});
      //url = "./acappella.pdf";
    });
  }

  render() {
    let pdf = !this.state.file ? null : (
      <PDF
        file={this.state.file}
        onDocumentComplete={this.onDocumentComplete}
        page={this.state.page}
      />
    );
    return (
      <div>
        <div id="highlights"></div>
        {pdf}
      </div>
    );
  }
}

export default Score
