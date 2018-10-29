import React from "react";
import { HighlightOverlay } from './Highlight';
import { CommentColumn } from './Comment';
import BodyClass from './BodyClass';

class TestHighlightOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlights: []
    };
    this.onInsertHighlight = this.onInsertHighlight.bind(this);
  }
    
  onInsertHighlight(bounds) {
    console.log('highlightable', bounds);
    this.setState((state) => ({
      highlights: state.highlights.concat([bounds])
    }));
  }

  render() {
    return (
      <HighlightOverlay
        onInsertHighlight={this.onInsertHighlight}
        highlights={this.state.highlights}
      >
        <div style={{
          height: 500,
          backgroundColor: "#CCC"
        }}>
        </div>
      </HighlightOverlay>
    )
  }
}

class TestCommentColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentChains: [
        {
          key: "chain1",
          top: 5,
          comments: [
            {
              key: "comment1",
              username: "hey",
              type: "text",
              content: "what"
            },
            {
              key: "comment2",
              username: "yo",
              type: "text",
              content: "whoa"
            }
          ]
        },
        {
          key: "chain2",
          top: 100,
          comments: [
            {
              key: "comment1",
              username: "hey",
              type: "text",
              content: "what"
            },
            {
              key: "comment2",
              username: "yo",
              type: "text",
              content: "whoa"
            }
          ]
        }
      ]
    };
  }

  onSubmit(commentChainKey, type, content) {
    console.log('submit comment', commentChainKey, type, content);
  }

  render() {
    return (
      <CommentColumn
        commentChains={this.state.commentChains}
        onSubmit={this.onSubmit}
      />
    )
  }
}

const Test = () => (
  <BodyClass className="a b c">
    <div>
      <TestHighlightOverlay />
      <TestCommentColumn />
    </div>
  </BodyClass>
);

export default Test
