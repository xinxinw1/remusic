import React from "react";
import './Highlight.css';

const Highlight = (props) => (
  <div className="highlight" style={{
    top: props.top,
    left: props.left,
    width: props.width,
    height: props.height
  }}>
  </div>
);

const HighlightGroup = (props) => (
  <div className="highlight-group">
    {props.children}
  </div>
);

class Highlightable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseDown: false,
      mouseDownX: 0,
      mouseDownY: 0,
      highlightTop: 0,
      highlightLeft: 0,
      highlightWidth: 0,
      highlightHeight: 0
    };
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.highlightsDiv = React.createRef();
    this.mounted = false;
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.mouseUp, false);
    window.addEventListener('mousemove', this.mouseMove, false);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.mouseUp);
    window.removeEventListener('mousemove', this.mouseMove);
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

  mouseUp(e) {
    if (this.state.highlightWidth > 10 &&
        this.state.highlightHeight > 10) {
      this.props.onInsertHighlight({
        top: this.state.highlightTop,
        left: this.state.highlightLeft,
        width: this.state.highlightWidth,
        height: this.state.highlightHeight
      });
    }
    this.setState({
      mouseDown: false,
      mouseDownX: 0,
      mouseDownY: 0,
      highlightTop: 0,
      highlightLeft: 0,
      highlightWidth: 0,
      highlightHeight: 0
    });
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

  render() {
    return (
      <div className="highlightable-area" ref={this.highlightsDiv}>
        <HighlightGroup>
          <Highlight
            top={this.state.highlightTop}
            left={this.state.highlightLeft}
            width={this.state.highlightWidth}
            height={this.state.highlightHeight}
          />
        </HighlightGroup>
        <div onMouseDown={this.mouseDown}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const HighlightOverlay = (props) => {
  let highlights = props.highlights.map((highlight, index) => (
    <Highlight
      key={index}
      top={highlight.top}
      left={highlight.left}
      width={highlight.width}
      height={highlight.height}
    />
  ));
  return (
    <Highlightable onInsertHighlight={props.onInsertHighlight}>
      <HighlightGroup>
        {highlights}
      </HighlightGroup>
      {props.children}
    </Highlightable>
  );
}

export {
  Highlight,
  HighlightGroup,
  Highlightable,
  HighlightOverlay
}
