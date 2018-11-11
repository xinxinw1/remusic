import React from 'react';
import PdfJsLib from 'pdfjs-dist';
import Mutex from 'await-mutex';

// props: file, page, scale, width, onDocumentLoad, onPageLoad
class PDF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pdf: null,
    };
    this.canvasRef = React.createRef();
    this.rerenderPDF = this.rerenderPDF.bind(this);
    this.canvasMutex = new Mutex();
  }

  componentDidMount() {
    PdfJsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js';
    this.onFileChange();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.file != this.props.file) {
      this.onFileChange();
    } else {
      if (prevProps.page != this.props.page ||
          prevProps.scale != this.props.scale ||
          prevProps.width != this.props.width) {
        this.onPageChange();
      }
    }
  }

  onFileChange() {
    if (this.props.file) {
      PdfJsLib.getDocument(this.props.file).then(pdf => {
        this.setState({pdf: pdf}, () => {
          if (this.props.onDocumentLoad) this.props.onDocumentLoad(pdf);
          this.onPageChange();
        });
      });
    }
  }

  onPageChange() {
    if (this.props.page) {
      this.state.pdf.getPage(this.props.page).then(page => {
        if (this.props.onPageLoad) this.props.onPageLoad(page);
        this.rerenderPDF(page);
      });
    }
  }

  async rerenderPDF(page) {
    let unlock = await this.canvasMutex.lock();
    try {
      let origWidth = page.view[2];
      let givenWidth = this.props.width || origWidth;
      let givenScale = this.props.scale || 1.0;
      let scale = givenWidth / origWidth * givenScale;
      let viewport = page.getViewport(scale);
      let canvasContext = this.canvasRef.current.getContext('2d');
      this.canvasRef.current.height = viewport.height;
      this.canvasRef.current.width = viewport.width;
      await page.render({canvasContext, viewport}).promise;
    } finally {
      unlock();
    }
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

export default PDF
