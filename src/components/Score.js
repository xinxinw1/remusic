import React from "react";
import { firebase } from '../firebase';
import PDF from './PDF';
import "./Score.css";
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { HighlightOverlay } from './Highlight';
import { CommentColumn } from './Comment';

class Score extends React.Component {
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
    this.onInsertHighlight = this.onInsertHighlight.bind(this);
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
    var commentChainsRef = firebase.database().ref('comment-chains/' + this.scoreId + '/' + this.state.currVersion + '/' + this.state.page);
    var commentChainRef = commentChainsRef.push();
    commentChainRef.set({
      highlightTop: bounds.top,
      highlightLeft: bounds.left,
      highlightWidth: bounds.width,
      highlightHeight: bounds.height,
      commentChainTop: bounds.top,
      commentChainLeft: this.state.scoreWidth + 20,
    });
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

export default Score
