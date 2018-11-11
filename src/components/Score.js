import React from "react";
import { firebase } from '../firebase';
import { Document, Page } from '../react-pdf';
import PDF from './PDF';
import "./Score.css";
import tools from '../tools';
import { Card, CardText, CardBody, CardTitle, Button } from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { HighlightOverlay } from './Highlight';
import { CommentColumn } from './Comment';

class NewScore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      versions: {},
      currVersion: null,
      commentChains: {},
      comments: {},
      pageLoaded: false,
      file: null,
      page: -1,
      numPages: 0,
      scoreWidth: 0,
      origScoreWidth: 0
    };
    this.username = "anonymous";

    this.scoreId = props.match.params.id;
    this.onPageLoad = this.onPageLoad.bind(this);
    this.onDocumentLoad = this.onDocumentLoad.bind(this);
    this.onCommentSubmit = this.onCommentSubmit.bind(this);

    this.scoreRef = firebase.database().ref('scores/' + this.scoreId);
    this.versionsRef = firebase.database().ref('versions/' + this.scoreId);
    this.commentChainsRef = null;
    this.commentsRef = null;
  }

  componentDidMount() {
    this.scoreRef.on('value', (score) => {
      let scoreVal = score.val() || {title: "Unknown"};
      console.log("got score", scoreVal);
      document.title = scoreVal.title;
    });
    this.versionsRef.on('value', (versions) => {
      let versionsVal = versions.val() || {};
      console.log("got versions", versionsVal);
      let newVersion = this.state.currVersion;
      if (Object.keys(versionsVal).length == 0) {
        newVersion = null;
      } else {
        if (!this.state.currVersion || !(this.state.currVersion in versions)) {
          newVersion = Object.keys(versionsVal)[0];
        }
      }
      console.log("new version", newVersion);

      this.setState({
        versions: versionsVal,
        currVersion: newVersion
      });
    });
  }

  componentWillUnmount() {
    this.scoreRef.off('value');
    this.versionsRef.off('value');
    if (this.commentChainsRef) this.commentChainsRef.off('value');
    if (this.commentsRef) this.commentsRef.off('value');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currVersion != this.state.currVersion) {
      this.onVersionChange();
    }
    if (prevState.file != this.state.file || prevState.page != this.state.page) {
      this.onPageChange();
    }
  }

  onVersionChange() {
    console.log("on version change", this.state.currVersion);
    if (!this.state.currVersion) {
      this.setState({
        file: null,
        page: -1
      });
      return;
    }
    let version = this.state.versions[this.state.currVersion];
    var pdfRef = firebase.storage().ref("pdfs/" + this.scoreId + '/' + this.state.currVersion + '/' + version.file);
    pdfRef.getDownloadURL().then((url) => {
      console.log("got url", url);
      this.setState({
        file: url,
        page: 0
      });
    });
  }

  onPageChange() {
    console.log("on page change", this.state.page);
    if (this.commentChainsRef) this.commentChainsRef.off('value');
    this.commentChainsRef = firebase.database().ref('comment-chains/' + this.scoreId + '/' + this.state.currVersion + '/' + this.state.page);
    this.commentChainsRef.on('value', (commentChains) => {
      let commentChainsVal = commentChains.val() || {};
      console.log("got comment chains", commentChainsVal);
      this.setState({commentChains: commentChainsVal});
    });

    if (this.commentsRef) this.commentsRef.off('value');
    this.commentsRef = firebase.database().ref('comments/' + this.scoreId + '/' + this.state.currVersion + '/' + this.state.page);
    this.commentsRef.on('value', (comments) => {
      let commentsVal = comments.val() || {};
      console.log("got comments", commentsVal);
      this.setState({comments: commentsVal});
    });
  }


  onInsertHighlight(bounds) {
    console.log('insert highlight', bounds);
  }

  onCommentSubmit(commentChainKey, type, content) {
    console.log('submit comment', commentChainKey, type, content);
    let commentsRef = firebase.database().ref('comments/' + this.scoreId + '/' + this.state.currVersion + '/' + this.state.page + '/' + commentChainKey);
    let commentRef = commentsRef.push();
    commentRef.set({
      username: this.username,
      type: type,
      content: content
    });
  }

  onDocumentLoad(pdf) {
    console.log('document load', pdf);
    this.setState({
      numPages: pdf.numPages
    });
  }
  
  onPageLoad(page) {
    console.log("page load", page);
    this.setState({
      pageLoaded: true,
      origScoreWidth: page.view[2],
      scoreWidth: 2*page.view[2]
    });
  }

  render() {
    let highlights = [];
    let commentChains = [];
    if (this.state.pageLoaded) {
      highlights = Object.keys(this.state.commentChains).map((commentChainId) => {
        let commentChain = this.state.commentChains[commentChainId];
        return {
          top: commentChain.highlightTop,
          left: commentChain.highlightLeft,
          width: commentChain.highlightWidth,
          height: commentChain.highlightHeight
        };
      });
      commentChains = Object.keys(this.state.commentChains).map((commentChainId) => {
        let commentChain = this.state.commentChains[commentChainId];
        let origComments = this.state.comments[commentChainId] || {};
        let comments = Object.keys(origComments).map((commentId) => {
          let comment = origComments[commentId];
          return {
            key: commentId,
            content: comment.content,
            type: comment.type,
            username: comment.username
          };
        });
        return {
          key: commentChainId,
          comments: comments,
          top: commentChain.commentChainTop
        };
      });
    }
    let paginationItems = [];
    for (let i = 0; i < this.state.numPages; i++) {
      paginationItems.push((
        <PaginationItem key={i}>
          <PaginationLink href="#" onClick={(e) => this.setState({page: i})}>
            {i+1}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    return (
      <div>
        <Pagination aria-label="Page navigation example">
          <PaginationItem>
            <PaginationLink previous href="#" />
          </PaginationItem>
          {paginationItems}
          <PaginationItem>
            <PaginationLink next href="#" />
          </PaginationItem>
        </Pagination>
        <table className="score-table">
          <tbody>
            <tr>
              <td style={{width: this.state.scoreWidth}}>
                <HighlightOverlay
                  onInsert={this.onInsertHighlight}
                  highlights={highlights}
                >
                  <PDF
                    file={this.state.file}
                    onDocumentLoad={this.onDocumentLoad}
                    page={this.state.page+1}
                    onPageLoad={this.onPageLoad}
                    width={this.state.scoreWidth}
                  />
                </HighlightOverlay>
              </td>
              <td>
                <CommentColumn
                  username={this.username}
                  commentChains={commentChains}
                  onSubmit={this.onCommentSubmit}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

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

export default NewScore
