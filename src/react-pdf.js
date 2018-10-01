import { setOptions } from 'react-pdf';

setOptions({
  workerSrc: '/pdf.worker.js'
});

export * from 'react-pdf'
