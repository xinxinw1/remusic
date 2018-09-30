import React from "react";
import { firebase } from '../firebase';
import PDF from 'react-pdf-js';
import "./Score.css";

class Highlight extends React.Component {
  render() {
    return (
      <div className="highlight" style={{
        top: this.props.top,
        left: this.props.left,
        width: this.props.width,
        height: this.props.height
      }}></div>
    )
  }
}


class Score extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      page: 0,
      mouseDown: false,
      commentChains: {},
      comments: {}
    };
    console.log(props);
    this.scoreId = props.match.params.id;
    this.highlightsDiv = React.createRef();
    this.displayScore();
    this.displayVersions();
  }

  displayScore() {
    var scoreRef = firebase.database().ref('scores/' + this.scoreId);
    scoreRef.on('value', (score) => {
      document.title = score.val().title;
    });
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
      this.setState({
        versionId: version.key,
        file: url,
        page: 0
      });
      this.displayCommentChains();
      this.displayComments();
      //url = "./acappella.pdf";
    });
  }

  displayCommentChains() {
    console.log("display comment chains", this.state.versionId, this.state.page);
    var commentChainsRef = firebase.database().ref('comment-chains/' + this.scoreId + '/' + this.state.versionId + '/' + this.state.page);
    commentChainsRef.on('value', (commentChains) => {
      this.setState({commentChains: commentChains.val()});
      console.log(this.state);
    });
  }

  displayComments() {
    console.log("display comments");
    var commentsRef = firebase.database().ref('comments/' + this.scoreId + '/' + this.state.versionId + '/' + this.state.page);
    commentsRef.on('value', (comments) => {
      this.setState({comments: comments.val()});
      console.log(this.state);
    });
  }

  componentDidMount() {
    window.addEventListener('mouseup', (e) => this.mouseUp(e), false);
    window.addEventListener('mousemove', (e) => this.mouseMove(e), false);
  }

  mouseUp(e) {
    this.setState({mouseDown: false});
    if (this.state.highlightWidth > 10 &&
        this.state.highlightHeight > 10) {
      this.insertCommentChain();
    }
  }

  insertCommentChain() {
    console.log("insert comment chain", this.scoreId, this.state.versionId, this.state.page);
    /*var commentChainsRef = firebase.database().ref('comment-chains/' + this.scoreId + '/' + this.versionId + '/' + this.page);
    var commentChainRef = commentChainsRef.push();
    commentChainRef.set({
      highlightTop: this.state.highlightTop,
      highlightLeft: this.state.highlightLeft,
      highlightWidth: this.state.highlightWidth,
      highlightHeight: this.state.highlightHeight,
      commentChainTop: highlightDiv.offset().top - $("#pdf-canvas").offset().top,
      commentChainLeft: $("#pdf-canvas").offset().left + $("#pdf-canvas").width() + 20,
    });*/
  }

  getHighlightsBounds() {
    return this.highlightsDiv.current.getBoundingClientRect();
  }

  mouseDown(e) {
    if (e.button === 0) {
      e.preventDefault();
      let bounds = this.getHighlightsBounds();
      this.setState({
        mouseDown: true,
        mouseDownX: e.pageX,
        mouseDownY: e.pageY,
        highlightTop: e.pageY-bounds.y,
        highlightLeft: e.pageX-bounds.x,
        highlightWidth: 0,
        highlightHeight: 0
      });
    }
  }

  mouseMove(e) {
    if (this.state.mouseDown) {
      let bounds = this.getHighlightsBounds();
      this.setState({
        highlightTop: Math.min(e.pageY, this.state.mouseDownY)-bounds.y,
        highlightLeft: Math.min(e.pageX, this.state.mouseDownX)-bounds.x,
        highlightWidth: Math.abs(e.pageX-this.state.mouseDownX),
        highlightHeight: Math.abs(e.pageY-this.state.mouseDownY)
      });
    }
  }

  render() {
    let pdf = !this.state.file ? null : (
      <div
          onMouseDown={(e) => this.mouseDown(e)}
      >
        <PDF
          file={this.state.file}
          onDocumentComplete={this.onDocumentComplete}
          page={this.state.page+1}
        />
      </div>
    );

    let highlightDivs = Object.keys(this.state.commentChains).map((commentChainId) => {
      let commentChain = this.state.commentChains[commentChainId];
      return (
        <Highlight
          key={commentChainId}
          top={commentChain.highlightTop}
          left={commentChain.highlightLeft}
          width={commentChain.highlightWidth}
          height={commentChain.highlightHeight}
        />
      )
    });

    return (
      <div>
        <div id="highlights" ref={this.highlightsDiv}>
          <Highlight
            key="next"
            top={this.state.highlightTop}
            left={this.state.highlightLeft}
            width={this.state.highlightWidth}
            height={this.state.highlightHeight}
          />
          {highlightDivs}
        </div>
        {pdf}
      </div>
    );
  }
}

export default Score
