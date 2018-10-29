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
    this.onMusicValueChange = this.onMusicValueChange.bind(this);
    this.onTextValueChange = this.onTextValueChange.bind(this);
  }

  startInsert(e, type) {
    e.preventDefault();
    let defaultValue = type == "music" ? defaultMusic : "";
    this.setState({
      type: type,
      content: defaultValue
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

  }

  cancelComment(e) {

  }

  render() {
    let buttons = (
      <React.Fragment>
        <Button onClick={e => this.startInsert(e, "music")}>+ Music</Button>{' '}
        <Button onClick={e => this.startInsert(e, "text")}>+ Text</Button>
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
        <p>
        <textarea
          style={{width: 250, height: 80}}
          value={this.state.content}
          onChange={this.onTextValueChange}
        />
        </p>
      )
    }

    return (
      <Card
        className="comment-chain"
        style={{top: this.props.top}}
      >
        <CardBody>
          {this.props.children}
          {insertBox}
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
