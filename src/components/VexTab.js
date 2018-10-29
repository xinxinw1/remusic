import React from "react";
import vextab from '../vextab';
import './VexTab.css';

// props: width, scale, value, onRender
class VexTab extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.rerenderVexTab();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value != this.props.value) {
      this.rerenderVexTab();
    }
  }

  getWidth() {
    return this.props.width || 680;
  }

  getScale() {
    return this.props.scale || 1.0;
  }

  rerenderVexTab() {
    console.log("rerender vextab");
    var width = this.getWidth();
    var scale = this.getScale();
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
      if (this.props.onRender) this.props.onRender(null);
    } catch (e) {
      console.error('vextab error', e);
      if (this.props.onRender) this.props.onRender(e);
    }
  }

  render() {
    return (
      <canvas className="vextab-canvas" ref={this.canvasRef}>
      </canvas>
    );
  }
}


// props: value, width, editorWidth, editorHeight, scale, onValueChange
class VexTabEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
    this.onRender = this.onRender.bind(this);
  }

  getEditorWidth() {
    return this.props.editorWidth || 680;
  }

  getEditorHeight() {
    return this.props.editorHeight || 110;
  }

  onChange(e) {
    console.log("on change");
    this.props.onValueChange(e.target.value);
  }

  onRender(e) {
    if (e) {
      this.setState({error: e.message.replace(/\n/g, '<br />')});
    } else {
      this.setState({error: ""});
    }
  }

  render() {
    console.log("render");
    var error = null;
    if (this.state.error) {
      error = (
        <div
          className="vextab-error"
          dangerouslySetInnerHTML={{__html: this.state.error}}
        ></div>
      );
    }

    return (
      <div>
        <div>
          <VexTab
            width={this.props.width}
            scale={this.props.scale}
            value={this.props.value}
            onRender={this.onRender}
          />
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
      <VexTabEditor
        value={this.state.value}
        width={this.props.width}
        scale={this.props.scale}
        editorWidth={this.props.editorWidth}
        editorHeight={this.props.editorHeight}
        onValueChange={this.onValueChange}
      />
    );
  }
}

export {
  VexTab,
  VexTabEditor,
  VexTabStateful
};
