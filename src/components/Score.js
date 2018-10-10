import React from "react";
import { firebase } from '../firebase';
import { Document, Page } from '../react-pdf';
import "./Score.css";
import tools from '../tools';
import { Card, CardText, CardBody, CardTitle, Button } from 'reactstrap';

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

class CommentChain extends React.Component {
  render() {
    return (
      <Card className="comment-chain" style={{
        top: this.props.top,
        left: this.props.left,
      }}>
        <CardBody>
          {this.props.children}
        </CardBody>
      </Card>
    )
  }
}

class Comment extends React.Component {
  render() {
    return (
      <div>
        <CardTitle>{this.props.username}</CardTitle>
        <CardText>{this.props.type} - {this.props.content}</CardText>
      </div>
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
      comments: {},
      scoreWidth: 0,
      origScoreWidth: 0,
      pageLoaded: false
    };
    console.log(props);
    this.scoreId = props.match.params.id;
    this.highlightsDiv = React.createRef();
    this.scoreRef = React.createRef();
    this.documentRef = null;
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
      }, () => {
        this.displayCommentChains();
        this.displayComments();
      });
      //url = "./acappella.pdf";
    });
  }

  displayCommentChains() {
    console.log("display comment chains", this.state.versionId, this.state.page);
    var commentChainsRef = firebase.database().ref('comment-chains/' + this.scoreId + '/' + this.state.versionId + '/' + this.state.page);
    commentChainsRef.on('value', (commentChains) => {
      this.setState({commentChains: commentChains.val()}, () => {
        console.log("got comment chains", this.state.commentChains);
      });
    });
  }

  displayComments() {
    console.log("display comments");
    var commentsRef = firebase.database().ref('comments/' + this.scoreId + '/' + this.state.versionId + '/' + this.state.page);
    commentsRef.on('value', (comments) => {
      this.setState({comments: comments.val()}, () => {
        console.log("got comments", this.state.comments);
      });
    });
  }

  componentDidMount() {
    window.addEventListener('mouseup', (e) => this.mouseUp(e), false);
    window.addEventListener('mousemove', (e) => this.mouseMove(e), false);
    window.addEventListener('resize', (e) => this.resize());
    this.resize();
  }

  resize() {
    let prefWidth = this.getScoreBounds().width-500;
    let maxWidth = this.state.origScoreWidth*2;
    console.log("resize", prefWidth, maxWidth);
    this.setState({scoreWidth: Math.min(prefWidth, maxWidth)});
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
    var divBounds = this.highlightsDiv.current.getBoundingClientRect();
    var bodyBounds = document.body.getBoundingClientRect();

    return {
      top: divBounds.top-bodyBounds.top,
      left: divBounds.left-bodyBounds.left,
      width: divBounds.width,
      height: divBounds.height
    };
  }

  getScoreBounds() {
    var divBounds = this.scoreRef.current.getBoundingClientRect();
    var bodyBounds = document.body.getBoundingClientRect();

    return {
      top: divBounds.top-bodyBounds.top,
      left: divBounds.left-bodyBounds.left,
      width: divBounds.width,
      height: divBounds.height
    };
  }

  mouseDown(e) {
    if (e.button === 0) {
      e.preventDefault();
      let bounds = this.getHighlightsBounds();
      this.setState({
        mouseDown: true,
        mouseDownX: e.pageX,
        mouseDownY: e.pageY,
        highlightTop: e.pageY-bounds.top,
        highlightLeft: e.pageX-bounds.left,
        highlightWidth: 0,
        highlightHeight: 0
      });
    }
  }

  mouseMove(e) {
    if (this.state.mouseDown) {
      let bounds = this.getHighlightsBounds();
      this.setState({
        highlightTop: Math.min(e.pageY, this.state.mouseDownY)-bounds.top,
        highlightLeft: Math.min(e.pageX, this.state.mouseDownX)-bounds.left,
        highlightWidth: Math.abs(e.pageX-this.state.mouseDownX),
        highlightHeight: Math.abs(e.pageY-this.state.mouseDownY)
      });
    }
  }

  onPageLoad(page) {
    console.log("page load", page);
    this.setState({
      pageLoaded: true,
      origScoreWidth: page.originalWidth
    }, () => {
      this.resize();
    });
  }

  getScale() {
    return this.state.scoreWidth / this.state.origScoreWidth;
  }

  render() {
    let pdf = null;
    if (this.state.file) {
      pdf = (
        <div
            onMouseDown={(e) => this.mouseDown(e)}
        >
          <Document
            file={this.state.file}
            onLoadSuccess={this.onDocumentComplete}
          >
            <Page
              pageNumber={this.state.page+1}
              inputRef={(ref) => {this.documentRef = ref;}}
              onLoadSuccess={(page) => this.onPageLoad(page)}
              width={this.state.scoreWidth}
            />
          </Document>
        </div>
      );
    }

    let highlightDivs = [];
    let commentChainDivs = [];

    console.log("score ref", this.scoreRef.current);

    if (this.scoreRef.current && this.state.pageLoaded) {
      let scoreBounds = this.getScoreBounds();
      console.log("score bounds", scoreBounds);

      highlightDivs = Object.keys(this.state.commentChains).map((commentChainId) => {
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

      commentChainDivs = Object.keys(this.state.commentChains).map((commentChainId) => {
        let commentChain = this.state.commentChains[commentChainId];
        let comments = this.state.comments[commentChainId] || {};
        let commentDivs = Object.keys(comments).map((commentId) => {
          let comment = comments[commentId];
          return (
            <Comment
              key={commentId}
              content={comment.content}
              type={comment.type}
              username={comment.username}
            />
          );
        });

        function makeHrI(i) {
          return <hr key={i} />;
        }

        let i = 0;
        function makeHr() {
          return makeHrI(i++);
        }

        let commentDivsWithHr = tools.intersperseFn(commentDivs, makeHr);

        return (
          <CommentChain
            key={commentChainId}
            top={commentChain.commentChainTop}
            left={scoreBounds.left + this.state.scoreWidth}
          >
            {commentDivsWithHr}
          </CommentChain>
        )
      });
    }

    return (
      <div ref={this.scoreRef}>
        <div id="highlights" ref={this.highlightsDiv}>
          <Highlight
            key="next"
            top={this.state.highlightTop}
            left={this.state.highlightLeft}
            width={this.state.highlightWidth}
            height={this.state.highlightHeight}
          />
          {highlightDivs}
          {commentChainDivs}
        </div>
        {pdf}
      </div>
    );
  }
}

export default Score
