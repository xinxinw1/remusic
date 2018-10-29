import React from "react";
import vextab from '../vextab';
import './VexTab.css';

// props: value, width, editorWidth, editorHeight, scale, onValueChange
class VexTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
    this.canvasRef = React.createRef();
    this.errorRef = React.createRef();
  }
  
  componentDidMount() {
    this.rerenderVexTab();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value != this.props.value) {
      this.rerenderVexTab();
    }
  }

  getValue() {
    return this.props.value;
  }

  getWidth() {
    return this.props.width || 680;
  }

  getEditorWidth() {
    return this.props.editorWidth || this.props.width || 680;
  }

  getEditorHeight() {
    return this.props.editorHeight || 110;
  }

  rerenderVexTab() {
    console.log("rerender vextab");
    var width = this.getWidth();
    var scale = this.props.scale || 1.0;
    var Renderer = vextab.Flow.Renderer;
    // Create VexFlow Renderer from canvas element with id #boo
    var renderer = new Renderer(this.canvasRef.current, Renderer.Backends.CANVAS);
    // Initialize VexTab artist and parser.
    var artist = new vextab.Artist(0, 0, width, {scale: scale});
    var vextabObj = new vextab.VexTab(artist);
    try {
      vextabObj.reset();
      artist.reset();
      vextabObj.parse(this.props.value);
      artist.render(renderer);
      this.setState({error: ""});
    } catch (e) {
      console.error(e);
      this.setState({error: e.message.replace(/\n/g, '<br />')});
    }
  }

  onChange(e) {
    console.log("on change");
    this.props.onValueChange(e.target.value);
  }


  render() {
    console.log("render");
    var error = null;
    if (this.state.error) {
      error = (
        <div
          className="vextab-error"
          ref={this.errorRef}
          dangerouslySetInnerHTML={{__html: this.state.error}}></div>
      );
    }

    return (
      <div>
        <div>
          <canvas
            className="vextab-canvas"
            ref={this.canvasRef}
          ></canvas>
        </div>
        <div>
          <textarea
            className="vextab-textarea"
            style={{height: this.getEditorHeight(), width: this.getEditorWidth()}}
            value={this.props.value}
            onChange={(e) => this.onChange(e)}
          ></textarea>
        </div>
        {error}
      </div>
    );
  }
}

// props: initValue, width, editorWidth, editorHeight, scale
class VexTabStateful extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initValue,
    };
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(newValue) {
    this.setState({value: newValue});
  }
  
  render() {
    return (
      <VexTab
        value={this.state.value}
        width={this.props.width}
        editorWidth={this.props.editorWidth}
        editorHeight={this.props.editorHeight}
        scale={this.props.scale}
        onValueChange={this.onValueChange}
      />
    );
  }
}

export {
  VexTab,
  VexTabStateful
};
