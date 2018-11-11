import React from "react";
import { HighlightOverlay } from './Highlight';
import { CommentColumn } from './Comment';
import BodyClass from './BodyClass';
import PDF from './PDF';

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
        onInsert={this.onInsertHighlight}
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

class TestPDF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "https://firebasestorage.googleapis.com/v0/b/remusic-cf7bd.appspot.com/o/pdfs%2F-LMYFwjQjcZeMoq_Iz-P%2F-LMYFwjWVCEpnW63DEs2%2FDirty%20Little%20Secret.pdf?alt=media&token=fdd96ecd-c5bd-4192-bdc6-5128e5179dd9",
      page: 1,
      scale: 1.0,
      width: 0
    };
  }

  onDocumentLoad(pdf) {
    console.log("document load", pdf);
  }

  onPageLoad(page) {
    console.log("page load", page);
  }

  render() {
    return (
      <div>
        <p>
          File: <input
            type="text"
            size="80"
            value={this.state.file}
            onChange={e => this.setState({file: e.target.value})}
          />
        </p>
        <p>
          Page: <input
            type="number"
            value={this.state.page}
            min="1" step="1"
            onChange={e => this.setState({page: Number(e.target.value)})}
          />
        </p>
        <p>
          Scale: <input
            type="number"
            value={this.state.scale}
            onChange={e => this.setState({scale: Number(e.target.value)})}
          />
        </p>
        <p>
          Width: <input
            type="number"
            value={this.state.width}
            onChange={e => this.setState({width: Number(e.target.value)})}
          />
        </p>
        <PDF
          file={this.state.file}
          page={this.state.page}
          scale={this.state.scale}
          width={this.state.width}
          onDocumentLoad={this.onDocumentLoad}
          onPageLoad={this.onPageLoad}
        />
      </div>
    )
  }
}

const Test = () => (
  <BodyClass className="a b c">
    <div>
      <TestPDF />
      <TestHighlightOverlay />
      <TestCommentColumn />
    </div>
  </BodyClass>
);

export default Test
