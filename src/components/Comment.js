import React from "react";
import "./Comment.css";

import { VexTab } from './VexTab';
import { Card, CardText, CardBody, CardTitle, Button } from 'reactstrap';

const defaultMusic = `stave clef=treble key=Bb time=4/4
notes :4 A/4 B/4 C/4 D/4`;

class CommentChain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      content: ""
    };
    this.startInsertMusic = this.startInsertMusic.bind(this);
    this.startInsertText = this.startInsertText.bind(this);
    this.onMusicValueChange = this.onMusicValueChange.bind(this);
    this.onTextValueChange = this.onTextValueChange.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.cancelComment = this.cancelComment.bind(this);
  }

  startInsertMusic(e) {
    this.setState({
      type: "music",
      content: defaultMusic
    });
  }

  startInsertText(e) {
    this.setState({
      type: "text",
      content: ""
    });
  }

  onMusicValueChange(newValue) {
    this.setState({
      content: newValue
    });
  }

  onTextValueChange(e) {
    this.setState({
      content: e.target.value
    });
  }

  submitComment(e) {
    this.props.onSubmit(this.state.type, this.state.content);
  }

  cancelComment(e) {
    this.setState({
      type: "",
      content: ""
    });
  }

  render() {
    let buttons = (
      <React.Fragment>
        <Button onClick={this.startInsertMusic}>+ Music</Button>{' '}
        <Button onClick={this.startInsertText}>+ Text</Button>
      </React.Fragment>
    );
    if (this.state.type) {
      buttons = (
        <React.Fragment>
          <Button onClick={this.submitComment}>Submit</Button>{' '}
          <Button onClick={this.cancelComment}>Cancel</Button>
        </React.Fragment>
      );
    }
    let insertBox = null;
    if (this.state.type == "music") {
      insertBox = (
        <VexTab
          width={250}
          editorHeight={80}
          value={this.state.content}
          onValueChange={this.onMusicValueChange}
        />
      )
    } else if (this.state.type == "text") {
      insertBox = (
        <textarea
          style={{width: 250, height: 80}}
          value={this.state.content}
          onChange={this.onTextValueChange}
        />
      )
    }

    let insertArea = null;
    if (this.state.type) {
      insertArea = (
        <React.Fragment>
          <CardTitle>curr_username</CardTitle>
          <div className="insert-area">
            {insertBox}
          </div>
        </React.Fragment>
      );
    }

    return (
      <Card
        className="comment-chain"
        style={{top: this.props.top}}
      >
        <CardBody>
          {this.props.children}
          {insertArea}
          {buttons}
        </CardBody>
      </Card>
    )
  }
}

class Comment extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CardTitle>{this.props.username}</CardTitle>
        <CardText>{this.props.type} - {this.props.content}</CardText>
      </React.Fragment>
    )
  }
}

class CommentColumn extends React.Component {
  render() {
    let commentChains = this.props.commentChains.map(commentChain => {
      let comments = commentChain.comments.map(comment => {
        return (
          <Comment
            key={comment.key}
            username={comment.username}
            type={comment.type}
            content={comment.content}
          />
        );
      });

      return (
        <CommentChain
          key={commentChain.key}
          top={commentChain.top}
          onSubmit={(type, content) => this.props.onSubmit(commentChain.key, type, content)}
        >
          {comments}
        </CommentChain>
      );
    });
    return (
      <div className="comment-column">
        {commentChains}
      </div>
    );
  }
}

export {
  Comment,
  CommentChain,
  CommentColumn
}
