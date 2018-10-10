import React from "react";
import vextab from '../vextab';
import './VexTab.css';

class VexTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      error: ""
    };
    this.canvasRef = React.createRef();
    this.errorRef = React.createRef();
  }
  
  componentDidMount() {
    this.rerenderVexTab();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value != this.props.value || prevState.value != this.state.value) {
      this.rerenderVexTab();
    }
  }

  getValue() {
    if (this.props.onValueChange) return this.props.value;
    return this.state.value;
  }

  getWidth() {
    return this.props.width || 680;
  }

  getEditorWidth() {
    return this.props.editorWidth || 680;
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
      vextabObj.parse(this.getValue());
      artist.render(renderer);
      this.setState({error: ""});
    } catch (e) {
      console.error(e);
      this.setState({error: e.message.replace(/\n/g, '<br />')});
    }
  }

  onChange(e) {
    console.log("on change");
    if (this.props.onValueChange) {
      this.props.onValueChange(e.target.value);
    } else {
      this.setState({value: e.target.value});
    }
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
        <canvas
          className="vextab-canvas"
          ref={this.canvasRef}
        ></canvas>
        <textarea
          className="vextab-textarea"
          style={{height: this.getEditorHeight(), width: this.getEditorWidth()}}
          value={this.getValue()}
          onChange={(e) => this.onChange(e)}
        ></textarea>
        {error}
      </div>
    );
  }
}

export default VexTab
