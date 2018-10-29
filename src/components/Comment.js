import React from "react";
import "./Comment.css";

import { Card, CardText, CardBody, CardTitle, Button } from 'reactstrap';

class CommentChain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inserting: false,
      type: "",
      content: ""
    };
  }

  startInsert(type) {
    this.setState({
      inserting: true,
      type: type
    });
  }

  render() {
    return (
      <Card
        className="comment-chain"
        style={{top: this.props.top}}
      >
        <CardBody>
          {this.props.children}
          <Button onClick={e => this.startInsert("music")}>+ Music</Button>{' '}
          <Button onClick={e => this.startInsert("text")}>+ Text</Button>
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
